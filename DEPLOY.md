# CyberTDEE 部署指南

## 部署到 Vercel（推薦）

### 方法一：透過 Vercel CLI

1. **安裝 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登入 Vercel**
   ```bash
   vercel login
   ```

3. **部署專案**
   ```bash
   cd "/Users/Patrick/工作資料夾/Cursor程式區/TDEE 計算機"
   vercel
   ```

4. **生產環境部署**
   ```bash
   vercel --prod
   ```

### 方法二：透過 Vercel Dashboard（圖形介面）

1. **準備 Git Repository**
   - 初始化 Git（如果還沒有）：
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     ```
   - 推送到 GitHub/GitLab/Bitbucket

2. **連接到 Vercel**
   - 前往 [Vercel Dashboard](https://vercel.com/dashboard)
   - 點擊 "Add New..." → "Project"
   - 選擇你的 Git Repository
   - 匯入專案

3. **設定專案**
   - Framework Preset: **Next.js**
   - Root Directory: `./`（預設）
   - Build Command: `npm run build`（自動偵測）
   - Output Directory: `.next`（自動偵測）
   - Install Command: `npm install`（自動偵測）

4. **環境變數**（此專案不需要環境變數）

5. **部署**
   - 點擊 "Deploy"
   - 等待建置完成
   - 取得部署 URL

### 方法三：使用 Vercel GitHub Integration

1. **在 GitHub 上建立 Repository**
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

2. **在 Vercel 中連接 GitHub**
   - Vercel Dashboard → Settings → Git
   - 連接 GitHub 帳號
   - 授權 Vercel 存取你的 Repository

3. **自動部署**
   - 每次 push 到 main 分支時，Vercel 會自動部署
   - Pull Request 會建立預覽部署

## 其他部署選項

### Netlify

1. **安裝 Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **建置專案**
   ```bash
   npm run build
   ```

3. **部署**
   ```bash
   netlify deploy --prod --dir=.next
   ```

### 自行架設（Node.js 伺服器）

1. **建置專案**
   ```bash
   npm run build
   ```

2. **啟動生產伺服器**
   ```bash
   npm start
   ```

3. **使用 PM2 管理進程**
   ```bash
   npm install -g pm2
   pm2 start npm --name "cyber-tdee" -- start
   ```

## 部署前檢查清單

- [ ] 確保所有依賴已安裝：`npm install`
- [ ] 測試本地建置：`npm run build`
- [ ] 測試本地生產模式：`npm start`
- [ ] 檢查環境變數（此專案不需要）
- [ ] 確認 `.gitignore` 已包含敏感檔案
- [ ] 檢查 TypeScript 錯誤：`npm run lint`
- [ ] 測試響應式設計（行動端、平板、桌面）
- [ ] 確認 LocalStorage 功能正常運作

## 建置與測試

```bash
# 開發模式
npm run dev

# 建置生產版本
npm run build

# 測試生產版本
npm start

# 檢查程式碼
npm run lint
```

## 常見問題

### 建置失敗

- 檢查 Node.js 版本（需要 18+）
- 清除 `.next` 目錄並重新建置：`rm -rf .next && npm run build`
- 檢查 `package.json` 中的依賴版本

### 部署後功能異常

- 確認所有客戶端功能（LocalStorage）在瀏覽器中正常運作
- 檢查瀏覽器 Console 是否有錯誤
- 確認 Next.js 版本與 Vercel 相容

### 效能優化

- Vercel 會自動進行 Next.js 優化
- 圖片優化：使用 Next.js Image 組件（如果未來需要）
- 字體優化：已使用 `next/font` 自動優化

## 監控與分析（選用）

- **Vercel Analytics**: 在 Vercel Dashboard 中啟用
- **Google Analytics**: 添加 GA4 追蹤碼到 `layout.tsx`
- **Sentry**: 錯誤追蹤（如果需要）
