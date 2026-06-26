-- 하나사랑협회 통합 데이터베이스 스키마 (PostgreSQL DDL)

-- 1. 회원 관리 도메인 (Members)
CREATE TABLE members (
    member_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('super_admin', 'content_manager', 'user')),
    profile_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 콘텐츠 관리 도메인 (Content Management)
CREATE TABLE posts (
    post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES members(member_id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('notice', 'gallery', 'page')),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    path VARCHAR(255) UNIQUE, -- pages용 라우팅 경로
    views INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_images (
    image_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(post_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 후원 및 재정 도메인 (Sponsorship & Finance)
CREATE TABLE sponsorships (
    sponsorship_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES members(member_id) ON DELETE SET NULL, -- 비회원 후원일 경우 NULL
    donor_name VARCHAR(100) NOT NULL,
    donor_phone VARCHAR(20),
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('one-time', 'regular')),
    status VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    message TEXT,
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 정기 후원 결제 내역 테이블
CREATE TABLE sponsorship_payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsorship_id UUID REFERENCES sponsorships(sponsorship_id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed'))
);

-- 4. 상담 및 민원 기능 도메인 (Consultation & Complaints)
CREATE TABLE consultations (
    consultation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES members(member_id) ON DELETE SET NULL,
    applicant_name VARCHAR(100) NOT NULL,
    applicant_email VARCHAR(255),
    applicant_phone VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 법률, 정착, 의료 등
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    assigned_admin_id UUID REFERENCES members(member_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE consultation_replies (
    reply_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID REFERENCES consultations(consultation_id) ON DELETE CASCADE,
    admin_id UUID REFERENCES members(member_id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. 자원봉사 신청 관리 (Volunteers)
CREATE TABLE volunteers (
    volunteer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES members(member_id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 설정
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_sponsorships_created_at ON sponsorships(created_at);
CREATE INDEX idx_consultations_status ON consultations(status);
