<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . "/config/db.php";

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? ''; 
$member_id = $data['member_id'] ?? '';

if (empty($action) || empty($member_id)) {
    echo json_encode(["success" => false, "message" => "Eksik veri."]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->connect();

    if ($action === 'delete') {
        // Üyeyi sil
        $sql = "DELETE FROM community_members WHERE member_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$member_id]);
        echo json_encode(["success" => true, "message" => "Üye başarıyla silindi."]);
    } 
    elseif ($action === 'update') {
        // Rolü güncelle
        $role_id = $data['role_id'] ?? 10; // Varsayılan: Üye (10)
        
        $sql = "UPDATE community_members SET role_id = ? WHERE member_id = ?";
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute([$role_id, $member_id]);
        
        if ($result) {
            echo json_encode(["success" => true, "message" => "Rol başarıyla güncellendi."]);
        } else {
            echo json_encode(["success" => false, "message" => "Güncelleme başarısız."]);
        }
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}