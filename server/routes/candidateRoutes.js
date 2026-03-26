import express from 'express';
const router = express.Router();
import * as candidateController from '../controllers/candidateController.js';
// JWT 驗證中介軟體（確保只有登入者能查）
import { auth, isStaff } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

// 設定Multer儲存機制
const storage = multer.diskStorage({
  // 伺服器上的資料夾位置
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  // 文件名字：欄位名-時間戳記隨機數.副檔名
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // path.extname原始檔案的副檔名 (.pdf, .docx等)
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage: storage,
  // 限制檔案大小
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('檔案格式錯誤，僅支援 PDF 與 Word'), false);
    }
  }
});

router.get('/', auth, isStaff, candidateController.getCandidates);
router.get('/:id', auth, isStaff, candidateController.getCandidateInfo);
router.post(
  '/',
  auth,
  isStaff,
  upload.single('resume'),
  candidateController.addCandidate
);
router.put(
  '/:id',
  auth,
  isStaff,
  upload.single('resume'),
  candidateController.updateCandidate
);
router.delete('/:id', auth, isStaff, candidateController.archiveCandidate);

export default router;
