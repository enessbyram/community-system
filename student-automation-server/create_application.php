<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . "/config/db.php";

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["success" => false, "message" => "Veri alınamadı."]);
    exit();
}

// Formdan gelen ID (React tarafında user_id olarak gönderiliyor)
$current_user_id = $input['user_id'] ?? null;

if (empty($current_user_id)) {
    echo json_encode(["success" => false, "message" => "Kullanıcı kimliği eksik."]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->connect();

    // 1. Kullanıcının yönetici olduğu topluluğu bul
    $stmtComm = $conn->prepare("SELECT community_id FROM community_members WHERE user_id = ? AND role_id IN (1, 2) LIMIT 1");
    $stmtComm->execute([$current_user_id]);
    $comm = $stmtComm->fetch(PDO::FETCH_ASSOC);

    if (!$comm) {
        throw new Exception("Yönetici olduğunuz bir topluluk bulunamadı.");
    }
    $community_id = $comm['community_id'];

    $conn->beginTransaction();

    // 2. Ana Başvuruyu Kaydet (user_id YERİNE sent_by KULLANIYORUZ)
    $sql = "INSERT INTO applications (
        community_id, sent_by, title, event_type, event_date, event_time, location, description, 
        materials_needed, has_speaker, speaker_info, has_stand, stand_details, stand_location, 
        has_poster, poster_details, current_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_advisor')";

    // Not: Status 'pending_advisor' olarak başlatıldı (Danışman onayı bekliyor)

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        $community_id,
        $current_user_id, // sent_by sütununa bu değeri yazıyoruz
        $input['title'],
        $input['event_type'],
        $input['event_date'],
        $input['event_time'],
        $input['location'],
        $input['description'],
        $input['materials_needed'],
        $input['has_speaker'] ? 1 : 0,
        $input['speaker_info'],
        $input['has_stand'] ? 1 : 0,
        $input['stand_details'],
        $input['stand_location'],
        $input['has_poster'] ? 1 : 0,
        $input['poster_details']
    ]);

    $application_id = $conn->lastInsertId();

    // 3. Öğrencileri Kaydet (Varsa)
    if (!empty($input['students']) && is_array($input['students'])) {
        // Tablo yoksa oluştur (Garanti olsun)
        $conn->exec("CREATE TABLE IF NOT EXISTS application_students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            application_id INT NOT NULL,
            full_name VARCHAR(255),
            student_number VARCHAR(50),
            department VARCHAR(255),
            travel_info VARCHAR(255),
            per_diem VARCHAR(255),
            accommodation VARCHAR(255),
            FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
        )");

        $sqlStudent = "INSERT INTO application_students (application_id, full_name, student_number, department, travel_info, per_diem, accommodation) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmtStudent = $conn->prepare($sqlStudent);

        foreach ($input['students'] as $student) {
            $stmtStudent->execute([
                $application_id,
                $student['full_name'],
                $student['student_number'],
                $student['department'],
                $student['travel_info'],
                $student['per_diem'],
                $student['accommodation']
            ]);
        }
    }

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Etkinlik başvurusu başarıyla gönderildi."]);

} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}