# Favicon 設定說明

## 方法一：使用 Lucide Icon（推薦）

1. 前往 [Lucide Icons](https://lucide.dev/icons)
2. 搜尋適合的圖示，建議使用：
   - `Activity` - 活動/代謝相關
   - `Calculator` - 計算機
   - `Gauge` - 儀表板
   - `Zap` - 能量/閃電
3. 點擊圖示，選擇 "Download SVG"
4. 使用圖像編輯軟體（如 Figma、Adobe Illustrator）：
   - 將圖示顏色設為 `#00f3ff` (cyber-blue)
   - 背景設為透明或 `#0a0a0a` (background)
   - 調整大小為 32x32 或 64x64 像素
5. 將 SVG 轉換為 ICO 格式：
   - 使用 [Convertio](https://convertio.co/svg-ico/)
   - 或使用 [Favicon Generator](https://favicon.io/favicon-converter/)
6. 將生成的 `favicon.ico` 檔案放入 `app/` 目錄

## 方法二：使用線上 Favicon 生成器

1. 前往 [Favicon.io](https://favicon.io/favicon-generator/)
2. 使用文字 "TDEE" 或上傳 SVG 圖示
3. 設定顏色：
   - 文字顏色：`#00f3ff`
   - 背景顏色：`#0a0a0a`
4. 下載並解壓縮
5. 將 `favicon.ico` 放入 `app/` 目錄

## 方法三：手動建立 SVG Favicon

在 `app/` 目錄建立 `icon.svg`：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#00f3ff" stroke-width="2">
  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
</svg>
```

然後在 `layout.tsx` 中更新：

```tsx
export const metadata: Metadata = {
  title: 'CyberTDEE',
  description: 'Future-proof Calorie Tracker',
  icons: {
    icon: '/icon.svg',
  },
}
```

## 注意事項

- Next.js 14+ 會自動處理 `app/favicon.ico` 或 `app/icon.ico`
- 也可以使用 `app/icon.png`、`app/icon.svg` 等格式
- 建議大小：32x32 或 64x64 像素（ICO 格式）
- 確保圖示在深色背景下清晰可見
