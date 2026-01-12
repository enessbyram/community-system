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

    // 1. ADIM: DANIŞMANIN TOPLULUĞUNU BUL
    // user_id -> advisors tablosundan advisor_id -> communities tablosundan community_id
    $sqlCommunity = "
        SELECT c.community_id, c.community_name 
        FROM communities c
        JOIN advisors a ON c.advisor_id = a.advisor_id
        WHERE a.user_id = ?
        LIMIT 1
    ";

    $stmtComm = $conn->prepare($sqlCommunity);
    $stmtComm->execute([$user_id]);
    $community = $stmtComm->fetch(PDO::FETCH_ASSOC);

    if (!$community) {
        // Eğer bu kullanıcı bir danışman değilse veya bir topluluğu yoksa boş dön
        echo json_encode(["success" => true, "data" => [], "message" => "Yönetilen topluluk bulunamadı."]); 
        exit();
    }

    $community_id = $community['community_id'];

    // 2. ADIM: ETKİNLİKLERİ ÇEK
    // Danışman onayından geçmiş etkinlikler:
    // pending_sks (SKS onayı bekliyor)
    // approved (Yayında)
    // sks_rejected (SKS reddetti)
    // advisor_rejected (Kendisi reddetti - geçmişte ne yaptığını görmesi için)
    
    $sqlEvents = "
        SELECT 
            a.application_id as event_id,
            a.title,
            a.event_date,
            a.event_time,
            a.location,
            a.description,
            a.poster_details as image_url,
            a.current_status as status,
            c.community_name,
            
            -- Red sebebini çek (En son log kaydı)
            (SELECT reason 
             FROM application_status_log l 
             WHERE l.application_id = a.application_id 
             ORDER BY l.created_at DESC LIMIT 1
            ) as rejection_reason

        FROM applications a
        JOIN communities c ON a.community_id = c.community_id
        WHERE a.community_id = ? 
          AND a.current_status IN ('pending_sks', 'approved', 'sks_rejected', 'advisor_rejected') 
        ORDER BY a.created_at DESC
    ";

    $stmtEvents = $conn->prepare($sqlEvents);
    $stmtEvents->execute([$community_id]);
    $events = $stmtEvents->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $events]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}