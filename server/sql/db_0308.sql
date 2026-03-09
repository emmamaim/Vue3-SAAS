-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: vue3_saas_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `candidates` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `job_id` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `resume_url` varchar(255) DEFAULT NULL,
  `dept_id` int(11) NOT NULL,
  `source_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `status` enum('pending','screening','interviewing','offer','hired','rejected') DEFAULT 'pending',
  `hr_id` varchar(50) DEFAULT NULL,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_candidate_dept` (`dept_id`),
  KEY `fk_candidate_source` (`source_id`),
  KEY `fk_candidate_category` (`category_id`),
  KEY `fk_candidate_hr` (`hr_id`),
  KEY `fk_candidate_job` (`job_id`),
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
INSERT INTO `candidates` VALUES ('can_uuid_001','陳志明',1,'cm.chen@example.com','0912-345-678','/uploads/resumes/resume_01.pdf',1,1,1,'screening','u_001','2026-03-08 07:47:14'),('can_uuid_002','林美玲',2,'meiling.lin@example.com','0922-111-222','/uploads/resumes/resume_02.pdf',1,2,1,'interviewing','u_001','2026-03-08 07:47:14'),('can_uuid_003','張大為',3,'david.chang@example.com','0933-444-555',NULL,2,3,2,'pending','u_001','2026-03-08 07:47:14'),('can_uuid_004','李小惠',4,'kevin.lee@example.com','0955-666-777','/uploads/resumes/resume_04.pdf',2,1,2,'rejected','u_002','2026-03-08 07:47:14'),('can_uuid_005','王國華',5,'kh.wang@example.com','0966-888-999','/uploads/resumes/resume_05.pdf',3,4,3,'offer','u_002','2026-03-08 07:47:14'),('can_uuid_006','趙敏',1,'min.chao@example.com','0977-000-111',NULL,1,2,1,'hired','u_001','2026-03-08 07:47:14'),('can_uuid_007','孫悟空',6,'monkey.king@example.com','0988-222-333','/uploads/resumes/resume_07.pdf',4,1,4,'screening','u_002','2026-03-08 07:47:14'),('can_uuid_008','周小智',2,'jay.chou@example.com','0911-333-444','/uploads/resumes/resume_08.pdf',1,3,1,'interviewing','u_001','2026-03-08 07:47:14'),('can_uuid_009','蔡美林',7,'jolin.tsai@example.com','0919-555-666','/uploads/resumes/resume_09.pdf',5,2,5,'pending','u_002','2026-03-08 07:47:14'),('can_uuid_010','郭小明',8,'terry.guo@example.com','0920-777-888','/uploads/resumes/resume_10.pdf',6,4,6,'screening','u_001','2026-03-08 07:47:14'),('f9e44dcf-e1a1-4583-88af-9309cd65b472','林小龍',1,'long@example.com','0912345678','/uploads/resumes/resume-1772956383880-544630258.pdf',1,2,1,'screening','u_002','2026-03-08 07:53:03');
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `manager_id` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `fk_dept_manager` (`manager_id`),
  CONSTRAINT `fk_dept_manager` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `interviews` (
  `id` varchar(50) NOT NULL,
  `candidate_id` varchar(50) NOT NULL,
  `interviewer_id` varchar(50) NOT NULL,
  `hr_id` varchar(50) NOT NULL,
  `interview_round` tinyint(4) DEFAULT 1,
  `date` date NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `location` varchar(255) DEFAULT 'Remote / Online',
  `rating` tinyint(4) DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `status` enum('scheduled','completed','cancelled') DEFAULT 'scheduled',
  `updatedAt` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_int_candidate` (`candidate_id`),
  KEY `fk_int_interviewer` (`interviewer_id`),
  KEY `fk_int_hr` (`hr_id`),
  CONSTRAINT `fk_int_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_int_hr` FOREIGN KEY (`hr_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_int_interviewer` FOREIGN KEY (`interviewer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interviews`
--

LOCK TABLES `interviews` WRITE;
/*!40000 ALTER TABLE `interviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `interviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_categories`
--

DROP TABLE IF EXISTS `job_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `job_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_job_category` (`category_id`),
  CONSTRAINT `fk_job_category` FOREIGN KEY (`category_id`) REFERENCES `job_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,1,'前端工程師',NULL,'2026-03-07 14:55:09'),(2,1,'後端工程師',NULL,'2026-03-07 14:55:09'),(3,2,'產品經理 (PM)',NULL,'2026-03-07 14:55:09'),(4,2,'專案經理 (PMP)',NULL,'2026-03-07 14:55:09'),(5,3,'UI/UX 設計師',NULL,'2026-03-07 14:55:09'),(6,3,'視覺設計師',NULL,'2026-03-07 14:55:09'),(7,4,'維運工程師 (SRE)',NULL,'2026-03-07 14:55:09'),(8,4,'資安工程師',NULL,'2026-03-07 14:55:09'),(9,5,'資料科學家',NULL,'2026-03-07 14:55:09'),(10,5,'機器學習工程師',NULL,'2026-03-07 14:55:09'),(11,6,'數位行銷專員',NULL,'2026-03-07 14:55:09'),(12,6,'社群小編',NULL,'2026-03-07 14:55:09'),(13,7,'業務開發 (BD)',NULL,'2026-03-07 14:55:09'),(14,7,'帳戶經理 (AM)',NULL,'2026-03-07 14:55:09'),(15,8,'客戶成功經理 (CSM)',NULL,'2026-03-07 14:55:09'),(16,8,'客服支援專員',NULL,'2026-03-07 14:55:09'),(17,9,'人資專員 (HR)',NULL,'2026-03-07 14:55:09'),(18,9,'行政總務',NULL,'2026-03-07 14:55:09'),(19,10,'財務會計',NULL,'2026-03-07 14:55:09'),(20,10,'法務專員',NULL,'2026-03-07 14:55:09');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sources`
--

DROP TABLE IF EXISTS `sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `type` enum('Internal','External') DEFAULT 'External',
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sources`
--

LOCK TABLES `sources` WRITE;
/*!40000 ALTER TABLE `sources` DISABLE KEYS */;
INSERT INTO `sources` VALUES (1,'104 人力銀行','External','2026-03-07 14:53:25','2026-03-07 14:53:25'),(2,'CakeResume','External','2026-03-07 14:53:25','2026-03-07 14:53:25'),(3,'Yourator 數位人才媒合','External','2026-03-07 14:53:25','2026-03-07 14:53:25'),(4,'LinkedIn','External','2026-03-07 14:53:25','2026-03-07 14:53:25'),(5,'1111 人力銀行','External','2026-03-07 14:53:25','2026-03-07 14:53:25'),(6,'Meet.jobs','External','2026-03-07 14:53:25','2026-03-07 14:53:25'),(7,'員工內部推薦','Internal','2026-03-07 14:53:25','2026-03-07 14:53:25'),(8,'公司官網/主動投遞','Internal','2026-03-07 14:53:25','2026-03-07 14:53:25'),(9,'獵頭顧問 (Headhunter)','External','2026-03-07 14:53:25','2026-03-07 14:53:25'),(10,'校園徵才/實習轉正','Internal','2026-03-07 14:53:25','2026-03-07 14:53:25');
/*!40000 ALTER TABLE `sources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `real_name` varchar(50) NOT NULL,
  `role` enum('super_admin','dept_hr','interviewer') NOT NULL,
  `dept_id` int(11) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `status` enum('active','disabled') DEFAULT 'active',
  `last_login` datetime DEFAULT NULL,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
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
INSERT INTO `users` VALUES ('u_000','admin','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','超級管理員','super_admin',NULL,'u_000','active','2026-03-08 16:31:03','2026-03-07 14:53:30','2026-03-08 08:31:03'),('u_001','hr_zhang','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','張小曼','dept_hr',3,'u_000','active',NULL,'2026-03-07 14:53:32','2026-03-07 14:53:32'),('u_002','hr_lee','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','李明哲','dept_hr',1,'u_000','active','2026-03-08 15:42:40','2026-03-07 14:53:32','2026-03-08 07:42:40'),('u_003','hr_wang','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','王美玲','dept_hr',2,'u_000','active',NULL,'2026-03-07 14:53:32','2026-03-07 14:53:32'),('u_004','hr_chen','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','陳雅婷','dept_hr',4,'u_000','active',NULL,'2026-03-07 14:53:32','2026-03-07 14:53:32'),('u_005','hr_lin','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','林志強','dept_hr',3,'u_000','active',NULL,'2026-03-07 14:53:32','2026-03-07 14:53:32'),('u_006','tech_king','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','金大為','interviewer',1,'u_000','active',NULL,'2026-03-07 14:53:33','2026-03-07 14:53:33'),('u_007','tech_liu','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','劉德華','interviewer',1,'u_000','active',NULL,'2026-03-07 14:53:33','2026-03-07 14:53:33'),('u_008','pm_wu','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','吳珊珊','interviewer',2,'u_000','active',NULL,'2026-03-07 14:53:33','2026-03-07 14:53:33'),('u_009','mk_huang','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','黃金發','dept_hr',4,'u_000','active',NULL,'2026-03-07 14:53:33','2026-03-08 10:35:12'),('u_010','tech_zhao','$2b$10$r3fwB3SWaPWoBqzu55XLROJ9UdJiRTm/yXS7w6lB1q8uLnViVVJ1C','趙雲','interviewer',1,'u_000','active',NULL,'2026-03-07 14:53:33','2026-03-07 14:53:33'),('u_058fdb58','hr_test_01','$2b$10$e2N9/jvLUOX8fyRnpZX.n.wnLffXRiu4raUd00LVS5uXpQLzPAPo.','測試HR-已修改','interviewer',8,'u_000','disabled',NULL,'2026-03-07 17:08:39','2026-03-08 09:47:47'),('u_bb6178bc','emma','$2b$10$A/DhnB1LBB3fbHGXuaywCuIt5OYcSyx9v8cnRnXTzi/SBw7W86mK.','麥靖雯','dept_hr',4,'u_000','active',NULL,'2026-03-08 08:47:17','2026-03-08 08:47:17');
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

-- Dump completed on 2026-03-08 19:43:11
