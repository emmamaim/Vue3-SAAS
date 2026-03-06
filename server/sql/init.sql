CREATE DATABASE IF NOT EXISTS vue3_saas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE vue3_saas_db;

-- 建立用戶表
-- 超級管理員admin無隸屬部門或創建人
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    real_name VARCHAR(50) NOT NULL,
    role ENUM('super_admin', 'dept_hr', 'interviewer') NOT NULL,
    dept VARCHAR(50) DEFAULT NULL,
    created_by VARCHAR(50) DEFAULT NULL,
    status ENUM('active', 'disabled') DEFAULT 'active',
    last_login DATETIME DEFAULT NULL,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 原始資料(測試)
-- 超級管理員
INSERT INTO users (id, username, password, real_name, role, dept) 
VALUES ('u_admin_001', 'admin', '123456', '系統管理員', 'super_admin', 'Management');
-- 技術部HR
INSERT INTO users (id, username, password, real_name, role, dept) 
VALUES ('u_hr_001', 'amy_hr', '123456', '艾米', 'dept_hr', 'Tech');
-- 技術部面試官
INSERT INTO users (id, username, password, real_name, role, dept) 
VALUES ('u_int_001', 'kevin_tech', '123456', '凱文', 'interviewer', 'Tech');

-- 建立應徵者表
CREATE TABLE IF NOT EXISTS candidates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    resume_url VARCHAR(255),
    dept VARCHAR(50) NOT NULL,
    source VARCHAR(50) DEFAULT 'Direct',
    status ENUM('pending', 'screening', 'interviewing', 'offer', 'hired', 'rejected') DEFAULT 'pending',
    hr_id VARCHAR(50),
    createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_candidate_hr FOREIGN KEY (hr_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 應徵者
INSERT INTO candidates (id, name, position, email, phone, resume_url, dept, source, status, hr_id) VALUES ('can_2026_001', '林曉明', 'Frontend Engineer', 'ming@example.com', '0912-345-678', '/uploads/resumes/lin_ming_cv.pdf', 'Tech', 'LinkedIn', 'interviewing', 'u_hr_001');
INSERT INTO candidates (id, name, position, email, phone, resume_url, dept, source, status, hr_id) VALUES ('can_2026_002', '陳大為', 'Product Manager', 'david.chen@example.com', '0987-654-321', '/uploads/resumes/david_pm_cv.pdf', 'Product', '104', 'pending', 'u_hr_001');

-- 建立面試表
CREATE TABLE IF NOT EXISTS interviews (
    id VARCHAR(50) PRIMARY KEY,
    candidate_id VARCHAR(50) NOT NULL,
    interviewer_id VARCHAR(50) NOT NULL,
    hr_id VARCHAR(50) NOT NULL,
    interview_round TINYINT DEFAULT 1,
    date DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    location VARCHAR(255) DEFAULT 'Remote / Online',
    rating TINYINT,
    comments TEXT,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_int_candidate FOREIGN KEY (candidate_id) REFERENCES candidates (id) ON DELETE CASCADE,
    CONSTRAINT fk_int_interviewer FOREIGN KEY (interviewer_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT fk_int_hr FOREIGN KEY (hr_id) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 面試
INSERT INTO interviews (id, candidate_id, interviewer_id, hr_id, interview_round, date, startTime, endTime, location, rating, comments, status) VALUES ('int_2026_001', 'can_2026_001', 'u_tech_001', 'u_hr_001', 1, '2026-03-05', '14:00:00', '15:00:00', 'Google Meet', 4, '技術基礎紮實，對 Vue3 的響應式原理理解深刻，但 CSS 佈局能力稍弱。建議進入二面。', 'completed');
INSERT INTO interviews (id, candidate_id, interviewer_id, hr_id, interview_round, date, startTime, endTime, location, status) VALUES ('int_2026_002', 'can_2026_001', 'u_mgr_001', 'u_hr_001', 2, '2026-03-10', '10:30:00', '11:30:00', 'Conference Room A', 'scheduled');




-- 刪除資料表
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS interviews;