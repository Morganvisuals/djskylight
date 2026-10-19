<?php
/**
 * contact.php — Formulaire de contact djskylight.fr
 * Envoie un email + enregistre le message dans MySQL.
 */

header('Content-Type: application/json; charset=utf-8');

function respond(int $code, array $payload) {
    http_response_code($code);
    echo json_encode($payload);
    exit;
}

// Charger la configuration privée hors GitHub
$configPath = '/home/hocp8711/private/djskylight_config.php';

if (!file_exists($configPath)) {
    error_log('contact.php: fichier config djskylight introuvable.');
    respond(500, [
        'ok' => false,
        'error' => 'Configuration serveur manquante.'
    ]);
}

$config = require $configPath;

// ---------------------------------------------------------------------------
// ANTI-BOT : limites de longueur, jeton temporel signé, limite de fréquence
// ---------------------------------------------------------------------------

const MAX_LEN = [
    'prenom'  => 100,
    'nom'     => 100,
    'name'    => 100,
    'email'   => 254,
    'subject' => 150,
    'message' => 5000,
];
const MIN_FILL_SECONDS = 3;      // un humain met plus de 3 s à remplir le formulaire
const TOKEN_MAX_AGE    = 7200;   // jeton valable 2 h
const RATE_RULES_IP     = [60 => 1, 3600 => 5];  // 1 envoi / min, 5 / heure par IP
const RATE_RULES_GLOBAL = [3600 => 30];          // 30 envois / heure au total

function str_len(string $s): int {
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);
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
 * Renvoie 0 si l'envoi est autorisé (et l'enregistre), sinon le nombre de secondes à attendre.
 */
function rate_limit(string $dir, string $key, array $rules): int {
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
    if ($retry === 0) {
        $hits[] = $now;
    }
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($hits));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $retry;
}

// GET ?token=1 → délivre un jeton signé (demandé par le JS quand le visiteur commence à remplir)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['token'])) {
    header('Cache-Control: no-store');
    respond(200, ['ok' => true, 'token' => make_token($formSecret)]);
}

// Accepter uniquement les requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, [
        'ok' => false,
        'error' => 'Méthode non autorisée.'
    ]);
}

// Honeypot anti-spam (champ invisible : seul un bot le remplit)
if (!empty($_POST['_gotcha'])) {
    respond(200, ['ok' => true]);
}

// Jeton temporel : absent / falsifié / envoyé trop vite = bot
$tokenError = check_token((string) ($_POST['_token'] ?? ''), $formSecret);
if ($tokenError !== null) {
    respond(400, [
        'ok' => false,
        'error' => 'Envoi refusé.',
        'reason' => $tokenError
    ]);
}

// Longueurs maximales (avant tout traitement)
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

// Récupération des champs du formulaire
$prenomInput = trim($_POST['prenom'] ?? '');
$nomInput    = trim($_POST['nom'] ?? '');
$name        = trim($_POST['name'] ?? trim($prenomInput . ' ' . $nomInput));
$email       = trim($_POST['email'] ?? '');
$subject     = trim($_POST['subject'] ?? '');
$message     = trim($_POST['message'] ?? '');

// Validation
$errors = [];

if ($prenomInput === '' && $name === '') {
    $errors[] = 'prenom';
}

if ($nomInput === '' && $name === '') {
    $errors[] = 'nom';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'email';
}

if ($message === '') {
    $errors[] = 'message';
}

// Un nom ne contient jamais de lien
foreach (['prenom' => $prenomInput, 'nom' => $nomInput, 'name' => $name] as $field => $value) {
    if (preg_match('~https?://|www\.|<[a-z/]~i', $value)) {
        $errors[] = $field;
    }
}

if ($errors) {
    respond(422, [
        'ok' => false,
        'error' => 'Champs invalides.',
        'fields' => array_values(array_unique($errors))
    ]);
}

// Limite de fréquence (stockage hors du dossier public)
$rateDir = dirname($configPath) . '/djskylight_ratelimit';
$retry = rate_limit($rateDir, 'ip:' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), RATE_RULES_IP);
if ($retry === 0) {
    $retry = rate_limit($rateDir, 'global', RATE_RULES_GLOBAL);
}
if ($retry > 0) {
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
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;

// ---------------------------------------------------------------------------
// 1. ENREGISTREMENT MYSQL
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

} catch (PDOException $e) {
    error_log('contact.php MySQL djskylight: ' . $e->getMessage());

    respond(500, [
        'ok' => false,
        'error' => 'Erreur lors de l’enregistrement du message.'
    ]);
}

// ---------------------------------------------------------------------------
// 2. ENVOI EMAIL
// ---------------------------------------------------------------------------

$body  = "Nouveau message depuis le formulaire de contact DJ Skylight\n";
$body .= "----------------------------------------------------------\n\n";
$body .= "Nom complet : {$name}\n";
$body .= "Prénom      : {$prenom}\n";
$body .= "Nom         : {$nom}\n";
$body .= "Email       : {$email}\n";
$body .= "Sujet       : {$subject}\n";
$body .= "IP          : {$ipAddress}\n\n";
$body .= "Message :\n{$message}\n";

$safeFromName = str_replace(["\r", "\n"], '', $config['from_name']);
$safeEmail    = str_replace(["\r", "\n"], '', $email);
$safeSubject  = str_replace(["\r", "\n"], '', $subject);

$headers  = "From: {$safeFromName} <{$config['from_address']}>\r\n";
$headers .= "Reply-To: {$safeEmail}\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";
$headers .= "MIME-Version: 1.0\r\n";

$mailSubject = '[DJ Skylight - Contact] ' . $safeSubject;

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
