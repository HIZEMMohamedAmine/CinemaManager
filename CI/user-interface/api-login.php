<?php
// Dual Role Login Endpoint - User & Admin
declare(strict_types=1);
header('Content-Type: application/json');

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate input
if (!isset($data['email']) || !isset($data['password']) || !isset($data['role'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing email, password, or role'
    ]);
    exit;
}

$email = trim($data['email']);
$password = trim($data['password']);
$role = trim($data['role']);

// Validate role
if (!in_array($role, ['user', 'admin'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid role'
    ]);
    exit;
}

// Admin login
if ($role === 'admin') {
    if (!isset($data['adminKey'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Admin key required'
        ]);
        exit;
    }
    
    $adminKey = trim($data['adminKey']);
    
    // Demo credentials for admin
    if ($email === 'admin@cinema.com' && $password === 'admin123' && $adminKey === 'SECRET_ADMIN_2024') {
        session_start();
        $_SESSION['user'] = [
            'id' => 1,
            'email' => $email,
            'role' => 'admin',
            'login_time' => time()
        ];
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Admin login successful',
            'user' => $_SESSION['user'],
            'token' => bin2hex(random_bytes(32))
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid admin credentials or key'
        ]);
    }
}
// User login
else if ($role === 'user') {
    // Demo credentials for user
    if ($email === 'user@cinema.com' && $password === 'user123') {
        session_start();
        $_SESSION['user'] = [
            'id' => 2,
            'email' => $email,
            'role' => 'user',
            'login_time' => time()
        ];
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'User login successful',
            'user' => $_SESSION['user'],
            'token' => bin2hex(random_bytes(32))
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid user credentials'
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid role specified'
    ]);
}
?>
