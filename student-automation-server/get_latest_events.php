<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require_once __DIR__ . "/config/db.php";

try {
    $db = new Database();
    $conn = $db->connect();

    // En yakın tarihli 5 etkinliği getir (Bugünden sonraki)
    $sql = "
        SELECT 
            e.event_id,
            e.event_name,
            e.event_date,
            e.location,
            e.description,
            e.image_url,
            c.community_name,
            (SELECT COUNT(*) FROM event_participants ep WHERE ep.event_id = e.event_id) as participant_count
        FROM events e
        JOIN communities c ON e.community_id = c.community_id
        WHERE e.event_date >= CURDATE()
        ORDER BY e.event_date ASC
        LIMIT 5
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $events]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>