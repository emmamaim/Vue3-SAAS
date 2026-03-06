import * as CandidateModel from "../models/candidateModel.js";
// uuid生成唯一ID
import { v4 as uuidv4 } from "uuid";
// 獲取應徵者完整資訊
export const getCandidateInfo = async (req, res) => {
  try {
    const { id } = req.params;
    // 調用model封裝的邏輯
    const data = await CandidateModel.getFullCandidateInfo(id);
    if (data) {
      res.json({ success: true, data });
    } else {
      res.status(404).json({ success: false, message: "找不到該位應徵者" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "系統錯誤" });
  }
};

// 新增應徵者
export const addCandidate = async (req, res) => {
  try {
    const resumePath = req.file
      ? `/uploads/resumes/${req.file.filename}`
      : null;
    // 生成唯一ID
    const candidateId = uuidv4();
    const newCandidate = {
      id: candidateId,
      name: req.body.name || null,
      email: req.body.email || null,
      phone: req.body.phone || null,
      position: req.body.position || null,
      dept: req.body.dept || null,
      source: req.body.source || 'Direct',
      resume_url: resumePath,
      hr_id: req.user.id,
    };
    console.log("=== 準備寫入資料庫的數據 ===");
    console.log(newCandidate);
    // 調用model
    const result = await CandidateModel.createCandidate(newCandidate);
    let message = "應徵者資料已成功錄入系統";
    if (result.isRepeated) {
      message = "資料已錄入，系統偵測到該應徵者先前曾有投遞紀錄";
    }
    res.status(201).json({
      success: true,
      message: message,
      data: { id: candidateId },
    });
  } catch (error) {
    console.error("[Error][addCandidate]", error);
    res.status(500).json({
      success: false,
      message: "資料庫寫入失敗",
      sqlMessage: error.sqlMessage, // 這是資料庫給的具體原因
      detail: error.message,
    });
  }
};
