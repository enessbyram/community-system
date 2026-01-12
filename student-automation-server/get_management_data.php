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

    // 1. Yönettiği topluluğu bul
    $sqlCommunity = "SELECT community_id FROM community_members WHERE user_id = ? AND role_id IN (1, 2) LIMIT 1";
    $stmtCommunity = $conn->prepare($sqlCommunity);
    $stmtCommunity->execute([$user_id]);
    $community = $stmtCommunity->fetch(PDO::FETCH_ASSOC);

    if (!$community) {
        echo json_encode(["success" => false, "message" => "Yönettiğiniz bir topluluk bulunamadı."]);
        exit();
    }

    $community_id = $community['community_id'];
    $response = ["requests" => [], "events" => []];

    // 2. Bekleyen Üyelik Başvuruları
    $sqlRequests = "
        SELECT 
            cr.request_id,
            u.full_name,
            u.email,
            cr.request_date
        FROM community_requests cr
        JOIN users u ON cr.user_id = u.user_id
        WHERE cr.community_id = ? AND cr.status = 'pending'
    ";
    $stmtRequests = $conn->prepare($sqlRequests);
    $stmtRequests->execute([$community_id]);
    $response['requests'] = $stmtRequests->fetchAll(PDO::FETCH_ASSOC);

    // 3. Gönderilen Etkinlik Başvuruları
    // DEĞİŞİKLİK BURADA: Log tablosundan en son girilen sebebi (reason) de çekiyoruz.
    $sqlEvents = "
        SELECT 
            a.application_id as event_id, 
            a.title as event_name, 
            a.created_at, 
            a.current_status as status,
            (
                SELECT reason 
                FROM application_status_log l 
                WHERE l.application_id = a.application_id 
                ORDER BY l.created_at DESC 
                LIMIT 1
            ) as rejection_reason
        FROM applications a
        WHERE a.community_id = ?
        ORDER BY a.created_at DESC
    ";
    
    $stmtEvents = $conn->prepare($sqlEvents);
    $stmtEvents->execute([$community_id]);
    $response['events'] = $stmtEvents->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $response]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}