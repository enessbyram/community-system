<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");
require_once __DIR__ . "/config/db.php";

try {
    $db = new Database();
    $conn = $db->connect();

    // DÜZELTME YAPILDI:
    // 1. Etkinlik sayısı için 'events' yerine 'applications' tablosuna bakıyoruz.
    // 2. 'status' yerine 'current_status' kullanıyoruz.
    $sql = "
        SELECT 
            c.community_id as id,
            c.community_name as name,
            c.type_id,
            (SELECT COUNT(*) FROM community_members cm WHERE cm.community_id = c.community_id) as members,
            (SELECT COUNT(*) FROM applications a WHERE a.community_id = c.community_id AND a.current_status = 'approved') as events
        FROM communities c
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $allCommunities = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Frontend için veriyi ayırıyoruz
    $vocational = []; // Mesleki (type_id = 1)
    $social = [];     // Sosyal (type_id = 2)

    foreach ($allCommunities as $comm) {
        if ($comm['type_id'] == 1) {
            $vocational[] = $comm;
        } else {
            $social[] = $comm;
        }
    }

    echo json_encode([
        "success" => true, 
        "data" => [
            "vocational" => $vocational,
            "social" => $social
        ]
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "SQL Hatası: " . $e->getMessage()]);
}