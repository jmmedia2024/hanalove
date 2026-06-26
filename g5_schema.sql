-- 사단법인 북한이탈주민중앙회 (하나사랑협회) GnuBoard 5 연동 데이터베이스 스키마
-- MySQL / MariaDB 호환 버전

-- 1. 후원 신청 및 관리 테이블 (g5_sponsorship)
CREATE TABLE IF NOT EXISTS `g5_sponsorship` (
  `sp_id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '고유 번호',
  `sp_name` VARCHAR(50) NOT NULL COMMENT '후원자명',
  `sp_hp` VARCHAR(20) NOT NULL COMMENT '연락처 (휴대폰)',
  `sp_email` VARCHAR(100) DEFAULT '' COMMENT '이메일 주소',
  `sp_amount` INT(11) NOT NULL DEFAULT 0 COMMENT '후원금액 (원)',
  `sp_type` VARCHAR(20) NOT NULL DEFAULT 'regular' COMMENT '후원 구분 (regular: 정기후원, temp: 일시후원)',
  `sp_bank` VARCHAR(50) DEFAULT '' COMMENT '납부 은행',
  `sp_account` VARCHAR(100) DEFAULT '' COMMENT '계좌번호 (암호화 권장)',
  `sp_message` TEXT COMMENT '남긴 메시지 / 응원의 말',
  `sp_status` VARCHAR(20) DEFAULT 'pending' COMMENT '처리 상태 (pending: 신청, active: 활성, paused: 일시중지, completed: 만료)',
  `sp_ip` VARCHAR(50) DEFAULT '' COMMENT '신청자 IP 주소',
  `sp_datetime` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '신청 일자',
  PRIMARY KEY (`sp_id`),
  KEY `idx_sp_datetime` (`sp_datetime`),
  KEY `idx_sp_name` (`sp_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='후원 신청 및 납부 내역 테이블';


-- 2. 자원봉사 신청 및 관리 테이블 (g5_volunteer)
CREATE TABLE IF NOT EXISTS `g5_volunteer` (
  `vt_id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '고유 번호',
  `vt_name` VARCHAR(50) NOT NULL COMMENT '봉사자명',
  `vt_hp` VARCHAR(20) NOT NULL COMMENT '연락처',
  `vt_email` VARCHAR(100) DEFAULT '' COMMENT '이메일',
  `vt_message` TEXT COMMENT '봉사 지원 동기 및 메시지',
  `vt_status` VARCHAR(20) DEFAULT 'pending' COMMENT '신청 상태 (pending: 대기, approved: 승인, rejected: 반려)',
  `vt_ip` VARCHAR(50) DEFAULT '' COMMENT '신청자 IP',
  `vt_datetime` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '신청 일자',
  PRIMARY KEY (`vt_id`),
  KEY `idx_vt_datetime` (`vt_datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='자원봉사 신청 관리 테이블';


-- 3. 1:1 상담 및 문의 테이블 (g5_inquiry)
CREATE TABLE IF NOT EXISTS `g5_inquiry` (
  `iq_id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '고유 번호',
  `iq_name` VARCHAR(50) NOT NULL COMMENT '작성자명',
  `iq_hp` VARCHAR(20) NOT NULL COMMENT '연락처',
  `iq_email` VARCHAR(100) DEFAULT '' COMMENT '이메일',
  `iq_subject` VARCHAR(255) NOT NULL COMMENT '문의 제목',
  `iq_content` TEXT NOT NULL COMMENT '문의 내용',
  `iq_status` VARCHAR(20) DEFAULT 'pending' COMMENT '처리 상태 (pending: 접수대기, processing: 답변중, answered: 답변완료)',
  `iq_answer` TEXT COMMENT '관리자 답변 내용',
  `iq_answer_datetime` DATETIME DEFAULT NULL COMMENT '답변 일자',
  `iq_ip` VARCHAR(50) DEFAULT '' COMMENT '작성자 IP',
  `iq_datetime` DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '문의 일자',
  PRIMARY KEY (`iq_id`),
  KEY `idx_iq_datetime` (`iq_datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='고객 문의 및 1:1 상담 테이블';
