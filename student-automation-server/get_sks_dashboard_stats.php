<?php
// 1. CORS İZİNLERİ
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

// Pre-flight kontrolü
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/config/db.php";

try {
    $db = new Database();
    $conn = $db->connect();

    $response = [
        "total_communities" => 0,
        "total_members" => 0,
        "pending_events" => 0,
        "pending_documents" => 0
    ];

    // 1. TOPLAM TOPLULUK SAYISI
    $sqlCommunities = "SELECT COUNT(*) as total FROM communities";
    $stmtCommunities = $conn->prepare($sqlCommunities);
    $stmtCommunities->execute();
    $response['total_communities'] = $stmtCommunities->fetch(PDO::FETCH_ASSOC)['total'];

    // 2. TOPLAM ÜYE SAYISI (GÜNCELLENDİ)
    // Artık 'users' tablosundaki herkesi değil, sadece 'community_members' tablosundaki kayıtları sayıyoruz.
    // Bu sayede kaç kişinin topluluklara üye olduğu (üyelik sayısı) ortaya çıkıyor.
    $sqlMembers = "SELECT COUNT(*) as total FROM community_members";
    $stmtMembers = $conn->prepare($sqlMembers);
    $stmtMembers->execute();
    $response['total_members'] = $stmtMembers->fetch(PDO::FETCH_ASSOC)['total'];

    // 3. BEKLEYEN ETKİNLİK SAYISI
    // Hatırlatma: 'events' yerine 'applications' tablosu kullanıyorduk ve durum 'pending_sks' idi.
    $sqlEvents = "SELECT COUNT(*) as total FROM applications WHERE current_status = 'pending_sks'";
    $stmtEvents = $conn->prepare($sqlEvents);
    $stmtEvents->execute();
    $response['pending_events'] = $stmtEvents->fetch(PDO::FETCH_ASSOC)['total'];

    // 4. BEKLEYEN BELGE SAYISI
    // Pasif
    $response['pending_documents'] = 0;

    echo json_encode(["success" => true, "data" => $response]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "SQL Hatası: " . $e->getMessage()]);
}