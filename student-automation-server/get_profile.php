<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require_once __DIR__ . "/config/db.php";

$user_id = $_GET['user_id'] ?? '';

if (empty($user_id)) {
    echo json_encode(["success" => false, "message" => "User ID gelmedi."]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->connect();

    $sql = "SELECT user_id, full_name, email, role FROM users WHERE user_id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // --- ÖĞRENCİ NUMARASI MANTIĞI ---
        // Email'i @ işaretinden parçalara ayırıyoruz (örn: 2204109000@std.idu.edu.tr)
        // İlk parça [0] öğrenci numarasıdır.
        $email_parts = explode('@', $user['email']);
        $derived_student_number = $email_parts[0];

        $responseUser = [
            'user_id' => $user['user_id'],
            'full_name' => $user['full_name'],
            'email' => $user['email'],
            'student_number' => $derived_student_number, // Mailden türetildi
            'role' => $user['role']
        ];

        echo json_encode(["success" => true, "data" => $responseUser]);
    } else {
        echo json_encode(["success" => false, "message" => "Kullanıcı bulunamadı."]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>