# MoveEasy

使用 React 與 Vite 建立的搬家詢價與報價比較前端網站。

## 專案結構

```text
.github/workflows/deploy-pages.yml  GitHub Pages 自動部署
index.html                         網頁入口
src/main.jsx                       React 頁面與互動
src/icons.jsx                      SVG 圖示
src/styles.css                     網頁樣式
vite.config.js                     建置與相對資源路徑設定
package.json / package-lock.json   npm 指令與固定依賴版本
dist/                              建置產物
openspec/                          需求與設計文件
```

## 本機開發與驗證

建議使用 Node.js 22，與部署環境一致。

```sh
npm ci
npm run dev
```

驗證正式建置：

```sh
npm run build
npm run preview
```

開啟終端顯示的網址。請透過 HTTP 伺服器預覽，不要直接以 `file://` 開啟 HTML。

## 部署至 GitHub Pages

1. 將專案（包含隱藏目錄 `.github`、`src`、`index.html`、Vite 設定及兩個 npm 設定檔）提交並推送至 GitHub 儲存庫的 `main` 分支。
2. 在 GitHub 儲存庫的 **Settings → Pages → Build and deployment → Source** 選擇 **GitHub Actions**。
3. 在 **Actions → Deploy to GitHub Pages → Run workflow** 手動執行首次部署；之後每次推送至 `main` 都會自動部署。如果首次推送時尚未啟用 Pages，完成第 2 步後重新執行工作流程即可。
4. 等待工作流程成功，再開啟部署結果顯示的網址。目前 origin 對應的預期網址是：
   **https://jocelynkuo.github.io/moveEasy_site/**

若主要分支不是 `main`，請同步修改工作流程的 `on.push.branches`。儲存庫須允許 GitHub Actions 並具備 GitHub Pages 使用資格。工作流程使用內建的 `GITHUB_TOKEN` 權限，不需要另設個人存取權杖。

工作流程每次使用 `npm ci` 安裝鎖定版本並重新建置，只發布 `dist/`；不會把原始碼根目錄當成網站，也不依賴儲存庫內既有的 `dist` 檔案。請勿選擇以分支根目錄直接發布，因為原始 JSX 需要經 Vite 編譯。

`vite.config.js` 使用相對資源路徑 `./`，可支援專案子目錄、不同儲存庫名稱與自訂網域根目錄。現有頁面透過 React 狀態切換，沒有獨立網址路由，重新整理會回到初始畫面；不需要 SPA 的 `404.html` 轉址。未來若加入網址路由，需使用 hash 路由或另行處理 Pages 的深層路徑 404。

GitHub Pages 僅提供靜態網站託管；目前詢價與報價功能是前端示範，不會因此取得後端或跨裝置資料儲存功能。Google Fonts 需要外部連線，無法載入時會使用 CSS 的備援字型。

部署設定參考 [Vite 官方 GitHub Pages 部署說明](https://vite.dev/guide/static-deploy.html#github-pages)。
