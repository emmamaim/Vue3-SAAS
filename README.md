# TalentFlow - 專業人才管理系統 (SaaS)

> **Author: [Emma Mai](https://github.com/emmamai)** > **基於 Vue 3 (Vite) 構建的高效能人才管理解決方案。專注於業務邏輯的深度實作與標準化生產環境部署。**

---

## 🌐 線上展示 (Demo)
* **傳送門**：[https://talentflow-saas.com](https://talentflow-saas.com)
* **測試帳號**（建議分別登入體驗權限差異）：
  * **管理員**：`adminTest1` / `123456`
  * **HR 專員**：`hrTest1` / `123456`
  * **面試官**：`interviewerTest1` / `123456`


## 🏗️ 核心技術架構：Vue 3 深度實踐

作為前端開發者，本專案核心目標是透過 Vue 3 生態系構建一個具備高度交互性與業務邏輯的後台管理系統。

### 1. 視覺工程與體驗優化
* **Tailwind CSS** v4 落地：從傳統 CSS 轉向原子化架構，大幅提升開發效率。

* **Motion One** 動畫整合：實作 60FPS 的流暢進場與滾動感應動畫，確保高質感的 SaaS 體驗。

### 2. 全域狀態與安全權限控制
* **身分驗證安全性 (Auth Security)**：實作完整的登入流，採用後端簽發的 HttpOnly Cookie 儲存 JWT，從前端物理層面杜絕 XSS 攻擊竊取 Token 的風險。
* **Pinia 狀態同步**：登入後將用戶基本資訊（角色、姓名）持久化存儲於 Pinia，並搭配 Axios withCredentials 設定，確保 API 請求能自動攜帶身分憑證。
* **動態路由守衛 (Vue Router)**：利用 `beforeEach` 鉤子實作頁面層級權限攔截，從路由層面杜絕未授權訪問。
* **權限管理組件化**：後端 Controller 與 Middleware 採用**具名導出 (Named Exports)**，達成精確的 API 級別權限控管。

### 3. 混合式響應式策略 (Hybrid Responsive)
* **CSS 佈局層**：運用 **Flexbox** 與 **Grid** 處理基礎排版，確保區塊隨螢幕寬度彈性流動。
* **Vue 邏輯層**：針對行動端與桌面端差異，利用 `v-if` 結合視窗監聽實作動態組件切換（例如：手機端自動將複雜表格轉化為卡片式列表）。
* **本地化體驗**：配置 `lang="zh-TW"` 確保繁體中文環境下的字體渲染優化，並嚴格落實 **Element Plus** 的 Loading 與 ElMessage 反饋機制，提升用戶心理預期。


## 🧠 業務邏輯思考與實現 (Feature Highlights)

### 1. 面試預約時間衝突檢測 (Conflict Detection)
在安排面試時，系統會自動比對資料庫現有時段，透過後端邏輯防止同一位面試官在同一時間被重複預約，確保招聘流程的嚴謹性與排程合理性。

### 2. 資料表連動與全域數據字典 (Data Dictionary)
* **後端聚合導出**：API 整合職位、部門、來源等多張基礎表，封裝為大型映射物件 (Object Mapping) 導出。
* **Pinia 緩存機制**：前端初始化時調用 API 並將數據存於 Store，組件渲染時直接讀取快取數據，減少 80% 以上的重複請求，並徹底擺脫前端硬編碼 (Hard-coding)。

### 3. 動態數據可視化 (ECharts)
整合 **ECharts** 渲染人才漏斗圖與入職趨勢，根據不同帳號權限顯示對應的招聘進度，將枯燥的表格數據轉化為具備商業價值的視覺化看板。


## 🗄️ 後端設計與部署規範
* **SQL 事務處理 (Transaction)**：在涉及「建立預約、分配面試官、寫入日程」等多表連動操作時，使用 Transaction 確保數據原子性，嚴格防止髒數據產生。
* **生產環境認證適配**：後端配置 `trust proxy` 並配合 Nginx 轉發協議標頭，確保在 Cloudflare HTTPS 環境下，身分驗證 Cookie 具備正確的安全屬性並成功核發。
* **Nginx 高可用配置**：實作 **Reverse Proxy** 以統一路徑管理並隱藏後端真實端口，有效提升系統安全性與解決跨域限制。
* **進程管理**：使用 **PM2** 進行 Node.js 服務託管，確保系統 24/7 不間斷運行。



## 🛠️ 技術棧總覽 (Tech Stack)
* **Frontend**: Vue 3 (Composition API), Vite, Pinia, Vue Router, Element Plus, ECharts,Tailwind CSS v4, Motion One.
* **Backend**: Node.js, Express, Multer (File Stream), JWT.
* **Database**: MySQL (Support Transaction).
* **DevOps**: Oracle Cloud (Ubuntu), Nginx, PM2, Cloudflare SSL/TLS (HTTPS).


## 🔮 未來優化方向 (Roadmap)
* **TypeScript 重構**：強化類型安全與開發效率。
* **自動化通知系統**：整合簡訊或 Email API 實作面試通知。


## ✉️ 開發自述 (Project Philosophy)
這個專案是我對「從開發到上線」完整流程的體現。我認為前端開發者的價值不只在於切圖，更在於對**業務邏輯的嚴謹實作**（如時間衝突檢測）以及對**產品質感**的堅持。

## 🛠️ 開發日誌 (Changelog / Milestone)
### 2026-03-30 | UI/UX 視覺大躍進
* 導入 Tailwind CSS v4，重構全站佈局邏輯。
* 引入 Motion One，實作 Hero Section 與卡片組件的非同步進場動畫。
* 完成 Landing Page 商業化改版，包含定價方案、測試帳號一鍵登入功能。
* 解決 JS 動畫與 CSS 渲染衝突，優化首屏加載流暢度。