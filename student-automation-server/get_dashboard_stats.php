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

    $response = [
        "member_count" => 0,   // Üye olunan topluluk sayısı
        "pending_count" => 0,  // Öğrencinin bekleyen başvuruları
        "event_count" => 0     // Yaklaşan tüm etkinlikler
    ];

    // 1. ÖĞRENCİNİN ÜYE OLDUĞU TOPLULUK SAYISI
    // (community_members tablosunda bu kullanıcı kaç kere geçiyor?)
    $sqlMember = "SELECT COUNT(*) as total FROM community_members WHERE user_id = ?";
    $stmtMember = $conn->prepare($sqlMember);
    $stmtMember->execute([$user_id]);
    $response['member_count'] = $stmtMember->fetch(PDO::FETCH_ASSOC)['total'];

    // 2. BEKLEYEN BAŞVURULAR (DÜZELTİLEN KISIM)
    // Artık 'community_id'ye göre değil, 'user_id'ye göre bakıyoruz.
    // Yani "Bu öğrencinin yaptığı başvurulardan durumu 'pending' olanlar"
    $sqlPending = "SELECT COUNT(*) as total FROM community_requests WHERE user_id = ? AND status = 'pending'";
    $stmtPending = $conn->prepare($sqlPending);
    $stmtPending->execute([$user_id]);
    $response['pending_count'] = $stmtPending->fetch(PDO::FETCH_ASSOC)['total'];

    // 3. YAKLAŞAN ETKİNLİKLER
    // (Tüm öğrencilere açık olan ve tarihi geçmemiş etkinlikler)
    $sqlEvent = "SELECT COUNT(*) as total FROM events WHERE event_date >= CURDATE()";
    $stmtEvent = $conn->prepare($sqlEvent);
    $stmtEvent->execute();
    $response['event_count'] = $stmtEvent->fetch(PDO::FETCH_ASSOC)['total'];

    // --- DEBUG (Geliştirme aşamasında konsoldan görmek için) ---
    // Eğer hala 0 geliyorsa status'un veritabanında nasıl yazıldığına bakmak için:
    $sqlDebug = "SELECT status FROM community_requests WHERE user_id = ?";
    $stmtDebug = $conn->prepare($sqlDebug);
    $stmtDebug->execute([$user_id]);
    $debugStatuses = $stmtDebug->fetchAll(PDO::FETCH_ASSOC);
    
    $response['DEBUG_STATUSES'] = $debugStatuses;
    // -----------------------------------------------------------

    echo json_encode(["success" => true, "data" => $response]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "SQL Hatası: " . $e->getMessage()]);
}