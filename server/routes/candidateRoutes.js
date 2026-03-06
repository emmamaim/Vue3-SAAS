import express from "express";
const router = express.Router();
import * as candidateController from "../controllers/candidateController.js";
// JWT 驗證中介軟體（確保只有登入者能查）
import { authenticateToken, isAdmin } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

// 設定Multer儲存機制
const storage = multer.diskStorage({
  // 伺服器上的資料夾位置
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes/");
  },
  // 文件名字：欄位名-時間戳記隨機數.副檔名
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // path.extname原始檔案的副檔名 (.pdf, .docx等)
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage });

router.get("/:id", authenticateToken, candidateController.getCandidateInfo);
router.post(
  "/",
  authenticateToken,
  upload.single("resume"),
  candidateController.addCandidate,
);

export default router;
