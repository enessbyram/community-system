<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
require_once __DIR__ . "/config/db.php";

try {
    $db = new Database();
    $conn = $db->connect();

    // Tüm rolleri çek
    $sql = "SELECT role_id, role_name FROM member_roles ORDER BY role_id ASC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $roles]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}