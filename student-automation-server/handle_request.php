<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . "/config/db.php";

$data = json_decode(file_get_contents("php://input"), true);
$request_id = $data['request_id'] ?? '';
$action = $data['action'] ?? ''; // 'approve' veya 'reject'

if (empty($request_id) || empty($action)) {
    echo json_encode(["success" => false, "message" => "Eksik veri."]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->connect();

    // 1. Durumu güncelle (approved veya rejected)
    $status = ($action === 'approve') ? 'approved' : 'rejected';
    $sqlUpdate = "UPDATE community_requests SET status = ? WHERE request_id = ?";
    $stmtUpdate = $conn->prepare($sqlUpdate);
    $stmtUpdate->execute([$status, $request_id]);

    // 2. Eğer onaylandıysa 'community_members' tablosuna ekle
    if ($action === 'approve') {
        // Önce request bilgilerini al (user_id ve community_id lazım)
        $sqlGet = "SELECT user_id, community_id FROM community_requests WHERE request_id = ?";
        $stmtGet = $conn->prepare($sqlGet);
        $stmtGet->execute([$request_id]);
        $req = $stmtGet->fetch(PDO::FETCH_ASSOC);

        if ($req) {
            $sqlInsert = "INSERT INTO community_members (community_id, user_id, role_id) VALUES (?, ?, 10)"; // 10 = Üye Rolü
            $stmtInsert = $conn->prepare($sqlInsert);
            $stmtInsert->execute([$req['community_id'], $req['user_id']]);
        }
    }

    echo json_encode(["success" => true, "message" => "İşlem başarılı."]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}