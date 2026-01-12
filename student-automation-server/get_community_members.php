<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require_once __DIR__ . "/config/db.php";

// Hem user_id hem community_id parametrelerini kontrol et
$user_id = $_GET['user_id'] ?? null;
$community_id = $_GET['community_id'] ?? null;

if (empty($user_id) && empty($community_id)) {
    echo json_encode(["success" => false, "message" => "Parametre eksik (user_id veya community_id gerekli)."]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->connect();

    // SENARYO 1: Eğer direkt community_id geldiyse (SKS Paneli için)
    if (!empty($community_id)) {
        // Doğrudan bu ID'yi kullanacağız, ekstra işlem yok.
    } 
    // SENARYO 2: Eğer user_id geldiyse (Topluluk Başkanı Paneli için)
    else {
        // Bu kullanıcının yönetici olduğu topluluğu bul
        $sqlFindCommunity = "SELECT community_id FROM community_members WHERE user_id = ? AND role_id < 10 LIMIT 1";
        $stmtFind = $conn->prepare($sqlFindCommunity);
        $stmtFind->execute([$user_id]);
        $community = $stmtFind->fetch(PDO::FETCH_ASSOC);

        if (!$community) {
            // Yönetici olduğu topluluk yoksa boş dön
            echo json_encode(["success" => true, "data" => []]); 
            exit();
        }
        $community_id = $community['community_id'];
    }

    // ARTIK ELİMİZDE KESİN BİR $community_id VAR. ÜYELERİ ÇEKELİM.
    
    // NOT: Frontend (React) tarafında 'name' ve 'studentNo' olarak kullandığımız için
    // SQL'de alias (takma isim) kullanarak React kodunu bozmadan veriyi formatlıyoruz.
    $sqlGetMembers = "
        SELECT 
            cm.member_id,
            cm.user_id,
            cm.role_id,
            cm.joined_at,
            u.full_name as name,  /* React: member.name */
            u.email,
            SUBSTRING_INDEX(u.email, '@', 1) as studentNo, /* React: member.studentNo */
            CASE 
                WHEN cm.role_id = 1 THEN 'Başkan'
                WHEN cm.role_id = 2 THEN 'Başkan Yrd.'
                WHEN cm.role_id = 3 THEN 'Sekreter'
                WHEN cm.role_id = 4 THEN 'Sayman'
                WHEN cm.role_id = 5 THEN 'Kurul Üyesi'
                WHEN cm.role_id = 10 THEN 'Üye'
                ELSE 'Üye'
            END as role_name
        FROM community_members cm
        JOIN users u ON cm.user_id = u.user_id
        WHERE cm.community_id = ?
        ORDER BY cm.role_id ASC, u.full_name ASC
    ";

    $stmtMembers = $conn->prepare($sqlGetMembers);
    $stmtMembers->execute([$community_id]);
    $members = $stmtMembers->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $members]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}