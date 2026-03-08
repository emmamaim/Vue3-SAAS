import DeptModel from '../models/deptModel.js';

// 獲取部門列表
export const getDepartments = async (req, res) => {
  try {
    const depts = await DeptModel.findAll();
    res.json({ data: depts });
  } catch (error) {
    res.status(500).json({ message: '獲取部門失敗' });
  }
};

// 部門選項列表
export const getDeptOptions = async (req, res) => {
  try {
    const options = await DeptModel.getOptions();
    res.json({ data: options });
  } catch (error) {
    res.status(500).json({ message: '獲取選項失敗' });
  }
};

// 新建部門
export const createDepartment = async (req, res) => {
  try {
    await DeptModel.create(req.body);
    res.status(201).json({ message: '部門建立成功' });
  } catch (error) {
    res.status(500).json({ message: '建立失敗，名稱可能重複' });
  }
};

// 更新部門
export const updateDepartment = async (req, res) => {
  try {
    await DeptModel.update(req.params.id, req.body);
    res.json({ message: '部門更新成功' });
  } catch (error) {
    res.status(500).json({ message: '更新失敗' });
  }
};

// 删除部门
export const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    await DeptModel.delete(id);
    res.json({ message: '部門刪除成功' });
  } catch (error) {
    // 處理外鍵約束報錯
    if (error.errno === 1451) {
      return res.status(400).json({
        message:
          '無法刪除此部門：該部門下尚有隸屬的用戶或應徵者，請先遷移相關人員資料。'
      });
    }
    res.status(500).json({ message: '刪除失敗' });
  }
};
