# Tasks

## 1. Skill 骨架與流程邊界

- [ ] 1.1 使用 skill 建立流程新增 `.agents/skills/grilled-openspec-propose/SKILL.md`，設定只對明確點名生效的 frontmatter 與說明，並以 `test -f` 及 frontmatter 檢查確認檔案可被辨識。
- [ ] 1.2 在新 skill 中定義 `preflight`、`interviewing`、`awaiting-confirmation`、`proposing`、`ready/recoverable-failure` 階段，並以靜態檢閱確認任何 OpenSpec 寫入指令只會出現在明確確認後的 `proposing` 階段。
- [ ] 1.3 實作 OpenSpec root、schema、context 與 change-name 的唯讀預檢規則，並用「無 root」與「store 無法解析」情境逐條檢閱，確認兩者都會在訪談及寫入前停止。

## 2. 訪談與 OpenSpec 交接

- [ ] 2.1 將 `grill-me` 保留為入口語意並委派 canonical `grilling`，涵蓋 design tree、round frontier、編號問題、可由「是」接受的建議、事實自行查證及無固定輪數上限；以 spec 中「完整的設計樹訪談」與「事實查證」全部 scenarios 逐項核對。
- [ ] 2.2 加入答案修正、取消及同對話繼續的處理規則，並以模擬對話確認修正會使相依分支重新進入 frontier、取消不會建立 change、且 skill 不宣稱支援跨 session 復原。
- [ ] 2.3 加入共同理解摘要與明確確認閘門，確認摘要涵蓋目標、範圍、非目標、外部行為、主要決策、限制及驗收條件；以未確認與已確認兩個 walkthrough 驗證前者無 OpenSpec 寫入、後者才進入 handoff。
- [ ] 2.4 將確認後的濃縮決策包委派給 `openspec-propose`，並明定 late ambiguity 返回訪談、同名 change 交由使用者選擇、逐字稿不寫入 artifacts；以對應 spec scenarios 逐項檢閱 handoff 行為。
- [ ] 2.5 實作 partial failure、成功 status 回報與 planning-only 停止規則，並以失敗及成功 walkthrough 確認前者保留可恢復 change、後者只提示 `$openspec-apply-change` 而不開始實作。

## 3. 相容性與整合驗證

- [ ] 3.1 比對實作前後的 `.agents/skills/grill-me/SKILL.md`、canonical `grilling/SKILL.md` 與 `.agents/skills/openspec-propose/SKILL.md`，以版本控制 diff 確認三者均未被修改且仍可獨立觸發。
- [ ] 3.2 依 delta spec 完成明確啟動、普通提案、預檢失敗、多輪 frontier、答案修正、中途取消、最終確認、late ambiguity、名稱衝突、partial failure 與成功 handoff 的情境矩陣，並在 apply 回報中記錄每個情境的可觀察結果。
- [ ] 3.3 執行 `openspec validate add-grilled-openspec-propose --type change --strict --no-interactive`，確認 proposal、spec、design 與 tasks 通過 strict validation，且最終 `openspec status --change add-grilled-openspec-propose` 顯示 implementation prerequisites ready。
