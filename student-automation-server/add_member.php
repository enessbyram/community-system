<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . "/config/db.php";

$data = json_decode(file_get_contents("php://input"), true);
$manager_id = $data['manager_id'] ?? ''; // Giriş yapan yönetici
$email = $data['email'] ?? '';           // Eklenecek kişinin maili
$role_id = $data['role_id'] ?? 10;       // Seçilen rol (Varsayılan: Üye)

if (empty($manager_id) || empty($email)) {
    echo json_encode(["success" => false, "message" => "Eksik veri."]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->connect();

    // 1. Yönetici hangi topluluğa ait?
    $stmtComm = $conn->prepare("SELECT community_id FROM community_members WHERE user_id = ? AND role_id < 10 LIMIT 1");
    $stmtComm->execute([$manager_id]);
    $community = $stmtComm->fetch(PDO::FETCH_ASSOC);

    if (!$community) {
        echo json_encode(["success" => false, "message" => "Yönetici yetkiniz yok."]);
        exit();
    }
    $community_id = $community['community_id'];

    // 2. Eklenecek kullanıcı sistemde kayıtlı mı?
    $stmtUser = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
    $stmtUser->execute([$email]);
    $userToAdd = $stmtUser->fetch(PDO::FETCH_ASSOC);

    if (!$userToAdd) {
        echo json_encode(["success" => false, "message" => "Bu e-posta adresine sahip bir kullanıcı bulunamadı."]);
        exit();
    }
    $new_member_id = $userToAdd['user_id'];

    // 3. Kullanıcı zaten bu topluluğa üye mi?
    $stmtCheck = $conn->prepare("SELECT member_id FROM community_members WHERE user_id = ? AND community_id = ?");
    $stmtCheck->execute([$new_member_id, $community_id]);
    
    if ($stmtCheck->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Kullanıcı zaten bu topluluğa üye."]);
        exit();
    }

    // 4. Üyeyi Ekle
    $sqlInsert = "INSERT INTO community_members (community_id, user_id, role_id) VALUES (?, ?, ?)";
    $stmtInsert = $conn->prepare($sqlInsert);
    $result = $stmtInsert->execute([$community_id, $new_member_id, $role_id]);

    if ($result) {
        echo json_encode(["success" => true, "message" => "Üye başarıyla eklendi."]);
    } else {
        echo json_encode(["success" => false, "message" => "Ekleme başarısız."]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}