import SystemModel from '../models/systemModel.js';

// 系統初始化數據
export const getSystemInitData = async (req, res) => {
  try {
    const options = await SystemModel.getSystemOptions();
    // 返回大物件 => Pinia
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: '獲取系統配置失敗' });
  }
};

// 管理員後台列表數據
export const getAdminSettings = async (req, res) => {
  const { type } = req.params;
  try {
    let data;
    switch (type) {
      case 'departments':
        data = await SystemModel.getDepartments();
        break;
      case 'sources':
        data = await SystemModel.getSources();
        break;
      case 'categories':
        data = await SystemModel.getCategories();
        break;
      case 'jobs':
        data = await SystemModel.getJobs();
        break;
      default:
        return res.status(400).json({ message: '無效的配置類型' });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: '獲取配置列表失敗' });
  }
};

// 新增/修改配置
export const saveSetting = async (req, res) => {
  const { type } = req.params;
  const { id, ...payload } = req.body;
  // 根據ID判斷是新增或是更新
  const isUpdate = id && id !== 'new';
  try {
    if (type === 'departments') {
      isUpdate
        ? await SystemModel.updateDepartment(id, payload)
        : await SystemModel.addDepartment(payload);
    } else if (type === 'sources') {
      isUpdate
        ? await SystemModel.updateSource(id, payload.name, payload.type)
        : await SystemModel.addSource(payload.name, payload.type);
    } else if (type === 'categories') {
      isUpdate
        ? await SystemModel.updateCategory(id, payload.name)
        : await SystemModel.addCategory(payload.name);
    } else if (type === 'jobs') {
      isUpdate
        ? await SystemModel.updateJob(id, payload)
        : await SystemModel.addJob(payload);
    } else {
      return res.status(400).json({ message: '不支援的類型' });
    }
    res.json({ success: true, message: '儲存成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '儲存失敗' });
  }
};

// 刪除配置
export const deleteSetting = async (req, res) => {
  const { type, id } = req.params;
  try {
    // 轉換table名稱
    const tableNameMap = {
      departments: 'departments',
      sources: 'sources',
      categories: 'job_categories',
      jobs: 'jobs'
    };
    const tableName = tableNameMap[type];
    // 執行檢查
    const warning = await SystemModel.checkUsage(tableName, id);
    if (warning) {
      return res.status(409).json({ message: warning });
    }
    // 執行刪除
    await SystemModel.deleteRecord(tableName, id);
    res.json({ success: true, message: '刪除成功' });
  } catch (error) {
    res.status(500).json({ message: '刪除操作失敗' });
  }
};
