-- 클라우드플레어 하이퍼드라이브(Cloudflare Hyperdrive) 연동을 위한 PostgreSQL 스키마
-- 하이퍼드라이브는 PostgreSQL 프로토콜을 지원하므로, 기존 MySQL 스키마를 PostgreSQL 형태로 변환합니다.

-- 1. 후원 신청 및 관리 테이블 (sponsorship)
CREATE TABLE IF NOT EXISTS sponsorship (
  sp_id SERIAL PRIMARY KEY,
  sp_name VARCHAR(50) NOT NULL,
  sp_hp VARCHAR(20) NOT NULL,
  sp_email VARCHAR(100) DEFAULT '',
  sp_amount INTEGER NOT NULL DEFAULT 0,
  sp_type VARCHAR(20) NOT NULL DEFAULT 'regular',
  sp_bank VARCHAR(50) DEFAULT '',
  sp_account VARCHAR(100) DEFAULT '',
  sp_message TEXT,
  sp_status VARCHAR(20) DEFAULT 'pending',
  sp_ip VARCHAR(50) DEFAULT '',
  sp_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sp_datetime ON sponsorship(sp_datetime);
CREATE INDEX idx_sp_name ON sponsorship(sp_name);

-- 2. 자원봉사 신청 및 관리 테이블 (volunteer)
CREATE TABLE IF NOT EXISTS volunteer (
  vt_id SERIAL PRIMARY KEY,
  vt_name VARCHAR(50) NOT NULL,
  vt_hp VARCHAR(20) NOT NULL,
  vt_email VARCHAR(100) DEFAULT '',
  vt_message TEXT,
  vt_status VARCHAR(20) DEFAULT 'pending',
  vt_ip VARCHAR(50) DEFAULT '',
  vt_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vt_datetime ON volunteer(vt_datetime);

-- 3. 1:1 상담 및 문의 테이블 (inquiry)
CREATE TABLE IF NOT EXISTS inquiry (
  iq_id SERIAL PRIMARY KEY,
  iq_name VARCHAR(50) NOT NULL,
  iq_hp VARCHAR(20) NOT NULL,
  iq_email VARCHAR(100) DEFAULT '',
  iq_subject VARCHAR(255) NOT NULL,
  iq_content TEXT NOT NULL,
  iq_status VARCHAR(20) DEFAULT 'pending',
  iq_answer TEXT,
  iq_answer_datetime TIMESTAMP WITH TIME ZONE,
  iq_ip VARCHAR(50) DEFAULT '',
  iq_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_iq_datetime ON inquiry(iq_datetime);
