<?php
declare(strict_types=1);

// Only output JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', '0');

$host = '127.0.0.1';
$dbname = 'cinemamanager';
$db_user = 'root';
$db_pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Database connection failed"]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Veuillez fournir un nom d'utilisateur et un mot de passe"]));
}

$username = trim($data['username']);
$password = $data['password'];

try {
    $stmt = $pdo->prepare("SELECT id, username, role FROM users WHERE username = :username AND password = :password");
    $stmt->execute(['username' => $username, 'password' => $password]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Successfully found
        http_response_code(200);
        die(json_encode(["success" => true, "role" => $user['role']]));
    } else {
        http_response_code(401);
        die(json_encode(["success" => false, "message" => "Identifiants incorrects"]));
    }
} catch (Exception $e) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Database error"]));
}
