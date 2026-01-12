<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . "/config/db.php"; 

$data = json_decode(file_get_contents("php://input"), true);

$type = $data['type'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password) || empty($type)) {
    echo json_encode(["success" => false, "message" => "E-posta, şifre veya hesap türü eksik."]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->connect();

    $required_role = '';
    switch ($type) {
        case 'student':
            $required_role = 'student'; 
            break;
        case 'management':
            $required_role = 'admin'; 
            break;
        case 'consultant':
            $required_role = 'advisor'; 
            break;
        case 'admin':
            $required_role = 'sks';
            break;
        default:
            throw new Exception("Geçersiz hesap türü seçildi.");
    }

    $sql = "SELECT * FROM users WHERE email = ? AND password = ? AND role = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$email, $password, $required_role]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        if (!isset($user['role'])) {
             $user['role'] = $required_role; 
        }
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Email veya şifre hatalı"]);
    }

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Sunucu hatası: " . $e->getMessage()
    ]);
}
?>