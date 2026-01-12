<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require_once __DIR__ . "/config/db.php";

$user_id = $_GET['user_id'] ?? '';
$community_id = $_GET['community_id'] ?? '';

if (empty($user_id) || empty($community_id)) {
    echo json_encode(["success" => false, "status" => "none"]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->connect();

    // 1. KONTROL: Community Members tablosunda var mı? (Normal üyelik)
    $checkMember = $conn->prepare("SELECT member_id FROM community_members WHERE user_id = ? AND community_id = ?");
    $checkMember->execute([$user_id, $community_id]);
    if ($checkMember->rowCount() > 0) {
        echo json_encode(["success" => true, "status" => "member"]);
        exit();
    }

    // 2. KONTROL (YENİ): Acaba bu kişi topluluğun BAŞKANI veya DANIŞMANI mı?
    // Communities tablosuna bakıyoruz.
    $checkLeader = $conn->prepare("
        SELECT community_id 
        FROM communities 
        WHERE community_id = ? AND (president_user_id = ? OR advisor_id = (SELECT advisor_id FROM advisors WHERE user_id = ?))
    ");
    $checkLeader->execute([$community_id, $user_id, $user_id]);
    
    if ($checkLeader->rowCount() > 0) {
        // Eğer başkansa veya danışmansa da "member" (üye) statüsü dönelim ki buton "Üyesiniz" desin.
        echo json_encode(["success" => true, "status" => "member"]);
        exit();
    }

    // 3. KONTROL: Bekleyen bir başvurusu var mı?
    $checkRequest = $conn->prepare("SELECT request_id FROM community_requests WHERE user_id = ? AND community_id = ? AND status = 'pending'");
    $checkRequest->execute([$user_id, $community_id]);
    if ($checkRequest->rowCount() > 0) {
        echo json_encode(["success" => true, "status" => "pending"]);
        exit();
    }

    // Hiçbiri değilse
    echo json_encode(["success" => true, "status" => "none"]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}