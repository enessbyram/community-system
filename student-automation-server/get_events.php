<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require_once __DIR__ . "/config/db.php";

try {
    $db = new Database();
    $conn = $db->connect();

    // Events tablosunu Communities tablosu ile birleştiriyoruz ki topluluk adını görebilelim
    $sql = "
        SELECT 
            e.event_id,
            e.event_name,
            e.event_date,
            e.location,
            e.description,
            c.community_name
        FROM events e
        LEFT JOIN communities c ON e.community_id = c.community_id
        ORDER BY e.event_date ASC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $events]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
