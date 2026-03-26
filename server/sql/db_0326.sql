-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: vue3_saas_db
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date` date NOT NULL,
  `startTime` char(5) COLLATE utf8mb4_general_ci NOT NULL,
  `endTime` char(5) COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('pending','confirmed','completed','canceled') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'confirmed',
  `relatedTaskId` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updateAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES ('bk_01a50704-4dc1-4ae9-a33a-b5184bccb1ec','u_315904ab','最終面試 - 彭于晏 (三輪)','2026-03-30','10:00','11:00','confirmed','tsk_ca32397d-06eb-4b94-a41f-17a3f0055e73','2026-03-13 09:44:21','2026-03-13 09:44:21'),('bk_3995cdf8-e595-48e1-a1ed-9e5feb0a3aac','u_007','面試：金城武 - 第 1 輪','2026-03-17','10:00','11:00','confirmed','tsk_00514445-3df6-4eb7-9c69-289c4487de0c','2026-03-17 02:40:16','2026-03-17 02:40:16'),('bk_525242ba-fe59-4836-bca4-433bd55c248b','u_315904ab','複試 - 彭于晏 (二輪)','2026-03-25','09:30','10:30','completed','tsk_71dee943-6041-41d4-bf61-ade60ac0a87f','2026-03-13 09:44:27','2026-03-13 14:34:10'),('bk_5d03c21b-3cb9-4baf-82b9-c7143c5694a4','u_e06a776e','面試：testCandidate5 - 第 1 輪','2026-04-02','10:00','11:00','completed','tsk_33ebe556-c35e-4deb-9c95-146cf65d522e','2026-03-25 11:15:32','2026-03-26 01:42:17'),('bk_63866666-1a99-4ff0-9146-4db0a7043a0a','u_007','面試：testCandidate8 - 第 1 輪','2026-03-30','10:00','11:00','confirmed','tsk_cb352f85-1a23-4af9-b066-6b28ac39cc0b','2026-03-25 10:01:32','2026-03-25 10:01:32'),('bk_82f743c0-2141-42c7-b455-1721ee10e046','u_e06a776e','面試：testCandidate2 - 第 1 輪','2026-03-25','12:00','13:00','confirmed','tsk_f12d0a7f-bf21-4410-9616-de0f6451aab4','2026-03-25 10:57:43','2026-03-25 10:57:43'),('bk_847e10f7-70e0-4602-bd2a-68bb1024e59a','u_e06a776e','面試：testCandidate4 - 第 1 輪','2026-03-30','10:00','11:00','confirmed','tsk_7104a327-e183-41be-b5ec-6a7cd806b218','2026-03-25 11:04:03','2026-03-25 11:04:03'),('bk_8bfaea5c-ca2a-44de-ab15-fb1a13aecc1a','u_e06a776e','面試：testCandidate7 - 第 1 輪','2026-03-25','11:00','12:00','completed','tsk_7d1ee7d1-3fcf-4141-b24d-54e608a2e39d','2026-03-25 10:17:02','2026-03-25 13:54:13'),('bk_a964d2d0-35ab-43b6-9892-6b69142c5f0f','u_315904ab','初試 - 前端工程師 (應徵者: 彭于晏)','2026-03-20','14:00','15:00','completed','tsk_63673d84-3ccd-4de1-94bd-7ea97629f7e9','2026-03-13 09:44:05','2026-03-18 06:17:37'),('bk_b5017e4b-98eb-4111-9b37-f72e18a7ad0f','u_e06a776e','面試：testCandidate3 - 第 1 輪','2026-03-31','13:00','14:00','confirmed','tsk_59ef2546-573c-4054-992a-a1645febf59c','2026-03-25 11:03:49','2026-03-25 11:03:49'),('bk_e1c8f1aa-d98a-4f69-a354-f41a62102775','u_e06a776e','面試：testCandidate1 - 第 1 輪','2026-03-25','10:00','11:00','confirmed','tsk_c04a2788-b347-432a-b60c-a6dc7c54ba24','2026-03-25 10:56:29','2026-03-25 10:56:29'),('bk_p_036a394c-87a8-47d8-a3f1-772cae3c7247','u_e06a776e','會議','2026-04-13','16:00','16:30','confirmed',NULL,'2026-03-25 13:55:36','2026-03-25 13:55:36'),('bk_p_293e594f-6fc3-42ce-b83c-a478b8304533','u_e06a776e','會議','2026-04-03','14:00','16:00','confirmed',NULL,'2026-03-25 13:55:09','2026-03-25 13:55:09'),('bk_p_343b9461-2fb2-488f-b832-6ed1faa52efa','u_e06a776e','會議','2026-04-02','11:00','12:00','confirmed',NULL,'2026-03-25 13:54:53','2026-03-25 13:54:53'),('bk_p_4b040acd-1be5-4a18-bbe2-3b75a1080345','u_e06a776e','會議','2026-04-07','10:00','11:00','confirmed',NULL,'2026-03-25 13:56:16','2026-03-25 13:56:16'),('bk_p_60a6724c-15b8-46ac-8b5b-a48bce2a5d97','u_315904ab','我要測試一個超長標題的行程哈哈哈哈哈哈哈哈哈哈！！！！測試測試！！1234567890','2026-03-20','10:00','11:00','confirmed',NULL,'2026-03-22 13:11:03','2026-03-22 13:29:30'),('bk_p_ca9aa0b3-d028-4e71-bcd2-f0c90200fa06','u_e06a776e','TEST','2026-03-26','10:00','11:00','confirmed',NULL,'2026-03-26 06:06:53','2026-03-26 06:06:53'),('bk_p_d624b4ab-9674-4ec4-a37a-6e26ab68b4af','u_315904ab','會議','2026-03-17','10:00','11:00','confirmed',NULL,'2026-03-17 03:08:27','2026-03-17 03:08:27'),('bk_p_fa98dfc9-5f72-4257-8b81-54180d17c0ba','u_315904ab','看書','2026-03-20','16:00','17:00','confirmed',NULL,'2026-03-13 10:07:19','2026-03-17 03:13:29');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidates` (
  `id` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `job_id` int NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `resume_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dept_id` int NOT NULL,
  `source_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `status` enum('pending','screening','interviewing','offer','hired','rejected') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `hr_id` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_candidate_dept` (`dept_id`),
  KEY `fk_candidate_source` (`source_id`),
  KEY `fk_candidate_category` (`category_id`),
  KEY `fk_candidate_hr` (`hr_id`),
  KEY `fk_candidate_job` (`job_id`),
  KEY `idx_candidate_active` (`is_active`),
  CONSTRAINT `fk_candidate_category` FOREIGN KEY (`category_id`) REFERENCES `job_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_candidate_dept` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `fk_candidate_hr` FOREIGN KEY (`hr_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_candidate_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`),
  CONSTRAINT `fk_candidate_source` FOREIGN KEY (`source_id`) REFERENCES `sources` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES ('1132e4d4-f0aa-429f-ab15-16a82825c8ca','testCandidate7',18,'07@gmail.com','0912345607','./uploads/resumes/resume-1774510745050-228306451.pdf',5,10,9,'interviewing','u_ca5b3057',1,'2026-03-25 09:54:58'),('2fc0fce9-53e1-4c6e-9074-f2a1ccb1453b','testCandidate3',1,'03@gmail.com','0912345675','./uploads/resumes/resume-1774510673508-184383656.pdf',5,7,1,'interviewing','u_ca5b3057',1,'2026-03-25 08:38:23'),('572f00e8-1a00-4229-b8e1-ef3f84c29321','TEST1',4,'emmamaitest1@gmail.com','0912345679','/uploads/resumes/resume-1773039084364-833762326.txt',6,1,2,'screening','u_000',0,'2026-03-09 06:51:24'),('8478fa6b-7aa6-4d70-a2ce-59b14b5be04a','testCandidate4',4,'04@gmai.com','0912345604','./uploads/resumes/resume-1774510700014-581015721.pdf',2,4,2,'interviewing','u_ca5b3057',1,'2026-03-25 09:51:15'),('856091f7-0814-4ea4-b464-3396b3f9923e','testCandidate5',8,'05@gmail.com','0912345605','./uploads/resumes/resume-1774510715064-382660646.pdf',6,2,4,'interviewing','u_ca5b3057',1,'2026-03-25 09:52:46'),('91dd14f3-24b2-454a-911d-b0d8c01b8a16','testCandidate6',5,'06@gmail.com','0912345606','./uploads/resumes/resume-1774510729272-478268533.pdf',6,5,3,'screening','u_ca5b3057',1,'2026-03-25 09:54:02'),('bad3da3f-c30c-409e-b8bd-58e16154aaee','testCandidate2',14,'02@gmail.com','0912345678','./uploads/resumes/resume-1774510630724-696676222.pdf',3,1,7,'interviewing','u_ca5b3057',1,'2026-03-25 08:14:46'),('c1d315d0-c8c6-4cee-a64c-0471d1fc911e','testCandidate8',19,'08@gmail.com','0912345608','./uploads/resumes/resume-1774510500455-851461592.pdf',2,8,10,'interviewing','u_ca5b3057',1,'2026-03-25 09:55:45'),('cf51626d-6bab-406e-9169-b43e9132c173','testCandidate1',1,'test1@gmail.com','0912345673','./uploads/resumes/resume-1774510595425-573815491.pdf',6,7,1,'interviewing','u_ca5b3057',1,'2026-03-20 06:54:23'),('c_001','林建豪',1,'jeremy.lin@example.com','0912-345-678','./uploads/resumes/resume-1773019958898-102733145.txt',1,1,1,'screening','u_002',0,'2026-03-09 00:55:41'),('c_002','周曉',5,'jay.chou@example.com','0922111222','/uploads/resumes/chou.pdf',3,6,3,'screening','u_ca5b3057',0,'2026-03-09 00:55:41'),('c_003','蔡依林',3,'jolin.tsai@example.com','0933-555-888','/uploads/resumes/tsai.pdf',2,2,2,'pending','u_003',0,'2026-03-09 00:55:41'),('c_004','張惠妹',11,'a-mei@example.com','0988-777-666','/uploads/resumes/amei.pdf',6,8,6,'offer','u_004',0,'2026-03-09 00:55:41'),('c_005','陳奕迅',2,'eason.chan@example.com','0900-123-456',NULL,1,7,1,'pending','u_002',0,'2026-03-09 00:55:41'),('c_006','桂綸鎂',5,'gwei@example.com','0955-444-333','/uploads/resumes/gwei.pdf',3,3,3,'hired','u_005',0,'2026-03-09 00:55:41'),('c_007','彭于晏',1,'eddie.peng@example.com','0966-888-999','/uploads/resumes/peng.pdf',1,9,1,'interviewing','u_002',0,'2026-03-09 00:55:41'),('c_008','舒淇',17,'shuki@example.com','0977-000-111','/uploads/resumes/shuki.pdf',4,1,9,'pending','u_004',0,'2026-03-09 00:55:41'),('c_009','金城武',7,'takeshi@example.com','0944-222-333','/uploads/resumes/takeshi.pdf',1,4,4,'interviewing','u_002',0,'2026-03-09 00:55:41'),('c_010','五月天阿信',6,'ashin@example.com','0911-999-000',NULL,3,10,3,'screening','u_001',0,'2026-03-09 00:55:41'),('c_011','舊應徵者',2,'old.user@example.com','0900-000-000',NULL,1,5,1,'rejected','u_002',0,'2026-03-09 00:55:44');
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `manager_id` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `fk_dept_manager` (`manager_id`),
  CONSTRAINT `fk_dept_manager` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'技術研發部',NULL,'負責產品核心功能開發、系統架構設計與基礎設施維運','2026-03-07 14:53:23','2026-03-07 14:53:23'),(2,'產品管理部',NULL,'負責產品市場調研、需求分析、原型設計與產品生命週期管理','2026-03-07 14:53:23','2026-03-07 14:53:23'),(3,'設計部',NULL,'負責使用者界面 (UI) 與使用者體驗 (UX) 設計，以及公司品牌視覺','2026-03-07 14:53:23','2026-03-07 14:53:23'),(4,'人力資源部',NULL,'負責人才招聘、薪酬福利、員工培訓、績效考核與企業文化建設','2026-03-07 14:53:23','2026-03-07 14:53:23'),(5,'財務部',NULL,'負責預算控管、稅務規劃、日常會計作業與投融資管理','2026-03-07 14:53:23','2026-03-07 14:53:23'),(6,'市場營銷部',NULL,'負責品牌公關、數位廣告投放、內容行銷與市場推廣活動','2026-03-07 14:53:23','2026-03-07 14:53:23'),(7,'銷售部',NULL,'負責客戶開發、商務談判、合約簽署與營收指標達成','2026-03-07 14:53:23','2026-03-07 14:53:23'),(8,'客戶成功部',NULL,'負責售後服務、客戶續約維護、產品導入培訓與問題反饋處理','2026-03-07 14:53:23','2026-03-07 14:53:23'),(9,'法務與合規部',NULL,'負責合約審閱、智慧財產權保護、公司治理與相關法規遵循','2026-03-07 14:53:23','2026-03-07 14:53:23'),(10,'行政總務部',NULL,'負責辦公環境管理、採購供應、資產管理與日常後勤支援','2026-03-07 14:53:23','2026-03-07 14:53:23');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interviews`
--

DROP TABLE IF EXISTS `interviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interviews` (
  `id` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `candidate_id` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `interviewer_id` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `hr_id` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `dept_id` int NOT NULL,
  `interview_round` tinyint DEFAULT '1',
  `booking_id` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `task_id` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date` date NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'Remote / Online',
  `result` enum('pass','fail','pending') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `comments` text COLLATE utf8mb4_general_ci,
  `status` enum('scheduled','completed','cancelled') COLLATE utf8mb4_general_ci DEFAULT 'scheduled',
  `updatedAt` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_int_candidate` (`candidate_id`),
  KEY `fk_int_interviewer` (`interviewer_id`),
  CONSTRAINT `fk_int_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_int_interviewer` FOREIGN KEY (`interviewer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interviews`
--

LOCK TABLES `interviews` WRITE;
/*!40000 ALTER TABLE `interviews` DISABLE KEYS */;
INSERT INTO `interviews` VALUES ('int_2ff74638-7f7d-4cbe-92d2-28bfe2f0e3dc','c1d315d0-c8c6-4cee-a64c-0471d1fc911e','u_007','u_ca5b3057',2,1,'bk_63866666-1a99-4ff0-9146-4db0a7043a0a','tsk_cb352f85-1a23-4af9-b066-6b28ac39cc0b','2026-03-30','10:00:00','11:00:00','線上會議室','pending',NULL,'scheduled',NULL),('int_4de1bdf0-996c-4dc0-bd98-0ad93811bccb','c_007','u_315904ab','u_bb6178bc',5,2,'bk_525242ba-fe59-4836-bca4-433bd55c248b','tsk_71dee943-6041-41d4-bf61-ade60ac0a87f','2026-03-25','09:30:00','10:30:00','會議室 B','pass','優秀','completed','2026-03-13 14:34:10'),('int_7eb6e184-bf26-4eae-bfbc-61219e49cd83','c_007','u_315904ab','u_bb6178bc',5,1,'bk_a964d2d0-35ab-43b6-9892-6b69142c5f0f','tsk_63673d84-3ccd-4de1-94bd-7ea97629f7e9','2026-03-20','14:00:00','15:00:00','Google Meet: https://meet.google.com/abc-defg-hij','pass','很棒！','completed','2026-03-18 07:12:41'),('int_8d9bc1d4-4113-4302-94ac-054daefdca9d','c_009','u_007','u_000',1,1,'bk_3995cdf8-e595-48e1-a1ed-9e5feb0a3aac','tsk_00514445-3df6-4eb7-9c69-289c4487de0c','2026-03-17','10:00:00','11:00:00','線上會議室','pending',NULL,'scheduled',NULL),('int_9ee2ddea-bd97-4a40-94ee-a1bc2e9be4bc','1132e4d4-f0aa-429f-ab15-16a82825c8ca','u_e06a776e','u_ca5b3057',5,1,'bk_8bfaea5c-ca2a-44de-ab15-fb1a13aecc1a','tsk_7d1ee7d1-3fcf-4141-b24d-54e608a2e39d','2026-03-25','11:00:00','12:00:00','線上會議室','pass','通過！','completed','2026-03-25 13:54:13'),('int_a0f2cb6c-fbf1-4d8a-8bde-d716836fc64e','856091f7-0814-4ea4-b464-3396b3f9923e','u_e06a776e','u_ca5b3057',6,1,'bk_5d03c21b-3cb9-4baf-82b9-c7143c5694a4','tsk_33ebe556-c35e-4deb-9c95-146cf65d522e','2026-04-02','10:00:00','11:00:00','線上會議室','pending','A','completed','2026-03-26 01:42:17'),('int_a27414af-d0d6-4f59-8ef1-6b1b1bf09720','bad3da3f-c30c-409e-b8bd-58e16154aaee','u_e06a776e','u_ca5b3057',3,1,'bk_82f743c0-2141-42c7-b455-1721ee10e046','tsk_f12d0a7f-bf21-4410-9616-de0f6451aab4','2026-03-25','12:00:00','13:00:00','線上會議室','pending',NULL,'scheduled',NULL),('int_b7dcf545-a90e-4c46-b223-2a2a67e83d2e','c_007','u_315904ab','u_bb6178bc',5,3,'bk_01a50704-4dc1-4ae9-a33a-b5184bccb1ec','tsk_ca32397d-06eb-4b94-a41f-17a3f0055e73','2026-03-30','10:00:00','11:00:00','CEO 辦公室','pending',NULL,'scheduled',NULL),('int_e695ac91-c6c9-4274-9c6f-44b6371a6b4f','2fc0fce9-53e1-4c6e-9074-f2a1ccb1453b','u_e06a776e','u_ca5b3057',5,1,'bk_b5017e4b-98eb-4111-9b37-f72e18a7ad0f','tsk_59ef2546-573c-4054-992a-a1645febf59c','2026-03-31','13:00:00','14:00:00','線上會議室','pending',NULL,'scheduled',NULL),('int_f3565a8f-0d17-47de-99d8-6199018742e0','cf51626d-6bab-406e-9169-b43e9132c173','u_e06a776e','u_ca5b3057',6,1,'bk_e1c8f1aa-d98a-4f69-a354-f41a62102775','tsk_c04a2788-b347-432a-b60c-a6dc7c54ba24','2026-03-25','10:00:00','11:00:00','線上會議室','pending',NULL,'scheduled',NULL),('int_fcbc8ac3-5b43-4a0d-a50f-d5fbdf64f792','8478fa6b-7aa6-4d70-a2ce-59b14b5be04a','u_e06a776e','u_ca5b3057',2,1,'bk_847e10f7-70e0-4602-bd2a-68bb1024e59a','tsk_7104a327-e183-41be-b5ec-6a7cd806b218','2026-03-30','10:00:00','11:00:00','線上會議室','pending',NULL,'scheduled',NULL);
/*!40000 ALTER TABLE `interviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_categories`
--

DROP TABLE IF EXISTS `job_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_categories`
--

LOCK TABLES `job_categories` WRITE;
/*!40000 ALTER TABLE `job_categories` DISABLE KEYS */;
INSERT INTO `job_categories` VALUES (1,'軟體開發類','2026-03-07 14:53:28','2026-03-07 14:53:28'),(2,'產品管理類','2026-03-07 14:53:28','2026-03-07 14:53:28'),(3,'設計與創意類','2026-03-07 14:53:28','2026-03-07 14:53:28'),(4,'維運與資安類','2026-03-07 14:53:28','2026-03-07 14:53:28'),(5,'資料科學與 AI 類','2026-03-07 14:53:28','2026-03-07 14:53:28'),(6,'行銷推廣類','2026-03-07 14:53:28','2026-03-07 14:53:28'),(7,'業務與商務開發類','2026-03-07 14:53:28','2026-03-07 14:53:28'),(8,'客戶服務與成功類','2026-03-07 14:53:28','2026-03-07 14:53:28'),(9,'行政與人力資源類','2026-03-07 14:53:28','2026-03-07 14:53:28'),(10,'財務與法務類','2026-03-07 14:53:28','2026-03-07 14:53:28');
/*!40000 ALTER TABLE `job_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `job_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_job_category` (`category_id`),
  CONSTRAINT `fk_job_category` FOREIGN KEY (`category_id`) REFERENCES `job_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,1,'前端工程師',NULL,'2026-03-07 14:55:09'),(2,1,'後端工程師',NULL,'2026-03-07 14:55:09'),(3,2,'產品經理 (PM)',NULL,'2026-03-07 14:55:09'),(4,2,'專案經理 (PMP)',NULL,'2026-03-07 14:55:09'),(5,3,'UI/UX 設計師',NULL,'2026-03-07 14:55:09'),(6,3,'視覺設計師',NULL,'2026-03-07 14:55:09'),(7,4,'維運工程師 (SRE)',NULL,'2026-03-07 14:55:09'),(8,4,'資安工程師',NULL,'2026-03-07 14:55:09'),(9,5,'資料科學家',NULL,'2026-03-07 14:55:09'),(10,5,'機器學習工程師',NULL,'2026-03-07 14:55:09'),(11,6,'數位行銷專員',NULL,'2026-03-07 14:55:09'),(12,6,'社群小編',NULL,'2026-03-07 14:55:09'),(13,7,'業務開發 (BD)',NULL,'2026-03-07 14:55:09'),(14,7,'帳戶經理 (AM)',NULL,'2026-03-07 14:55:09'),(15,8,'客戶成功經理 (CSM)',NULL,'2026-03-07 14:55:09'),(16,8,'客服支援專員',NULL,'2026-03-07 14:55:09'),(17,9,'人資專員 (HR)',NULL,'2026-03-07 14:55:09'),(18,9,'行政總務',NULL,'2026-03-07 14:55:09'),(19,10,'財務會計',NULL,'2026-03-07 14:55:09'),(20,10,'法務專員',NULL,'2026-03-07 14:55:09'),(22,1,'測試職位1','測試','2026-03-23 13:28:34');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sources`
--

DROP TABLE IF EXISTS `sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('Internal','External','Campus') COLLATE utf8mb4_general_ci DEFAULT 'External',
  `createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sources`
--

LOCK TABLES `sources` WRITE;
/*!40000 ALTER TABLE `sources` DISABLE KEYS */;
INSERT INTO `sources` VALUES (1,'104 人力銀行','External','2026-03-07 14:53:25','2026-03-07 14:53:25'),(2,'CakeResume','External','2026-03-07 14:53:25','2026-03-07 14:53:25'),(3,'Yourator 數位人才媒合','External','2026-03-07 14:53:25','2026-03-07 14:53:25'),(4,'LinkedIn','External','2026-03-07 14:53:25','2026-03-07 14:53:25'),(5,'1111 人力銀行','External','2026-03-07 14:53:25','2026-03-07 14:53:25'),(6,'Meet.jobs','External','2026-03-07 14:53:25','2026-03-07 14:53:25'),(7,'員工內部推薦','Internal','2026-03-07 14:53:25','2026-03-07 14:53:25'),(8,'公司官網/主動投遞','Internal','2026-03-07 14:53:25','2026-03-07 14:53:25'),(9,'獵頭顧問 (Headhunter)','External','2026-03-07 14:53:25','2026-03-07 14:53:25'),(10,'校園徵才/實習轉正','Campus','2026-03-07 14:53:25','2026-03-20 15:05:15'),(14,'測試1-校招','Campus','2026-03-20 15:03:51','2026-03-20 15:03:51');
/*!40000 ALTER TABLE `sources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('todo','done') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'todo',
  `priority` enum('high','medium','low') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'medium',
  `description` text COLLATE utf8mb4_general_ci,
  `dueDate` datetime DEFAULT NULL,
  `createAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updateAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES ('tsk_00514445-3df6-4eb7-9c69-289c4487de0c','u_007','面試評價: 面試：金城武 - 第 1 輪','todo','high','請針對應徵者進行第 1 輪面試評價','2026-03-18 18:00:00','2026-03-17 02:40:16','2026-03-17 02:40:16'),('tsk_33ebe556-c35e-4deb-9c95-146cf65d522e','u_e06a776e','面試評價: 面試：testCandidate5 - 第 1 輪','done','high','請針對應徵者進行第 1 輪面試評價','2026-04-03 18:00:00','2026-03-25 11:15:32','2026-03-26 01:42:17'),('tsk_59ef2546-573c-4054-992a-a1645febf59c','u_e06a776e','面試評價: 面試：testCandidate3 - 第 1 輪','todo','high','請針對應徵者進行第 1 輪面試評價','2026-04-01 18:00:00','2026-03-25 11:03:49','2026-03-25 11:03:49'),('tsk_63673d84-3ccd-4de1-94bd-7ea97629f7e9','u_315904ab','面試評價: 初試 - 前端工程師 (應徵者: 彭于晏)','done','high','請針對應徵者進行第 1 輪面試評價','2026-03-21 18:00:00','2026-03-13 09:44:05','2026-03-22 15:08:10'),('tsk_7104a327-e183-41be-b5ec-6a7cd806b218','u_e06a776e','面試評價: 面試：testCandidate4 - 第 1 輪','todo','high','請針對應徵者進行第 1 輪面試評價','2026-03-31 18:00:00','2026-03-25 11:04:03','2026-03-25 11:04:03'),('tsk_71dee943-6041-41d4-bf61-ade60ac0a87f','u_315904ab','面試評價: 複試 - 彭于晏 (二輪)','done','high','請針對應徵者進行第 2 輪面試評價','2026-03-26 18:00:00','2026-03-13 09:44:27','2026-03-22 14:55:54'),('tsk_7d1ee7d1-3fcf-4141-b24d-54e608a2e39d','u_e06a776e','面試評價: 面試：testCandidate7 - 第 1 輪','todo','high','請針對應徵者進行第 1 輪面試評價','2026-03-26 18:00:00','2026-03-25 10:17:02','2026-03-26 06:05:54'),('tsk_c04a2788-b347-432a-b60c-a6dc7c54ba24','u_e06a776e','面試評價: 面試：testCandidate1 - 第 1 輪','todo','high','請針對應徵者進行第 1 輪面試評價','2026-03-26 18:00:00','2026-03-25 10:56:29','2026-03-25 10:56:29'),('tsk_ca32397d-06eb-4b94-a41f-17a3f0055e73','u_315904ab','面試評價: 最終面試 - 彭于晏 (三輪)','todo','high','請針對應徵者進行第 3 輪面試評價','2026-03-31 18:00:00','2026-03-13 09:44:21','2026-03-18 03:38:25'),('tsk_cb352f85-1a23-4af9-b066-6b28ac39cc0b','u_007','面試評價: 面試：testCandidate8 - 第 1 輪','todo','high','請針對應徵者進行第 1 輪面試評價','2026-03-31 18:00:00','2026-03-25 10:01:32','2026-03-25 10:01:32'),('tsk_f12d0a7f-bf21-4410-9616-de0f6451aab4','u_e06a776e','面試評價: 面試：testCandidate2 - 第 1 輪','done','high','請針對應徵者進行第 1 輪面試評價','2026-03-26 18:00:00','2026-03-25 10:57:43','2026-03-26 01:42:01');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `real_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('super_admin','dept_hr','interviewer') COLLATE utf8mb4_general_ci NOT NULL,
  `dept_id` int DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('active','disabled') COLLATE utf8mb4_general_ci DEFAULT 'active',
  `last_login` datetime DEFAULT NULL,
  `createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `fk_user_dept` (`dept_id`),
  KEY `fk_user_creator` (`created_by`),
  CONSTRAINT `fk_user_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_user_dept` FOREIGN KEY (`dept_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('u_000','admin','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','超級管理員','super_admin',NULL,'u_000','active','2026-03-08 16:31:03','2026-03-07 14:53:30','2026-03-08 08:31:03'),('u_001','hr_zhang','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','張小曼','dept_hr',3,'u_000','active',NULL,'2026-03-07 14:53:32','2026-03-07 14:53:32'),('u_002','hr_lee','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','李明哲','dept_hr',1,'u_000','active','2026-03-08 15:42:40','2026-03-07 14:53:32','2026-03-08 07:42:40'),('u_003','hr_wang','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','王美玲','dept_hr',2,'u_000','active',NULL,'2026-03-07 14:53:32','2026-03-07 14:53:32'),('u_004','hr_chen','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','陳雅婷','dept_hr',4,'u_000','active',NULL,'2026-03-07 14:53:32','2026-03-07 14:53:32'),('u_005','hr_lin','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','林志強','dept_hr',3,'u_000','active',NULL,'2026-03-07 14:53:32','2026-03-07 14:53:32'),('u_006','tech_king','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','金大為','interviewer',1,'u_000','active',NULL,'2026-03-07 14:53:33','2026-03-07 14:53:33'),('u_007','tech_liu','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','劉德華','interviewer',1,'u_000','active',NULL,'2026-03-07 14:53:33','2026-03-07 14:53:33'),('u_008','pm_wu','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','吳珊珊','interviewer',2,'u_000','active',NULL,'2026-03-07 14:53:33','2026-03-07 14:53:33'),('u_009','mk_huang','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','黃金發','dept_hr',4,'u_000','active',NULL,'2026-03-07 14:53:33','2026-03-08 10:35:12'),('u_010','tech_zhao','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','趙雲','interviewer',1,'u_000','active',NULL,'2026-03-07 14:53:33','2026-03-07 14:53:33'),('u_058fdb58','hr_test_01','$2b$10$e2N9/jvLUOX8fyRnpZX.n.wnLffXRiu4raUd00LVS5uXpQLzPAPo.','測試HR-已修改','interviewer',8,'u_000','disabled',NULL,'2026-03-07 17:08:39','2026-03-08 09:47:47'),('u_315904ab','rose','$2b$10$Yyn5JVhAxderXK0FRI7TdujFQQuJINZhFDOpB8kKYcL/kWDMAUDLq','肉絲','interviewer',5,'u_000','active',NULL,'2026-03-09 04:31:56','2026-03-09 04:31:56'),('u_5fb53bc4','管理員測試1','$2b$10$WMq48UXS39zuDt1isStYqeh/YwA2PuoAVbhJgGt7BWWyz093jRAhO','測試1','super_admin',4,'u_000','disabled',NULL,'2026-03-25 08:03:58','2026-03-25 08:05:24'),('u_bb6178bc','emma','$2b$10$A/DhnB1LBB3fbHGXuaywCuIt5OYcSyx9v8cnRnXTzi/SBw7W86mK.','麥靖雯','dept_hr',4,'u_000','active',NULL,'2026-03-08 08:47:17','2026-03-08 08:47:17'),('u_ca5b3057','hrTest1','$2b$10$485fQmnKJOmRaVON5SELrO9X8l6s/sWRth6jL48Lmtaa6YovQfE1m','hr-Test1','dept_hr',4,'u_000','active',NULL,'2026-03-25 08:06:13','2026-03-25 08:07:26'),('u_e06a776e','interviewerTest1','$2b$10$AWb8UsvHNJAiVPLKmVIk6OzVot5Tds.s8hV1k5OekzHrrvAAwr/MK','interviewer-Test1','interviewer',3,'u_000','active',NULL,'2026-03-25 08:06:41','2026-03-25 08:07:16'),('u_f9d51789','adminTest1','$2b$10$g9gSsU25oUsV8VFuE1jGLeSjunjx0xPtUmb52s56OGwjmFGdCD4hm','admin-Test1','super_admin',4,'u_000','active',NULL,'2026-03-25 08:05:46','2026-03-25 08:07:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-26  8:09:25
