<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
require_once __DIR__ . "/config/db.php";

$user_id = $_GET['user_id'] ?? '';

if (!$user_id) { echo json_encode(["success" => false, "message" => "User ID yok"]); exit(); }

try {
    $db = new Database();
    $conn = $db->connect();

    $debugInfo = [];

    // 1. Danışmanın sorumlu olduğu topluluğu bul
    $sqlComm = "
        SELECT c.community_id, c.community_name
        FROM communities c
        JOIN advisors a ON c.advisor_id = a.advisor_id
        WHERE a.user_id = ?
    ";
    $stmtComm = $conn->prepare($sqlComm);
    $stmtComm->execute([$user_id]);
    $community = $stmtComm->fetch(PDO::FETCH_ASSOC);

    if (!$community) {
        echo json_encode([
            "success" => true, 
            "data" => ["pending" => 0, "approved" => 0, "this_month" => 0],
            "message" => "Yönetici olunan topluluk bulunamadı."
        ]);
        exit();
    }

    $community_id = $community['community_id'];
    $debugInfo['community'] = $community;

    // 2. İstatistikleri Hesapla
    // DÜZELTME: Tablo adı 'event_applications' yerine 'applications' olarak deniyoruz.
    // Eğer tablonun adı farklıysa LÜTFEN AŞAĞIDAKİ 'FROM applications' KISMINI DEĞİŞTİR.
    
    // A. Bekleyen Talepler (current_status = 'pending_advisor')
    $sqlPending = "SELECT COUNT(*) as total FROM applications WHERE community_id = ? AND current_status = 'pending_advisor'";
    $stmtPending = $conn->prepare($sqlPending);
    $stmtPending->execute([$community_id]);
    $pending = $stmtPending->fetch(PDO::FETCH_ASSOC)['total'];

    // B. Onaylanan (current_status = 'pending_sks' veya senin onay kodun neyse)
    $sqlApproved = "SELECT COUNT(*) as total FROM applications WHERE community_id = ? AND current_status = 'pending_sks'";
    $stmtApproved = $conn->prepare($sqlApproved);
    $stmtApproved->execute([$community_id]);
    $approved = $stmtApproved->fetch(PDO::FETCH_ASSOC)['total'];

    // C. Bu Ay (SKS onayı bitmiş ve events tablosuna düşmüş olanlar)
    $sqlMonth = "
        SELECT COUNT(*) as total 
        FROM events 
        WHERE community_id = ? 
        AND MONTH(event_date) = MONTH(CURRENT_DATE()) 
        AND YEAR(event_date) = YEAR(CURRENT_DATE())
    ";
    $stmtMonth = $conn->prepare($sqlMonth);
    $stmtMonth->execute([$community_id]);
    $thisMonth = $stmtMonth->fetch(PDO::FETCH_ASSOC)['total'];

    echo json_encode([
        "success" => true, 
        "data" => [
            "pending" => $pending,
            "approved" => $approved,
            "this_month" => $thisMonth
        ],
        "debug" => $debugInfo
    ]);

} catch (Exception $e) {
    // Hata mesajını net görelim
    echo json_encode(["success" => false, "message" => "SQL Hatası: " . $e->getMessage()]);
}