<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . "/config/db.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? '';
$community_id = $data['community_id'] ?? '';

if (empty($user_id) || empty($community_id)) {
    echo json_encode(["success" => false, "message" => "Eksik veri."]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->connect();

    // 1. Zaten üye mi?
    $checkMember = $conn->prepare("SELECT member_id FROM community_members WHERE user_id = ? AND community_id = ?");
    $checkMember->execute([$user_id, $community_id]);
    if ($checkMember->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Zaten bu topluluğa üyesiniz."]);
        exit();
    }

    // 2. Zaten başvurusu var mı?
    $checkRequest = $conn->prepare("SELECT request_id FROM community_requests WHERE user_id = ? AND community_id = ? AND status = 'pending'");
    $checkRequest->execute([$user_id, $community_id]);
    if ($checkRequest->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Zaten bekleyen bir başvurunuz var."]);
        exit();
    }

    // 3. Başvuruyu kaydet
    $sql = "INSERT INTO community_requests (user_id, community_id) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $result = $stmt->execute([$user_id, $community_id]);

    if ($result) {
        echo json_encode(["success" => true, "message" => "Başvurunuz alındı."]);
    } else {
        echo json_encode(["success" => false, "message" => "Başvuru sırasında hata oluştu."]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "SQL Hatası: " . $e->getMessage()]);
}