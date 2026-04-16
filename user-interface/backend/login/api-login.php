<?php
header('Content-Type: application/json');

$host = '127.0.0.1';
$dbname = 'cinemamanager';
$db_user = 'root';
$db_pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(["success" => false, "message" => "Veuillez fournir un nom d'utilisateur et un mot de passe"]);
    exit;
}

$username = trim($data['username']);
$password = $data['password'];

$stmt = $pdo->prepare("SELECT id, username, role FROM users WHERE username = :username AND password = :password");
$stmt->execute(['username' => $username, 'password' => $password]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    // Successfully found
    echo json_encode(["success" => true, "role" => $user['role']]);
} else {
    echo json_encode(["success" => false, "message" => "Identifiants incorrects"]);
}
