<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . "/config/db.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? '';
$event_id = $data['event_id'] ?? '';

if (empty($user_id) || empty($event_id)) {
    echo json_encode(["success" => false, "message" => "Eksik veri."]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->connect();

    // Zaten katılmış mı kontrol et (Frontendde de kontrol ediyoruz ama güvenlik için)
    $checkSql = "SELECT id FROM event_participants WHERE event_id = ? AND user_id = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->execute([$event_id, $user_id]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Zaten katıldınız."]);
        exit();
    }

    $sql = "INSERT INTO event_participants (event_id, user_id) VALUES (?, ?)";
    $insertStmt = $conn->prepare($sql);
    $result = $insertStmt->execute([$event_id, $user_id]);

    if ($result) {
        echo json_encode(["success" => true, "message" => "Katılım başarılı."]);
    } else {
        echo json_encode(["success" => false, "message" => "Bir hata oluştu."]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>