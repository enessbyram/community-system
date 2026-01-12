<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require_once __DIR__ . "/config/db.php";

try {
    $db = new Database();
    $conn = $db->connect();

    $sql = "
        SELECT 
            application_id as event_id,  /* Frontend için alias */
            title as event_name,         /* Frontend event_name bekliyor, db'de title var */
            event_date, 
            event_time, 
            location, 
            description 
        FROM applications 
        WHERE current_status = 'approved' /* Sadece onaylanmışları getir */
        ORDER BY event_date ASC, event_time ASC 
        LIMIT 4
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $events]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}