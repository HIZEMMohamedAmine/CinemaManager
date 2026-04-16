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
    echo json_encode(["success" => false, "message" => "Erreur de connexion à la base de données"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(["success" => false, "message" => "Données manquantes"]);
    exit;
}

$username = trim($data['username']);
$password = $data['password'];

if (empty($username) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Veuillez remplir tous les champs"]);
    exit;
}

// Check if username already exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username");
$stmt->execute(['username' => $username]);
if ($stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "Ce nom d'utilisateur est déjà pris"]);
    exit;
}

// Insert new user
$stmt = $pdo->prepare("INSERT INTO users (username, password, role) VALUES (:username, :password, 'user')");
if ($stmt->execute(['username' => $username, 'password' => $password])) {
    echo json_encode(["success" => true, "message" => "Compte créé avec succès !"]);
} else {
    echo json_encode(["success" => false, "message" => "Erreur lors de la création du compte"]);
}
