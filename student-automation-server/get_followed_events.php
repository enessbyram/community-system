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

    // Kullanıcının üye olduğu toplulukların ID'lerini bul
    // (community_members tablosundan)
    
    $sql = "
        SELECT 
            e.event_id,
            e.event_name,
            e.event_date,
            e.location,
            e.description,
            e.image_url,
            c.community_name,
            (SELECT COUNT(*) FROM event_participants ep WHERE ep.event_id = e.event_id) as participant_count,
            (SELECT COUNT(*) FROM event_participants ep WHERE ep.event_id = e.event_id AND ep.user_id = ?) as is_joined
        FROM events e
        JOIN communities c ON e.community_id = c.community_id
        JOIN community_members cm ON c.community_id = cm.community_id
        WHERE cm.user_id = ? 
        AND e.event_date >= NOW()
        ORDER BY e.event_date ASC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([$user_id, $user_id]);
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $events]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "SQL Hatası: " . $e->getMessage()]);
}