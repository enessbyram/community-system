<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
require_once __DIR__ . "/config/db.php";

$community_id = $_GET['community_id'] ?? '';

if (!$community_id) {
    echo json_encode(["success" => false, "message" => "Topluluk ID gerekli."]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->connect();

    $sql = "
        SELECT 
            cm.member_id,
            u.full_name,
            u.email,
            SUBSTRING_INDEX(u.email, '@', 1) as student_number,
            CASE 
                WHEN cm.role_id = 1 THEN 'Başkan'
                WHEN cm.role_id = 2 THEN 'Başkan Yrd.'
                WHEN cm.role_id < 10 THEN 'Yönetim'
                ELSE 'Üye'
            END as role_name
        FROM community_members cm
        JOIN users u ON cm.user_id = u.user_id
        WHERE cm.community_id = ?
        ORDER BY cm.role_id ASC, u.full_name ASC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([$community_id]);
    $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $members]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}