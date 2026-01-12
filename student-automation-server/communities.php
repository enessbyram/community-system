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
            c.community_id,
            c.community_name,
            c.description,
            c.created_at,
            ct.type_name,
            u.full_name AS advisor_name,
            p.full_name AS president_name,
            (SELECT COUNT(*) FROM community_members cm WHERE cm.community_id = c.community_id) AS member_count
        FROM communities c
        LEFT JOIN community_types ct ON c.type_id = ct.type_id
        LEFT JOIN advisors a ON c.advisor_id = a.advisor_id
        LEFT JOIN users u ON a.user_id = u.user_id
        LEFT JOIN users p ON c.president_user_id = p.user_id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $communities = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($communities, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        "error" => true,
        "message" => $e->getMessage()
    ]);
}
