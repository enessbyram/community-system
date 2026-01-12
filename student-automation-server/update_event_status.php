<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/config/db.php";

$data = json_decode(file_get_contents("php://input"));

// Frontend event_id gönderiyor ama aslında bu application_id
$app_id = $data->event_id ?? null; 
$action = $data->action ?? null;

if (!$app_id || !$action) {
    echo json_encode(["success" => false, "message" => "Eksik parametre."]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->connect();

    // 1. Mevcut durumu kontrol et
    $sqlCheck = "SELECT current_status FROM applications WHERE application_id = ?";
    $stmtCheck = $conn->prepare($sqlCheck);
    $stmtCheck->execute([$app_id]);
    $row = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    if (!$row) throw new Exception("Başvuru bulunamadı.");

    $current = $row['current_status'];
    $new_status = null;

    // 2. SKS Onay Mantığı
    if ($current == 'pending_sks') {
        if ($action == 'approve') $new_status = 'approved';
        if ($action == 'reject') $new_status = 'sks_rejected';
    } 
    // Hoca Onay Mantığı (Eğer hoca panelinde de bunu kullanacaksan)
    else if ($current == 'pending_advisor') {
        if ($action == 'approve') $new_status = 'pending_sks';
        if ($action == 'reject') $new_status = 'advisor_rejected';
    }

    if (!$new_status) throw new Exception("Geçersiz işlem. Mevcut durum: $current");

    // 3. Güncelle
    $sqlUpdate = "UPDATE applications SET current_status = ? WHERE application_id = ?";
    $stmtUpdate = $conn->prepare($sqlUpdate);
    $stmtUpdate->execute([$new_status, $app_id]);

    // Eğer onaylandıysa ve 'events' diye ayrı bir ana tablon varsa, 
    // veriyi oraya kopyalama işlemi (INSERT INTO events ...) burada yapılabilir.
    // Ancak şimdilik sadece statüsü güncelliyoruz.

    echo json_encode(["success" => true, "new_status" => $new_status]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}