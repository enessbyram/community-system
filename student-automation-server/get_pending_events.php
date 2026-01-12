<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
require_once __DIR__ . "/config/db.php";

$user_id = $_GET['user_id'] ?? '';

if (!$user_id) { echo json_encode(["success" => false]); exit(); }

try {
    $db = new Database();
    $conn = $db->connect();

    // 1. Danışmanın topluluğunu bul
    $sqlComm = "
        SELECT c.community_id, c.community_name
        FROM communities c
        JOIN advisors a ON c.advisor_id = a.advisor_id
        WHERE a.user_id = ?
    ";
    $stmtComm = $conn->prepare($sqlComm);
    $stmtComm->execute([$user_id]);
    $community = $stmtComm->fetch(PDO::FETCH_ASSOC);

    if (!$community) {
        echo json_encode(["success" => true, "data" => []]);
        exit();
    }

    $community_id = $community['community_id'];

    // 2. Bekleyen başvuruları çek
    // Tablo adı: applications (önceki konuşmadan hatırladığım kadarıyla)
    $sql = "
        SELECT * FROM applications 
        WHERE community_id = ? AND current_status = 'pending_advisor'
        ORDER BY created_at DESC
    ";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$community_id]);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Her etkinlik için topluluk adını da ekleyelim (Frontend'de göstermek için)
    foreach ($events as &$event) {
        $event['community_name'] = $community['community_name'];
    }

    echo json_encode(["success" => true, "data" => $events]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}