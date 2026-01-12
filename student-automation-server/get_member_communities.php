<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require_once __DIR__ . "/config/db.php";

$user_id = $_GET['user_id'] ?? '';

if (empty($user_id)) {
    echo json_encode(["success" => false, "message" => "User ID gerekli."]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->connect();

    $response = [
        "memberships" => [],
        "requests" => []
    ];

    $sql1 = "
        SELECT 
            cm.community_id,
            c.community_name,
            cm.role_id,
            cm.joined_at
        FROM community_members cm
        JOIN communities c ON cm.community_id = c.community_id
        WHERE cm.user_id = ?
    ";
    
    $stmt1 = $conn->prepare($sql1);
    $stmt1->execute([$user_id]);
    $response['memberships'] = $stmt1->fetchAll(PDO::FETCH_ASSOC);

    try {
        $sql2 = "
            SELECT 
                cr.request_id,
                c.community_name,
                cr.request_date
            FROM community_requests cr
            JOIN communities c ON cr.community_id = c.community_id
            WHERE cr.user_id = ? AND cr.status = 'pending'
        ";
        $stmt2 = $conn->prepare($sql2);
        $stmt2->execute([$user_id]);
        $response['requests'] = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        $response['requests'] = [];
    }

    echo json_encode(["success" => true, "data" => $response]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "SQL Hatası: " . $e->getMessage()]);
}