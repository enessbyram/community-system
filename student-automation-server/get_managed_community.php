<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
require_once __DIR__ . "/config/db.php";

$user_id = $_GET['user_id'] ?? '';

if (!$user_id) { echo json_encode(["success" => false]); exit(); }

try {
    $db = new Database();
    $conn = $db->connect();

    // DÜZELTME: communities -> advisors -> users bağlantısı kuruldu.
    // 1. communities.advisor_id ile advisors tablosuna gidiyoruz.
    // 2. advisors.user_id ile users tablosuna gidip full_name'i alıyoruz.
    
    $sql = "
        SELECT 
            c.community_id, 
            c.community_name, 
            c.description, 
            c.created_at,
            u.full_name as advisor_name 
        FROM communities c
        JOIN community_members cm ON c.community_id = cm.community_id
        LEFT JOIN advisors a ON c.advisor_id = a.advisor_id
        LEFT JOIN users u ON a.user_id = u.user_id
        WHERE cm.user_id = ? AND cm.role_id < 10
        LIMIT 1
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([$user_id]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        // Eğer advisor yoksa veya kullanıcı silinmişse null gelebilir, kontrol edelim
        if (empty($data['advisor_name'])) {
            $data['advisor_name'] = "Atanmamış";
        }
        echo json_encode(["success" => true, "data" => $data]);
    } else {
        echo json_encode(["success" => false, "message" => "Yönetici olduğunuz topluluk bulunamadı."]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}