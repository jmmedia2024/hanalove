<?php
/**
 * 사단법인 북한이탈주민중앙회 (하나사랑협회) - 후원 신청 처리 (GnuBoard 5 연동용)
 * 파일 경로: /theme/your_theme/sponsorship_process.php 또는 /bbs/sponsorship_process.php
 */

include_once('./_common.php'); // 그누보드5 공통 파일 포함 (db 세션 및 설정 자동 연동)

// 1. 입력값 보안 처리 및 화이트리스트 필터링
$sp_name    = isset($_POST['sp_name']) ? strip_tags(clean_xss_tags(trim($_POST['sp_name']))) : '';
$sp_hp      = isset($_POST['sp_hp']) ? strip_tags(clean_xss_tags(trim($_POST['sp_hp']))) : '';
$sp_email   = isset($_POST['sp_email']) ? filter_var(trim($_POST['sp_email']), FILTER_SANITIZE_EMAIL) : '';
$sp_amount  = isset($_POST['sp_amount']) ? (int)$_POST['sp_amount'] : 0;
$sp_type    = isset($_POST['sp_type']) && in_array($_POST['sp_type'], ['regular', 'temp']) ? $_POST['sp_type'] : 'regular';
$sp_bank    = isset($_POST['sp_bank']) ? strip_tags(clean_xss_tags(trim($_POST['sp_bank']))) : '';
$sp_account = isset($_POST['sp_account']) ? strip_tags(clean_xss_tags(trim($_POST['sp_account']))) : '';
$sp_message = isset($_POST['sp_message']) ? strip_tags(clean_xss_tags(trim($_POST['sp_message']))) : '';
$sp_ip      = $_SERVER['REMOTE_ADDR'];
$sp_datetime = date('Y-m-d H:i:s');

// 2. 필수값 검증
if (empty($sp_name)) {
    alert('후원자명을 입력해 주세요.');
}
if (empty($sp_hp)) {
    alert('연락처를 입력해 주세요.');
}
if ($sp_amount <= 0) {
    alert('올바른 후원금액을 입력해 주세요.');
}

// -----------------------------------------------------------------------------
// 방법 A: 그누보드 내장 DB 핸들러 ($g5['connect_db'] / sql_query / sql_escape) 사용
// -----------------------------------------------------------------------------

// 데이터보안 탈출 처리
$esc_name     = sql_real_escape_string($sp_name);
$esc_hp       = sql_real_escape_string($sp_hp);
$esc_email    = sql_real_escape_string($sp_email);
$esc_type     = sql_real_escape_string($sp_type);
$esc_bank     = sql_real_escape_string($sp_bank);
$esc_account  = sql_real_escape_string($sp_account);
$esc_message  = sql_real_escape_string($sp_message);

$insert_query = "
    INSERT INTO `g5_sponsorship`
    SET `sp_name`     = '{$esc_name}',
        `sp_hp`       = '{$esc_hp}',
        `sp_email`    = '{$esc_email}',
        `sp_amount`   = {$sp_amount},
        `sp_type`     = '{$esc_type}',
        `sp_bank`     = '{$esc_bank}',
        `sp_account`  = '{$esc_account}',
        `sp_message`  = '{$esc_message}',
        `sp_status`   = 'pending',
        `sp_ip`       = '{$sp_ip}',
        `sp_datetime` = '{$sp_datetime}'
";

// 쿼리 실행
$result = sql_query($insert_query, false);

if ($result) {
    alert('소중한 후원 신청이 성공적으로 접수되었습니다. 감사합니다!', './index.php');
} else {
    // -----------------------------------------------------------------------------
    // 방법 B: PDO Prepared Statements 를 활용한 강력한 SQL Injection 예방 처리 (권장)
    // -----------------------------------------------------------------------------
    try {
        // 그누보드 DB 설정을 기반으로 PDO 객체 생성
        $dsn = "mysql:host=" . G5_MYSQL_HOST . ";dbname=" . G5_MYSQL_DB . ";charset=utf8mb4";
        $pdo = new PDO($dsn, G5_MYSQL_USER, G5_MYSQL_PASSWORD, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);

        $sql = "INSERT INTO g5_sponsorship 
                (sp_name, sp_hp, sp_email, sp_amount, sp_type, sp_bank, sp_account, sp_message, sp_status, sp_ip, sp_datetime) 
                VALUES 
                (:sp_name, :sp_hp, :sp_email, :sp_amount, :sp_type, :sp_bank, :sp_account, :sp_message, :sp_status, :sp_ip, :sp_datetime)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':sp_name'     => $sp_name,
            ':sp_hp'       => $sp_hp,
            ':sp_email'    => $sp_email,
            ':sp_amount'   => $sp_amount,
            ':sp_type'     => $sp_type,
            ':sp_bank'     => $sp_bank,
            ':sp_account'  => $sp_account,
            ':sp_message'  => $sp_message,
            ':sp_status'   => 'pending',
            ':sp_ip'       => $sp_ip,
            ':sp_datetime' => $sp_datetime
        ]);

        alert('소중한 후원 신청이 성공적으로 접수되었습니다. 감사합니다!', './index.php');

    } catch (PDOException $e) {
        // 보안을 위해 실제 에러 메시지는 시스템 로그에만 기록하고 사용자에게는 친숙한 에러 메시지 노출
        error_log("Sponsorship DB Error: " . $e->getMessage());
        alert('데이터베이스 처리 중 오류가 발생했습니다. 관리자에게 문의해 주세요.');
    }
}
?>
