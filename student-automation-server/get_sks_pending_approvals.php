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

// Hataları ekrana basma (JSON bozulmasın diye), logla.
ini_set('display_errors', 0);
error_reporting(E_ALL); 

require_once __DIR__ . "/config/db.php";

$user_id = $_GET['user_id'] ?? '';

try {
    $db = new Database();
    $conn = $db->connect();

    $response = [
        "events" => [],
        "documents" => []
    ];

    // 2. BEKLEYEN ETKİNLİKLERİ ÇEK
    // DÜZELTME: c.name yerine c.community_name deniyoruz.
    // Eğer veritabanında sütun adı farklıysa (örn: title) burayı ona göre güncellemelisin.
    $sqlEvents = "
        SELECT 
            e.application_id as event_id,
            e.title,
            e.description, 
            e.event_date, 
            e.location,
            c.community_name as community_name, /* DÜZELTİLDİ: c.name -> c.community_name */
            u.full_name as sender_name,
            0 as participant_count
        FROM applications e
        JOIN communities c ON e.community_id = c.community_id
        JOIN users u ON e.sent_by = u.user_id
        WHERE e.current_status = 'pending_sks'
        ORDER BY e.event_date ASC
    ";
    
    $stmtEvents = $conn->prepare($sqlEvents);
    $stmtEvents->execute();
    $response['events'] = $stmtEvents->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $response]);

} catch (PDOException $e) {
    // SQL Hatalarını yakalar
    echo json_encode(["success" => false, "message" => "SQL Hatası: " . $e->getMessage()]);
} catch (Exception $e) {
    // Diğer hataları yakalar
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}