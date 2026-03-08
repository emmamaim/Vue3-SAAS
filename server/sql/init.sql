CREATE DATABASE IF NOT EXISTS vue3_saas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE vue3_saas_db;
-- 基礎資料表
-- 1. 部門表 (Dept)
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    manager_id VARCHAR(50) DEFAULT NULL,
    description TEXT,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 人才來源表 (Source)
CREATE TABLE IF NOT EXISTS sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('Internal', 'External') DEFAULT 'External',
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 職位類別表 (Job_category)
CREATE TABLE IF NOT EXISTS job_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. 職位表(jobs)
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    job_name VARCHAR(100) NOT NULL,
    description TEXT,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_category FOREIGN KEY (category_id) REFERENCES job_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 建立用戶表
-- 超級管理員admin無隸屬部門或創建人
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    real_name VARCHAR(50) NOT NULL,
    role ENUM('super_admin', 'dept_hr', 'interviewer') NOT NULL,
    dept_id INT,
    created_by VARCHAR(50) DEFAULT NULL,
    status ENUM('active', 'disabled') DEFAULT 'active',
    last_login DATETIME DEFAULT NULL,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_dept FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE SET NULL,
    CONSTRAINT fk_user_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 補上外鍵
ALTER TABLE departments 
ADD CONSTRAINT fk_dept_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;


-- 建立應徵者表
CREATE TABLE IF NOT EXISTS candidates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    job_id INT NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    resume_url VARCHAR(255),
    dept_id INT NOT NULL,
    source_id INT DEFAULT NULL,
    category_id INT DEFAULT NULL,
    status ENUM('pending', 'screening', 'interviewing', 'offer', 'hired', 'rejected') DEFAULT 'pending',
    hr_id VARCHAR(50) DEFAULT NULL,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_candidate_dept FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE RESTRICT,
    CONSTRAINT fk_candidate_source FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE SET NULL,
    CONSTRAINT fk_candidate_category FOREIGN KEY (category_id) REFERENCES job_categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_candidate_hr FOREIGN KEY (hr_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_candidate_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

-- 部門初始資料
INSERT INTO departments (id, name, description) VALUES 
(1, '技術研發部', '負責產品核心功能開發、系統架構設計與基礎設施維運'),
(2, '產品管理部', '負責產品市場調研、需求分析、原型設計與產品生命週期管理'),
(3, '設計部', '負責使用者界面 (UI) 與使用者體驗 (UX) 設計，以及公司品牌視覺'),
(4, '人力資源部', '負責人才招聘、薪酬福利、員工培訓、績效考核與企業文化建設'),
(5, '財務部', '負責預算控管、稅務規劃、日常會計作業與投融資管理'),
(6, '市場營銷部', '負責品牌公關、數位廣告投放、內容行銷與市場推廣活動'),
(7, '銷售部', '負責客戶開發、商務談判、合約簽署與營收指標達成'),
(8, '客戶成功部', '負責售後服務、客戶續約維護、產品導入培訓與問題反饋處理'),
(9, '法務與合規部', '負責合約審閱、智慧財產權保護、公司治理與相關法規遵循'),
(10, '行政總務部', '負責辦公環境管理、採購供應、資產管理與日常後勤支援');

-- 人才來源初始資料
INSERT INTO sources (id, name, type) VALUES 
(1, '104 人力銀行', 'External'),
(2, 'CakeResume', 'External'),
(3, 'Yourator 數位人才媒合', 'External'),
(4, 'LinkedIn', 'External'),
(5, '1111 人力銀行', 'External'),
(6, 'Meet.jobs', 'External'),
(7, '員工內部推薦', 'Internal'),
(8, '公司官網/主動投遞', 'Internal'),
(9, '獵頭顧問 (Headhunter)', 'External'),
(10, '校園徵才/實習轉正', 'Internal');

-- 職位類別初始資料
INSERT INTO job_categories (id, name) VALUES 
(1, '軟體開發類'),
(2, '產品管理類'),
(3, '設計與創意類'),
(4, '維運與資安類'),
(5, '資料科學與 AI 類'),
(6, '行銷推廣類'),
(7, '業務與商務開發類'),
(8, '客戶服務與成功類'),
(9, '行政與人力資源類'),
(10, '財務與法務類');

-- 職位初始資料
INSERT INTO jobs (category_id, job_name) VALUES 
(1, '前端工程師'),
(1, '後端工程師'),
(2, '產品經理 (PM)'),
(2, '專案經理 (PMP)'),
(3, 'UI/UX 設計師'),
(3, '視覺設計師'),
(4, '維運工程師 (SRE)'),
(4, '資安工程師'),
(5, '資料科學家'),
(5, '機器學習工程師'),
(6, '數位行銷專員'),
(6, '社群小編'),
(7, '業務開發 (BD)'),
(7, '帳戶經理 (AM)'),
(8, '客戶成功經理 (CSM)'),
(8, '客服支援專員'),
(9, '人資專員 (HR)'),
(9, '行政總務'),
(10, '財務會計'),
(10, '法務專員');

-- 用戶初始資料
-- 1. 設置超級管理員 (無隸屬部門，由自己創建)
INSERT INTO users (id, username, password, real_name, role, dept_id, created_by, status) 
VALUES ('u_000', 'admin', '$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C', '超級管理員', 'super_admin', NULL, 'u_000', 'active');

-- 2. 增加 5 個 HR 用戶 (dept_hr)
INSERT INTO users (id, username, password, real_name, role, dept_id, created_by, status) VALUES 
('u_001', 'hr_zhang', '$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C', '張小曼', 'dept_hr', 3, 'u_000', 'active'),
('u_002', 'hr_lee', '$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C', '李明哲', 'dept_hr', 1, 'u_000', 'active'),
('u_003', 'hr_wang', '$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C', '王美玲', 'dept_hr', 2, 'u_000', 'active'),
('u_004', 'hr_chen', '$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C', '陳雅婷', 'dept_hr', 4, 'u_000', 'active'),
('u_005', 'hr_lin', '$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C', '林志強', 'dept_hr', 3, 'u_000', 'active');

-- 3. 增加 5 個面試官用戶 (interviewer)
INSERT INTO users (id, username, password, real_name, role, dept_id, created_by, status) VALUES 
('u_006', 'tech_king', '$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C', '金大為', 'interviewer', 1, 'u_000', 'active'),
('u_007', 'tech_liu', '$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C', '劉德華', 'interviewer', 1, 'u_000', 'active'),
('u_008', 'pm_wu', '$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C', '吳珊珊', 'interviewer', 2, 'u_000', 'active'),
('u_009', 'mk_huang', '$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C', '黃金發', 'interviewer', 4, 'u_000', 'active'),
('u_010', 'tech_zhao', '$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C', '趙雲', 'interviewer', 1, 'u_000', 'active');

-- 應徵者初始資料
INSERT INTO candidates (id, name, job_id, email, phone, resume_url, dept_id, source_id, category_id, status, hr_id) VALUES
('can_uuid_001', '陳志明', 1, 'cm.chen@example.com', '0912-345-678', '/uploads/resumes/resume_01.pdf', 1, 1, 1, 'screening', 'u_001'),
('can_uuid_002', '林美玲', 2, 'meiling.lin@example.com', '0922-111-222', '/uploads/resumes/resume_02.pdf', 1, 2, 1, 'interviewing', 'u_001'),
('can_uuid_003', '張大為', 3, 'david.chang@example.com', '0933-444-555', NULL, 2, 3, 2, 'pending', 'u_001'),
('can_uuid_004', '李小惠', 4, 'kevin.lee@example.com', '0955-666-777', '/uploads/resumes/resume_04.pdf', 2, 1, 2, 'rejected', 'u_002'),
('can_uuid_005', '王國華', 5, 'kh.wang@example.com', '0966-888-999', '/uploads/resumes/resume_05.pdf', 3, 4, 3, 'offer', 'u_002'),
('can_uuid_006', '趙敏', 1, 'min.chao@example.com', '0977-000-111', NULL, 1, 2, 1, 'hired', 'u_001'),
('can_uuid_007', '孫悟空', 6, 'monkey.king@example.com', '0988-222-333', '/uploads/resumes/resume_07.pdf', 4, 1, 4, 'screening', 'u_002'),
('can_uuid_008', '周小智', 2, 'jay.chou@example.com', '0911-333-444', '/uploads/resumes/resume_08.pdf', 1, 3, 1, 'interviewing', 'u_001'),
('can_uuid_009', '蔡美林', 7, 'jolin.tsai@example.com', '0919-555-666', '/uploads/resumes/resume_09.pdf', 5, 2, 5, 'pending', 'u_002'),
('can_uuid_010', '郭小明', 8, 'terry.guo@example.com', '0920-777-888', '/uploads/resumes/resume_10.pdf', 6, 4, 6, 'screening', 'u_001');