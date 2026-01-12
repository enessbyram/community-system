<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
require_once __DIR__ . "/config/db.php";

$data = json_decode(file_get_contents("php://input"), true);
$community_id = $data['community_id'] ?? '';
$description = $data['description'] ?? '';

if (!$community_id) { echo json_encode(["success" => false]); exit(); }

try {
    $db = new Database();
    $conn = $db->connect();

    $sql = "UPDATE communities SET description = ? WHERE community_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$description, $community_id]);

    echo json_encode(["success" => true, "message" => "Bilgiler güncellendi."]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}