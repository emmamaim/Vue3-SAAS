import db from "../config/db.js";

// 組裝應徵者資料，包含基本資訊和面試歷史
export const getFullCandidateInfo = async (id) => {
  // 1.獲取應徵者基本資料
  const [basicInfo] = await db.execute(
    "SELECT * FROM candidates WHERE id = ?",
    [id],
  );
  if (basicInfo.length === 0) return null;
  // 2.獲取此人的面試記錄
  const [interviews] = await db.execute(
    "SELECT * FROM interviews WHERE candidate_id = ? ORDER BY interview_round DESC",
    [id],
  );
  // 3.根據面試官ID獲取面試官姓名
  const interviewersIds = [...new Set(interviews.map((i) => i.interviewer_id))];
  if (interviewersIds.length > 0) {
    const [users] = await db.query(
      "SELECT id, real_name FROM users WHERE id IN (?)",
      [interviewersIds],
    );
  }
  // 4.陣列轉成物件方便搜尋
  const userMap = Object.fromEntries(users.map((u) => [u.id, u.real_name]));
  // 5.組裝回到面試記錄
  interviews.forEach((i) => {
    i.interviewer_name = userMap[i.interviewer_id] || "未知面試官";
  });
  // 6.組裝資料
  const result = {
    ...basicInfo[0],
    interviews: interviews,
  };
  return result;
};

// 新增應徵者
export const createCandidate = async (candidateData) => {
  const { id, name, email, phone, position, resume_url, source, hr_id, dept } =
    candidateData;
  // 1.檢查是否重複投遞（郵箱）
  const [existing] = await db.execute(
    "SELECT id FROM candidates WHERE email = ? LIMIT 1",
    [email],
  );
  // 2.重複投遞標記
  const isRepeated = existing.length > 0;
  const sql =
    "INSERT INTO candidates (id, name, email, phone, position, resume_url, source, hr_id, status, dept) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'screening')";
    await db.execute(sql, [id, name, email, phone, position, 
    resume_url, source, hr_id, dept]);
    return {id, isRepeated};
};

