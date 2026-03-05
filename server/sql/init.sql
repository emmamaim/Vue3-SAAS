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
VALUES ('u_admin_001', 'admin', '$2b$10$8WE/v2cYV1rXidQFCKpzuOMnkXosz3sdv5l8irnTaGqdf.oTEDo8K', '系統管理員', 'super_admin', 'Management');
-- 技術部HR
INSERT INTO users (id, username, password, real_name, role, dept) 
VALUES ('u_hr_001', 'amy_hr', '$2b$10$f51/KA0akJQzUUzjjn12T.cpbJl/jWxA8mx8kFkh716.bEG3jo6y.', '艾米', 'dept_hr', 'Tech');
-- 技術部面試官
INSERT INTO users (id, username, password, real_name, role, dept) 
VALUES ('u_int_001', 'kevin_tech', '$2b$10$aIBtBo4d7ivYAErIKvoAYubXT715Pg4Dj4/30v3e7/3jnBn2HQxju', '凱文', 'interviewer', 'Tech');

-- 建立候選人表
CREATE TABLE IF NOT EXISTS candidates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    dept VARCHAR(50) NOT NULL,
    status ENUM('pending','interviewing','hired','rejected') DEFAULT 'pending',
    hr_id VARCHAR(50),
    createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_candidate_hr FOREIGN KEY (hr_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 候選人
INSERT INTO candidates (id, name, position, email, dept, status, hr_id) VALUES ('c_test_001', '張小明', 'Frontend Engineer', 'xiaoming@example.com', 'Tech', 'interviewing', 'u_hr_001');

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
    rating TINYINT DEFAULT NULL,
    comments TEXT DEFAULT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    CONSTRAINT fk_int_candidate FOREIGN KEY (candidate_id) REFERENCES candidates (id) ON DELETE CASCADE,
    CONSTRAINT fk_int_interviewer FOREIGN KEY (interviewer_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT fk_int_hr FOREIGN KEY (hr_id) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 面試
INSERT INTO interviews (id, candidate_id, interviewer_id, hr_id, interview_round, date, startTime, endTime, location, status) VALUES ('int_test_002', 'c_test_001', 'u_int_001','u_hr_001', 1, '2026-03-12', '10:30:00', '11:30:00', 'Google Meet (meet.google.com/abc-defg-hij)', 'scheduled');




-- 刪除資料表
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS interviews;