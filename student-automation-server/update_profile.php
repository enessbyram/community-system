<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . "/config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'] ?? '';
$full_name = $data['full_name'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
// Öğrenci numarası genellikle değiştirilemez olduğu için update sorgusuna eklemiyorum.

if (empty($user_id)) {
    echo json_encode(["success" => false, "message" => "Eksik veri."]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->connect();

    $sql = "UPDATE users SET full_name = ?, email = ?, phone = ? WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    $update = $stmt->execute([$full_name, $email, $phone, $user_id]);

    if ($update) {
        echo json_encode(["success" => true, "message" => "Profil güncellendi."]);
    } else {
        echo json_encode(["success" => false, "message" => "Güncelleme başarısız."]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
