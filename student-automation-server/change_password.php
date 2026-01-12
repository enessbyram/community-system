<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . "/config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'] ?? '';
$current_password = $data['current_password'] ?? '';
$new_password = $data['new_password'] ?? '';

if (empty($user_id) || empty($current_password) || empty($new_password)) {
    echo json_encode(["success" => false, "message" => "Tüm alanları doldurun."]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->connect();

    // Önce eski şifreyi kontrol et
    $checkSql = "SELECT password FROM users WHERE user_id = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || $user['password'] !== $current_password) {
        echo json_encode(["success" => false, "message" => "Mevcut şifre hatalı."]);
        exit();
    }

    // Yeni şifreyi güncelle
    $updateSql = "UPDATE users SET password = ? WHERE user_id = ?";
    $updateStmt = $conn->prepare($updateSql);
    $result = $updateStmt->execute([$new_password, $user_id]);

    if ($result) {
        echo json_encode(["success" => true, "message" => "Şifre başarıyla güncellendi."]);
    } else {
        echo json_encode(["success" => false, "message" => "Güncelleme başarısız."]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
