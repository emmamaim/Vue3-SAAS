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
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookings` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `startTime` char(5) NOT NULL,
  `endTime` char(5) NOT NULL,
  `status` enum('pending','confirmed','canceled') NOT NULL DEFAULT 'confirmed',
  `relatedTaskId` varchar(50) DEFAULT NULL,
  `createAt` datetime DEFAULT current_timestamp(),
  `updateAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_related_task` (`relatedTaskId`),
  CONSTRAINT `fk_related_task` FOREIGN KEY (`relatedTaskId`) REFERENCES `tasks` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES ('b_1','測試1','2026-03-03','10:00','11:00','confirmed',NULL,'2026-03-03 15:25:21','2026-03-03 15:25:21'),('b_1772523381016','測試5','2026-03-06','12:00','13:00','confirmed',NULL,'2026-03-03 15:36:21','2026-03-03 15:36:27'),('b_2','測試2','2026-03-04','10:00','11:00','confirmed',NULL,'2026-03-03 15:25:21','2026-03-03 15:25:21'),('b_3','測試3','2026-03-05','10:00','11:00','confirmed',NULL,'2026-03-03 15:25:21','2026-03-03 15:25:21'),('b_4','測試4','2026-03-06','10:00','11:00','confirmed',NULL,'2026-03-03 15:25:21','2026-03-03 15:25:21');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `candidates` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `position` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `resume_url` varchar(255) DEFAULT NULL,
  `dept` varchar(50) NOT NULL,
  `source` varchar(50) DEFAULT 'Direct',
  `status` enum('pending','screening','interviewing','offer','hired','rejected') DEFAULT 'pending',
  `hr_id` varchar(50) DEFAULT NULL,
  `createAt` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_candidate_hr` (`hr_id`),
  CONSTRAINT `fk_candidate_hr` FOREIGN KEY (`hr_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES ('ad073d84-24d3-4f67-8ffd-e7c10d6d5dec','小明','前端工程師','ming@example.com',NULL,'/uploads/resumes/resume-1772784681333-826617996.txt','screening','104人力銀行','','u_a5187743','2026-03-06 16:11:21'),('can_2026_001','林曉明','Frontend Engineer','ming@example.com','0912-345-678','/uploads/resumes/lin_ming_cv.pdf','Tech','LinkedIn','interviewing','u_hr_001','2026-03-06 09:04:41'),('can_2026_002','陳大為','Product Manager','david.chen@example.com','0987-654-321','/uploads/resumes/david_pm_cv.pdf','Product','104','pending','u_hr_001','2026-03-06 09:04:47');
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
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
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `status` enum('todo','doing','done') NOT NULL DEFAULT 'todo',
  `priority` enum('high','medium','low') NOT NULL DEFAULT 'medium',
  `description` text DEFAULT NULL,
  `dueDate` datetime DEFAULT NULL,
  `createAt` datetime DEFAULT current_timestamp(),
  `updateAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES ('t_1','早餐','todo','medium','breakfast','2026-03-05 08:00:00','2026-03-03 11:12:54','2026-03-03 15:37:31'),('t_2','工作會議','doing','high','meeting','2026-03-08 10:00:00','2026-03-03 11:12:54','2026-03-03 15:37:32'),('t_3','看書','done','low','reading','2026-03-04 15:00:00','2026-03-03 11:12:54','2026-03-03 11:12:54');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
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
  `dept` varchar(50) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `status` enum('active','disabled') DEFAULT 'active',
  `last_login` datetime DEFAULT NULL,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `fk_user_creator` (`created_by`),
  CONSTRAINT `fk_user_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('u_a5187743','emma','$2b$10$rlsKTYmCshU5HSVWYqT.y.s0ATRwHVVNqQgJM1VlXcQ458GlxeQLC','艾瑪','dept_hr','HR','u_admin_001','active','2026-03-06 15:48:57','2026-03-05 08:07:12','2026-03-06 07:48:57'),('u_admin_001','admin','$2b$10$8WE/v2cYV1rXidQFCKpzuOMnkXosz3sdv5l8irnTaGqdf.oTEDo8K','系統管理員','super_admin','Management',NULL,'active','2026-03-06 15:31:46','2026-03-05 08:03:22','2026-03-06 07:31:46'),('u_hr_001','amy_hr','$2b$10$f51/KA0akJQzUUzjjn12T.cpbJl/jWxA8mx8kFkh716.bEG3jo6y.','艾米','dept_hr','HR','u_admin_001','active','2026-03-04 11:07:20','2026-03-04 03:07:13','2026-03-05 08:16:57'),('u_int_001','kevin_new','$2b$10$aIBtBo4d7ivYAErIKvoAYubXT715Pg4Dj4/30v3e7/3jnBn2HQxju','凱文','interviewer','Operations',NULL,'active','2026-03-04 11:06:02','2026-03-04 03:05:59','2026-03-06 02:07:55'),('u_mgr_001','mgr_carol','$2b$10$gUrURVGvyaX67D.crcKaVeLLGk8KIjqFnJNH.L2IpiswZyctHhHTa','Carol','interviewer','Tech',NULL,'active',NULL,'2026-03-06 01:08:28','2026-03-06 01:09:18'),('u_tech_001','tech_bob','$2b$10$XVCtUwHN.6rUTepr0.7O4OeOI7NjqNj1k1WgHrpCMdD3QFjbXMTn2','Bob','interviewer','Tech',NULL,'active',NULL,'2026-03-06 01:08:28','2026-03-06 01:09:03');
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

-- Dump completed on 2026-03-06 16:18:19
