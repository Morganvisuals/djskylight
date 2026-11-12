<?php
/**
 * contact.php — Formulaire de contact djskylight.fr
 * Vérifie la demande (anti-bot, anti-spam, anti-phishing), l'enregistre dans MySQL et l'envoie par e-mail.
 *
 * Ordre des contrôles (du moins coûteux au plus coûteux) :
 *   origine → blocage des récidivistes → honeypots → jeton signé → longueurs / nettoyage / validation
 *   → Cloudflare Turnstile → filtre de contenu → limites de fréquence → MySQL → e-mail
 *
 * Clés de la config privée (hors GitHub) utilisées ici :
 *   db_host, db_name, db_user, db_pass, from_name, from_address, recipient   (existantes)
 *   turnstile_site_key, turnstile_secret                                    (Cloudflare Turnstile)
 *   form_secret        (optionnel) clé HMAC du jeton, sinon dérivée de db_pass
 *   allowed_hosts      (optionnel) domaines autorisés, défaut djskylight.fr + www
 *   check_email_dns    (optionnel) false pour désactiver la vérification DNS du domaine e-mail
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');
header('Cache-Control: no-store');

function respond(int $code, array $payload) {
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

// Charger la configuration privée hors GitHub (DJSKYLIGHT_CONFIG = tests en local uniquement)
$configPath = getenv('DJSKYLIGHT_CONFIG') ?: '/home/hocp8711/private/djskylight_config.php';

if (!file_exists($configPath)) {
    error_log('contact.php: fichier config djskylight introuvable.');
    respond(500, [
        'ok' => false,
        'error' => 'Configuration serveur manquante.'
    ]);
}

$config     = require $configPath;
$privateDir = dirname($configPath);
$rateDir    = $privateDir . '/djskylight_ratelimit';
$logFile    = $privateDir . '/djskylight_blocked.log';

// ---------------------------------------------------------------------------
// RÉGLAGES
// ---------------------------------------------------------------------------

const MAX_LEN = [
    'prenom'  => 100,
    'nom'     => 100,
    'name'    => 100,
    'email'   => 254,
    'subject' => 150,
    'message' => 5000,
];
const MIN_MESSAGE_LEN  = 10;
const MIN_FILL_SECONDS = 3;      // un humain met plus de 3 s à remplir le formulaire
const TOKEN_MAX_AGE    = 7200;   // jeton valable 2 h
const RATE_RULES_IP      = [60 => 1, 3600 => 5];     // 1 envoi / min, 5 / heure par IP
const RATE_RULES_EMAIL   = [3600 => 2, 86400 => 5];  // 2 / heure, 5 / jour par adresse e-mail
const RATE_RULES_DUP     = [86400 => 1];             // même message : 1 fois / 24 h, toutes IP confondues
const RATE_RULES_GLOBAL  = [3600 => 30];             // 30 envois / heure au total
const STRIKE_RULES       = [3600 => 5];              // 5 tentatives bloquées / heure → IP bloquée 1 h
const SPAM_BLOCK_SCORE   = 6;    // score ≥ 6 : message refusé
const SPAM_SUSPECT_SCORE = 2;    // score ≥ 2 : message livré mais signalé « À VÉRIFIER »

$allowedHosts = array_map('strtolower', $config['allowed_hosts'] ?? ['djskylight.fr', 'www.djskylight.fr']);
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

// ---------------------------------------------------------------------------
// OUTILS
// ---------------------------------------------------------------------------

function str_len(string $s): int {
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);
}

function lower(string $s): string {
    return function_exists('mb_strtolower') ? mb_strtolower($s, 'UTF-8') : strtolower($s);
}

function ends_with_domain(string $host, string $domain): bool {
    return $host === $domain || substr($host, -strlen($domain) - 1) === '.' . $domain;
}

function host_in(string $host, array $domains): bool {
    foreach ($domains as $d) {
        if (ends_with_domain($host, $d)) {
            return true;
        }
    }
    return false;
}

/** Journal des tentatives bloquées (hors dossier public), pour repérer d'éventuels faux positifs. */
function log_blocked(string $file, string $reason, array $extra = []) {
    if (@filesize($file) > 2000000) {
        @rename($file, $file . '.1');
    }
    $entry = [
        'date'   => date('c'),
        'reason' => $reason,
        'ip'     => $_SERVER['REMOTE_ADDR'] ?? null,
        'ua'     => substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 200),
    ] + $extra;
    @file_put_contents($file, json_encode($entry, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n", FILE_APPEND | LOCK_EX);
}

// Clé de signature : "form_secret" dans la config privée, sinon dérivée du mot de passe BDD
$formSecret = $config['form_secret'] ?? hash('sha256', 'djskylight-form|' . $config['db_pass']);

function make_token(string $secret): string {
    $ts = (string) time();
    return $ts . '.' . hash_hmac('sha256', $ts, $secret);
}

/** Renvoie null si le jeton est valide, sinon la raison du rejet. */
function check_token(string $token, string $secret): ?string {
    if (!preg_match('/^(\d{10})\.([a-f0-9]{64})$/', $token, $m)) {
        return 'missing';
    }
    if (!hash_equals(hash_hmac('sha256', $m[1], $secret), $m[2])) {
        return 'invalid';
    }
    $age = time() - (int) $m[1];
    if ($age < MIN_FILL_SECONDS) {
        return 'too_fast';
    }
    if ($age > TOKEN_MAX_AGE) {
        return 'expired';
    }
    return null;
}

/**
 * Limite de fréquence par fichier (verrouillé avec flock).
 * Renvoie 0 si l'envoi est autorisé, sinon le nombre de secondes à attendre.
 * $record : enregistre la tentative si elle est autorisée (ou dans tous les cas avec $always).
 */
function rate_limit(string $dir, string $key, array $rules, bool $record = true, bool $always = false): int {
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) {
        error_log('contact.php: dossier rate-limit non accessible : ' . $dir);
        return 0;
    }
    $fh = @fopen($dir . '/' . hash('sha256', $key) . '.json', 'c+');
    if (!$fh) {
        return 0;
    }
    flock($fh, LOCK_EX);
    $now   = time();
    $hits  = json_decode(stream_get_contents($fh) ?: '[]', true) ?: [];
    $hits  = array_values(array_filter($hits, fn($t) => $t > $now - max(array_keys($rules))));
    $retry = 0;
    foreach ($rules as $window => $max) {
        $inWindow = array_values(array_filter($hits, fn($t) => $t > $now - $window));
        if (count($inWindow) >= $max) {
            $retry = max($retry, $inWindow[count($inWindow) - $max] + $window - $now);
        }
    }
    if ($record && ($retry === 0 || $always)) {
        $hits[] = $now;
    }
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($hits));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $retry;
}

/** Tentative bloquée : journalise, compte un « strike » pour l'IP et répond. */
function reject(int $code, string $reason, array $payload, array $logExtra = []) {
    global $logFile, $rateDir, $ip;
    log_blocked($logFile, $reason, $logExtra);
    rate_limit($rateDir, 'strike:' . $ip, STRIKE_RULES, true, true);
    respond($code, $payload);
}

/**
 * Nettoie un champ texte : UTF-8 valide, sans caractères de contrôle ni caractères invisibles
 * (zero-width, inversion bidi — utilisés pour masquer des liens de phishing).
 * Renvoie null si l'encodage est invalide.
 */
function clean_text(string $s, bool $multiline): ?string {
    if (function_exists('mb_check_encoding') && !mb_check_encoding($s, 'UTF-8')) {
        return null;
    }
    if (class_exists('Normalizer')) {
        $s = Normalizer::normalize($s, Normalizer::FORM_C) ?: $s;
    }
    $s = preg_replace('/[\x{200B}-\x{200F}\x{202A}-\x{202E}\x{2060}-\x{2064}\x{2066}-\x{2069}\x{FEFF}\x{00AD}]/u', '', $s);
    if ($multiline) {
        $s = str_replace(["\r\n", "\r"], "\n", $s);
        $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $s);
        $s = preg_replace('/[ \t]+$/m', '', $s);
        $s = preg_replace("/\n{4,}/", "\n\n\n", $s);
    } else {
        $s = preg_replace('/[\x00-\x1F\x7F]+/', ' ', $s);
        $s = preg_replace('/\s{2,}/u', ' ', $s);
    }
    return trim($s);
}

/** Vérifie que le domaine de l'adresse e-mail n'est pas jetable et peut recevoir du courrier. */
function email_domain_ok(string $email): bool {
    $domain = lower(substr(strrchr($email, '@'), 1));
    $disposable = [
        'mailinator.com', 'yopmail.com', 'yopmail.fr', 'yopmail.net', 'guerrillamail.com', 'guerrillamail.net',
        'sharklasers.com', 'grr.la', '10minutemail.com', 'temp-mail.org', 'tempmail.com', 'tempmailo.com',
        'trashmail.com', 'getnada.com', 'dispostable.com', 'maildrop.cc', 'mohmal.com', 'emailondeck.com',
        'throwawaymail.com', 'fakeinbox.com', 'minuteinbox.com', 'mailnesia.com', 'jetable.org', 'spam4.me',
    ];
    if (host_in($domain, $disposable)) {
        return false;
    }
    if (!function_exists('checkdnsrr')) {
        return true;
    }
    if (function_exists('idn_to_ascii')) {
        $domain = idn_to_ascii($domain, IDNA_DEFAULT, INTL_IDNA_VARIANT_UTS46) ?: $domain;
    }
    return checkdnsrr($domain, 'MX') || checkdnsrr($domain, 'A') || checkdnsrr($domain, 'AAAA');
}

/** Vérification Cloudflare Turnstile côté serveur. Renvoie null si OK, sinon la raison. */
function turnstile_verify(string $secret, string $token, string $ip, array $hosts): ?string {
    if ($token === '' || strlen($token) > 2048) {
        return 'captcha_missing';
    }
    $url  = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    $post = http_build_query(['secret' => $secret, 'response' => $token, 'remoteip' => $ip]);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $post,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT        => 10,
        ]);
        $raw = curl_exec($ch);
    } else {
        $raw = @file_get_contents($url, false, stream_context_create(['http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $post,
            'timeout' => 10,
        ]]));
    }

    $data = is_string($raw) ? json_decode($raw, true) : null;
    if (!is_array($data)) {
        error_log('contact.php: Turnstile injoignable.');
        return 'captcha_unreachable';
    }
    if (empty($data['success'])) {
        return 'captcha_failed:' . implode(',', (array) ($data['error-codes'] ?? []));
    }
    if (!empty($data['hostname']) && !in_array(lower($data['hostname']), $hosts, true)) {
        return 'captcha_hostname:' . $data['hostname'];
    }
    if (!empty($data['action']) && $data['action'] !== 'contact') {
        return 'captcha_action';
    }
    return null;
}

/** Extrait les liens d'un texte (http(s)://, www., et domaines nus du type exemple.xyz/page). */
function extract_urls(string $text): array {
    $urls = [];
    if (preg_match_all('~(?:https?://|www\.)[^\s<>"\'\]\)]+~iu', $text, $m)) {
        $urls = $m[0];
        $text = str_replace($m[0], ' ', $text);
    }
    $tlds = 'com|net|org|info|biz|fr|io|co|me|app|dev|xyz|top|ru|su|cn|tk|ml|ga|cf|gq|ly|gl|gd|cc|to|site|online|live|link|click|shop|store|page|icu|buzz|sbs|cfd|cyou|rest|monster|best|club|vip|pro';
    if (preg_match_all('~(?<![@\w.-])(?:[a-z0-9-]+\.)+(?:' . $tlds . ')\b(?![.-]?\w*@)(?:/[^\s<>"\']*)?~iu', $text, $m)) {
        $urls = array_merge($urls, $m[0]);
    }
    return $urls;
}

function url_host(string $url): string {
    $u = preg_replace('~^(?:https?://)~i', '', $url);
    $u = preg_split('~[/?#:]~', $u, 2)[0];
    return lower(rtrim($u, '.'));
}

/**
 * Score anti-spam / anti-phishing du message. Renvoie [score, raisons].
 * Les vrais clients écrivent rarement plus d'un lien ; les fausses demandes de booking
 * renvoient presque toujours vers un lien (document partagé, raccourcisseur, faux site).
 */
function spam_score(string $message, string $extra): array {
    $score = 0;
    $why   = [];
    $all   = $message . "\n" . $extra;
    $text  = lower($all);

    // HTML / BBCode : jamais dans un vrai message
    if (preg_match('~<\s*(a|script|iframe|img|form|meta|object|embed|svg)\b|href\s*=|\[/?(url|link|img)\b|javascript:|data:text/html~i', $text)) {
        $score += 10;
        $why[] = 'html';
    }

    $trusted = [
        'djskylight.fr', 'instagram.com', 'facebook.com', 'fb.com', 'fb.me', 'youtube.com', 'youtu.be',
        'soundcloud.com', 'spotify.com', 'deezer.com', 'music.apple.com', 'tiktok.com', 'wa.me', 'whatsapp.com',
        'linkedin.com', 'linktr.ee',
    ];
    $maps = ['maps.app.goo.gl', 'maps.google.com', 'maps.google.fr', 'maps.apple.com'];
    $shorteners = [
        'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'cutt.ly', 'is.gd', 'rb.gy', 'shorturl.at', 'tiny.cc', 'ow.ly',
        'buff.ly', 'rebrand.ly', 's.id', 't.ly', 'v.gd', 'bl.ink', 'lnkd.in', 'qrco.de', 'shorte.st', 'adf.ly',
        'tinyurl.is', 'surl.li', 'clck.ru', 'u.to', 'gg.gg',
    ];
    // Partage de fichiers et hébergeurs gratuits : vecteurs classiques des fausses demandes de booking
    $fileHosts = [
        'drive.google.com', 'docs.google.com', 'forms.gle', 'sites.google.com', 'storage.googleapis.com',
        'onedrive.live.com', '1drv.ms', 'sharepoint.com', 'dropbox.com', 'wetransfer.com', 'we.tl', 'mega.nz',
        'mediafire.com', 'telegra.ph', 't.me', 'notion.site', 'canva.site', 'wixsite.com', 'weebly.com',
        'blogspot.com', 'github.io', 'pages.dev', 'workers.dev', 'netlify.app', 'vercel.app', 'firebaseapp.com',
        'web.app', 'glitch.me', 'ngrok.io', 'ngrok-free.app', 'r2.dev', 'ipfs.io', 'square.site', 'jotform.com',
        'docsend.com', 'box.com', 'icloud.com', 'adobe.com', 'docusign.net',
    ];

    foreach (extract_urls($all) as $url) {
        $host = url_host($url);
        $pos  = stripos($url, $host);
        $path = lower($pos === false ? '' : (string) substr($url, $pos + strlen($host)));

        if (host_in($host, $maps) || ($host === 'goo.gl' && strpos($path, '/maps') === 0)) {
            $pts = 1;
        } elseif (host_in($host, $shorteners)) {
            $pts = 6;
            $why[] = 'shortener';
        } elseif (host_in($host, $fileHosts)) {
            $pts = 4;
            $why[] = 'file_host';
        } elseif (host_in($host, $trusted)) {
            $pts = 1;
        } else {
            $pts = 2;
        }
        if (preg_match('~^\d{1,3}(\.\d{1,3}){3}$~', $host) || strpos($host, 'xn--') !== false) {
            $pts = max($pts, 6);
            $why[] = 'ip_or_punycode';
        }
        if (preg_match('~\.(xyz|top|ru|su|cn|tk|ml|ga|cf|gq|click|link|icu|buzz|sbs|cfd|cyou|rest|monster|online|site|live|shop)$~', $host)) {
            $pts += 2;
            $why[] = 'risky_tld';
        }
        if (preg_match('~\.(exe|scr|apk|bat|cmd|js|vbs|jar|msi|iso|img|zip|rar|7z|html?|php|lnk|hta)(?:$|[?#])~', $path)) {
            $pts += 4;
            $why[] = 'file_link';
        }
        $score += $pts;
        $why[] = 'link';
    }

    // Vocabulaire de phishing / spam (FR + EN) — motif => points
    $patterns = [
        '~\b(mot de passe|password|identifiants?|login|sign[ -]?in|connectez[- ]vous)\b~u' => 2,
        '~\b(verify|v[ée]rifie[rz]?) (your|votre) (account|compte|identit)~u' => 2,
        '~\b(account|compte) (suspended|suspendu|bloqu[ée])~u' => 2,
        '~\b(bitcoin|btc|crypto|usdt|ethereum|wallet|forex|binance|western union|moneygram)\b~u' => 4,
        '~\b(gift ?cards?|cartes? cadeaux?|lottery|loterie|inheritance|h[ée]ritage|lucky winner)\b~u' => 4,
        '~\b(casino|viagra|cialis|porn|escort|payday loan)\b~u' => 4,
        '~\b(seo|backlinks?|guest post|r[ée]f[ée]rencement|google ranking|first page of google|web ?design services?|marketing services?)\b~u' => 4,
        '~\b(click here|cliquez ici|clique ici|tap here)\b~u' => 2,
        '~\b(kindly|dear (artist|sir|madam))\b~u' => 2,
        '~\b(download|t[ée]l[ée]charge[rz]?|open|ouvre[rz]?|view|consulte[rz]?|see) (the |le |la |les )?(attached|attachment|pi[èe]ce jointe|document|file|fichier|contract|contrat|event details|d[ée]tails de l)~u' => 2,
    ];
    $kw = 0;
    foreach ($patterns as $p => $pts) {
        if (preg_match($p, $text)) {
            $kw += $pts;
        }
    }
    if ($kw) {
        $score += min($kw, 8);
        $why[] = 'keywords:' . $kw;
    }

    // Écritures inhabituelles pour un DJ des Antilles (spam international)
    if (preg_match('~[\p{Cyrillic}\p{Han}\p{Hangul}\p{Thai}]~u', $message)) {
        $score += 3;
        $why[] = 'script';
    }

    return [$score, array_values(array_unique($why))];
}

/** Rend les liens non cliquables dans l'e-mail reçu (protection anti-phishing). */
function defang(string $text): string {
    $map = [];
    foreach (extract_urls($text) as $u) {
        $map[$u] = str_replace('.', '[.]', preg_replace('~^http~i', 'hxxp', $u));
    }
    return strtr($text, $map);
}

// ---------------------------------------------------------------------------
// GET ?token=1 → jeton signé + clé publique Turnstile (demandés quand le visiteur commence à remplir)
// ---------------------------------------------------------------------------

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['token'])) {
    respond(200, [
        'ok' => true,
        'token' => make_token($formSecret),
        'turnstile' => !empty($config['turnstile_secret']) ? ($config['turnstile_site_key'] ?? null) : null,
    ]);
}

// Accepter uniquement les requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, [
        'ok' => false,
        'error' => 'Méthode non autorisée.'
    ]);
}

// Origine : la requête doit venir du site (quand le navigateur l'indique)
$source = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if ($source !== '') {
    $sourceHost = lower((string) parse_url($source, PHP_URL_HOST));
    if (!in_array($sourceHost, $allowedHosts, true)) {
        reject(403, 'origin', ['ok' => false, 'error' => 'Envoi refusé.', 'reason' => 'origin'], ['origin' => substr($source, 0, 200)]);
    }
}

// IP ayant déjà accumulé trop de tentatives bloquées
$strikeRetry = rate_limit($rateDir, 'strike:' . $ip, STRIKE_RULES, false);
if ($strikeRetry > 0) {
    header('Retry-After: ' . $strikeRetry);
    respond(429, [
        'ok' => false,
        'error' => 'Trop de tentatives. Réessayez plus tard.',
        'retry_after' => $strikeRetry
    ]);
}

// Honeypots (champs invisibles : seul un bot les remplit) → fausse réussite, le bot ne réessaie pas
if (!empty($_POST['_gotcha']) || !empty($_POST['website'])) {
    log_blocked($logFile, 'honeypot');
    rate_limit($rateDir, 'strike:' . $ip, STRIKE_RULES, true, true);
    respond(200, ['ok' => true]);
}

// Jeton temporel : absent / falsifié / envoyé trop vite = bot
$tokenError = check_token((string) ($_POST['_token'] ?? ''), $formSecret);
if ($tokenError !== null) {
    $payload = ['ok' => false, 'error' => 'Envoi refusé.', 'reason' => $tokenError];
    if ($tokenError === 'expired') {
        respond(400, $payload);  // page restée ouverte trop longtemps : pas une attaque
    }
    reject(400, 'token_' . $tokenError, $payload);
}

// Types et longueurs maximales (avant tout traitement)
$tooLong = [];
foreach (MAX_LEN as $field => $max) {
    if (isset($_POST[$field]) && (!is_string($_POST[$field]) || str_len(trim($_POST[$field])) > $max)) {
        $tooLong[] = $field;
    }
}
if ($tooLong) {
    respond(422, [
        'ok' => false,
        'error' => 'Champs trop longs.',
        'fields' => $tooLong
    ]);
}

// Récupération et nettoyage des champs du formulaire
$errors = [];
$fields = [];
foreach (['prenom' => false, 'nom' => false, 'name' => false, 'email' => false, 'subject' => false, 'message' => true] as $field => $multiline) {
    $value = clean_text((string) ($_POST[$field] ?? ''), $multiline);
    if ($value === null) {
        $errors[] = $field;
        $value = '';
    }
    $fields[$field] = $value;
}

$prenomInput = $fields['prenom'];
$nomInput    = $fields['nom'];
$name        = $fields['name'] !== '' ? $fields['name'] : trim($prenomInput . ' ' . $nomInput);
$email       = lower($fields['email']);
$subject     = $fields['subject'];
$message     = $fields['message'];

// Validation
if ($prenomInput === '' && $name === '') {
    $errors[] = 'prenom';
}

if ($nomInput === '' && $name === '') {
    $errors[] = 'nom';
}

// Un nom : lettres (tous alphabets), chiffres, espaces, apostrophes, tirets, points — jamais de lien
foreach (['prenom' => $prenomInput, 'nom' => $nomInput, 'name' => $name] as $field => $value) {
    if ($value === '') {
        continue;
    }
    if (!preg_match("~^[\\p{L}\\p{M}\\p{N}][\\p{L}\\p{M}\\p{N} '’.&-]*$~u", $value)
        || preg_match('~https?|www\.|\.(com|net|org|ru|xyz|top|io|fr)\b~i', $value)) {
        $errors[] = $field === 'name' ? 'nom' : $field;
    }
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || (($config['check_email_dns'] ?? true) && !email_domain_ok($email))) {
    $errors[] = 'email';
}

if (str_len($message) < MIN_MESSAGE_LEN || !preg_match('~\p{L}~u', $message)) {
    $errors[] = 'message';
}

if ($errors) {
    respond(422, [
        'ok' => false,
        'error' => 'Champs invalides.',
        'fields' => array_values(array_unique($errors))
    ]);
}

// Cloudflare Turnstile (obligatoire dès que turnstile_secret est renseigné dans la config privée)
if (!empty($config['turnstile_secret'])) {
    $captchaError = turnstile_verify(
        $config['turnstile_secret'],
        (string) ($_POST['cf-turnstile-response'] ?? ''),
        $ip,
        $allowedHosts
    );
    if ($captchaError === 'captcha_unreachable') {
        respond(503, ['ok' => false, 'error' => 'Vérification anti-spam indisponible.', 'reason' => 'captcha']);
    }
    if ($captchaError !== null) {
        reject(403, $captchaError, ['ok' => false, 'error' => 'Vérification anti-spam échouée.', 'reason' => 'captcha'], ['email' => $email]);
    }
} else {
    error_log('contact.php: turnstile_secret absent de la config — Turnstile désactivé.');
}

// Filtre de contenu : liens suspects, phishing, spam
[$spamScore, $spamReasons] = spam_score($message, $name . ' ' . $subject);
if ($spamScore >= SPAM_BLOCK_SCORE) {
    reject(422, 'content', [
        'ok' => false,
        'error' => 'Message refusé par le filtre anti-spam.',
        'reason' => 'content'
    ], [
        'score' => $spamScore,
        'why' => $spamReasons,
        'email' => $email,
        'name' => $name,
        'excerpt' => function_exists('mb_substr') ? mb_substr($message, 0, 500) : substr($message, 0, 500),
    ]);
}
$isSuspect = $spamScore >= SPAM_SUSPECT_SCORE;

// Limites de fréquence (stockage hors du dossier public).
// Vérifiées ici, comptées seulement après l'enregistrement réussi en base (une panne BDD ne bloque pas le client).
$dupKey = 'msg:' . hash('sha256', preg_replace('~[^\p{L}\p{N}]+~u', '', lower($message)));
$limits = [
    ['ip:' . $ip, RATE_RULES_IP],
    ['email:' . $email, RATE_RULES_EMAIL],
    [$dupKey, RATE_RULES_DUP],
    ['global', RATE_RULES_GLOBAL],
];
$retry = 0;
foreach ($limits as [$key, $rules]) {
    $retry = max($retry, rate_limit($rateDir, $key, $rules, false));
}
if ($retry > 0) {
    log_blocked($logFile, 'rate_limit', ['email' => $email]);
    header('Retry-After: ' . $retry);
    respond(429, [
        'ok' => false,
        'error' => 'Trop de messages envoyés. Réessayez plus tard.',
        'retry_after' => $retry
    ]);
}

// Sujet par défaut
if ($subject === '') {
    $subject = 'Nouveau message depuis djskylight.fr';
}
if ($isSuspect) {
    $subject = '[À VÉRIFIER] ' . $subject;
}

// La table MySQL demande prenom + nom.
// Le formulaire envoie deja ces champs, avec repli si un ancien champ "name" existe.
$nameParts = preg_split('/\s+/', $name, 2);

$prenom = $prenomInput !== '' ? $prenomInput : ($nameParts[0] ?? 'Non renseigné');
$nom    = $nomInput !== '' ? $nomInput : ($nameParts[1] ?? 'Non renseigné');

if ($prenom === '') {
    $prenom = 'Non renseigné';
}

if ($nom === '') {
    $nom = 'Non renseigné';
}

// Message complet stocké en base
$fullMessage = "Sujet : " . $subject . "\n\n" . $message;

// Infos techniques
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
$userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? substr($_SERVER['HTTP_USER_AGENT'], 0, 255) : null;

// ---------------------------------------------------------------------------
// 1. ENREGISTREMENT MYSQL (requête préparée : pas d'injection SQL possible)
// ---------------------------------------------------------------------------

try {
    $pdo = new PDO(
        'mysql:host=' . $config['db_host'] . ';dbname=' . $config['db_name'] . ';charset=utf8mb4',
        $config['db_user'],
        $config['db_pass'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    $stmt = $pdo->prepare("
        INSERT INTO contact_messages
        (prenom, nom, email, message, ip_address, user_agent, status)
        VALUES
        (:prenom, :nom, :email, :message, :ip_address, :user_agent, :status)
    ");

    $stmt->execute([
        ':prenom' => $prenom,
        ':nom' => $nom,
        ':email' => $email,
        ':message' => $fullMessage,
        ':ip_address' => $ipAddress,
        ':user_agent' => $userAgent,
        ':status' => 'new',
    ]);

    // Envoi accepté et enregistré : on le compte dans les limites de fréquence
    foreach ($limits as [$key, $rules]) {
        rate_limit($rateDir, $key, $rules, true, true);
    }

} catch (PDOException $e) {
    error_log('contact.php MySQL djskylight: ' . $e->getMessage());

    respond(500, [
        'ok' => false,
        'error' => 'Erreur lors de l’enregistrement du message.'
    ]);
}

// ---------------------------------------------------------------------------
// 2. ENVOI EMAIL (texte brut, liens désactivés, en-têtes protégés contre l'injection)
// ---------------------------------------------------------------------------

$body  = "Nouveau message depuis le formulaire de contact DJ Skylight\n";
$body .= "----------------------------------------------------------\n\n";
if ($isSuspect) {
    $body .= "⚠ MESSAGE À VÉRIFIER (score anti-spam : {$spamScore} — " . implode(', ', $spamReasons) . ")\n";
    $body .= "  Ne cliquez sur aucun lien et ne communiquez aucune information bancaire\n";
    $body .= "  avant d'avoir vérifié l'identité de l'expéditeur.\n\n";
}
$body .= "Nom complet : {$name}\n";
$body .= "Prénom      : {$prenom}\n";
$body .= "Nom         : {$nom}\n";
$body .= "Email       : {$email}\n";
$body .= "Sujet       : {$subject}\n";
$body .= "IP          : {$ipAddress}\n\n";
$body .= "Message (liens désactivés : hxxp = http, [.] = .) :\n" . defang($message) . "\n";

$safeFromName = str_replace(["\r", "\n"], '', $config['from_name']);
$safeEmail    = str_replace(["\r", "\n"], '', $email);
$safeSubject  = str_replace(["\r", "\n"], '', $subject);

$headers  = "From: {$safeFromName} <{$config['from_address']}>\r\n";
$headers .= "Reply-To: {$safeEmail}\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "X-DJSkylight-Spam-Score: {$spamScore}\r\n";

$mailSubject = '[DJ Skylight - Contact] ' . $safeSubject;
if (function_exists('mb_encode_mimeheader')) {
    $mailSubject = mb_encode_mimeheader($mailSubject, 'UTF-8', 'B', "\r\n");
}

$additionalParams = '-f ' . $config['from_address'];

$sent = mail(
    $config['recipient'],
    $mailSubject,
    $body,
    $headers,
    $additionalParams
);

if (!$sent) {
    error_log('contact.php djskylight: email non envoyé, mais message enregistré en base.');

    respond(200, [
        'ok' => true,
        'warning' => 'Message enregistré, mais email non envoyé.'
    ]);
}

// Réponse finale pour le JavaScript
respond(200, ['ok' => true]);
