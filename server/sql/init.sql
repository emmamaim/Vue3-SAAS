CREATE DATABASE IF NOT EXISTS vue3_saas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE vue3_saas_db;

-- 建立任務表
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status ENUM('todo', 'doing', 'done') NOT NULL DEFAULT 'todo',
    priority ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium',
    description TEXT,
    dueDate DATETIME,
    createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updateAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 建立行程表
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    startTime CHAR(5) NOT NULL,
    endTime CHAR(5) NOT NULL,
    status ENUM('pending', 'confirmed', 'canceled') NOT NULL DEFAULT 'confirmed',
    relatedTaskId VARCHAR(50) NULL,
    createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updateAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_related_task 
    FOREIGN KEY (relatedTaskId) REFERENCES tasks (id) 
    ON DELETE SET NULL
);

-- 原始資料(測試)
INSERT INTO tasks (id, title, status, priority, description, dueDate)
VALUES 
    ('t_1', '早餐', 'todo', 'medium', 'breakfast', '2026-03-05 08:00:00'),
    ('t_2', '工作會議', 'doing', 'high', 'meeting', '2026-03-08 10:00:00'),
    ('t_3', '看書', 'done', 'low', 'reading', '2026-03-04 15:00:00');

INSERT INTO bookings (id, title, date, startTime, endTime, status, relatedTaskId)
VALUES 
    ('b_1', '測試1', '2026-03-03', '10:00', '11:00', 'confirmed', NULL),
    ('b_2', '測試2', '2026-03-04', '10:00', '11:00', 'confirmed', NULL),
    ('b_3', '測試3', '2026-03-05', '10:00', '11:00', 'confirmed', NULL),
    ('b_4', '測試4', '2026-03-06', '10:00', '11:00', 'confirmed', NULL);

-- 刪除資料表
DROP TABLE bookings;
DROP TABLE tasks;

-- 防止資料污染
TRUNCATE TABLE bookings;
  