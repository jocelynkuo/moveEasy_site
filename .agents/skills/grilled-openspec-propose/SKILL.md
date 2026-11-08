---
name: grilled-openspec-propose
description: Explicitly invoked workflow combining grilling interviews with confirmed OpenSpec proposals. Use only when the user names grilled-openspec-propose; ordinary OpenSpec proposal requests do not activate it.
---

# Grilled OpenSpec Propose

協調需求訪談與 OpenSpec 產檔。此 skill 只建立規劃文件。不要修改既有 skills 或實作產品功能。

## Dependencies

讀取 [grill-me](../grill-me/SKILL.md) 與 [openspec-propose](../openspec-propose/SKILL.md)，並從目前環境的 skill catalog 解析及讀取 canonical `grilling`。`grill-me` 是 `grilling` 的入口別名，直接使用 canonical skill，不要求額外的 Skill tool 或複製其訪談規則。任一依賴無法讀取時，先回報缺少項目並停止；不得靜默使用過期複本。

## preflight — 唯讀準備

依 `openspec-propose` 的 store selection、project check、context loading 與 schema selection 規則執行唯讀部分：`openspec list --json`、`openspec context --json`，在解析的 root 讀取設定並確認 schema 可用。已選定 store 時保留其 scope；使用 configured default，除非使用者明確選擇另一 schema。

沒有 root 時，說明初始化、既有 store 或不使用 OpenSpec 的處理方式並等待選擇；不得自動初始化。無法解析 store 宣告時回報 CLI message 與 fix。context 命令失敗時停止，不回退到目前目錄。設定中 context 欄位的有效性依上游規則處理。

記住已有 change 名稱；名稱尚未決定不妨礙開始訪談。此階段及首次確認前的所有階段，禁止 `new change`、建立 artifacts 或任何 OpenSpec 寫入。

## interviewing — 委派 canonical grilling

使用 `grilling` 的 design tree 與 frontier rounds 協議，不另維護規則副本：同輪處理全部已解鎖決策，使用其編號與建議答案格式，讓「是」接受建議；依賴未決答案的問題留到下一輪。不設題數或輪數上限。

事實由 agent 查證，取捨由使用者決定。依 canonical 規則及環境授權委派事實查證；調查尚未完成的分支保持未決，同時處理其他已解鎖問題。

在目前對話保留精簡的決策、相依關係與未決分支。答案被修正時，使受影響的後代決策失效並重新計算 frontier，保留無關的已確認決策。同對話恢復時繼續此樹；不新增持久化訪談檔案、不保證跨 session 恢復。

使用者取消或切換主題時停止，未答完時等待；首次確認前不應存在本流程建立的 change。若已經產檔後返回訪談，取消時保留現有成果並回報，不刪除。

## awaiting-confirmation — 共同理解

只有所有分支均已處理、沒有待查證事實且 frontier 清空，才呈現摘要：目標、範圍、非目標、外部可觀察行為、主要設計決策、相容性與限制、驗收條件、change 命名，並明示沒有未決問題。

要求使用者明確確認此摘要。逐題的「是」、沉默或原始實作意圖都不能代替對摘要的確認。若使用者修正，返回 interviewing；分支完成後重新呈現摘要及取得確認。

## proposing — 委派 openspec-propose

收到摘要的明確確認後，交接濃縮決策包：變更描述、名稱、範圍與非目標、需求、設計限制及驗收情境。保持使用者指定的文件語言與技術識別字。只傳遞最終決策，替代方案僅在解釋設計理由必要時摘要，不將完整問答或淘汰答案寫入 openspec。

重新確認 root、context 與名稱衝突，再按 `openspec-propose` 完整執行 schema 指示、相依 artifacts、路徑檢查及 status。若同名 change 存在，請使用者選擇繼續或新名稱，未選擇前不可覆寫。

若專案檢查或 artifact instructions 揭露會改變範圍、行為、相容性或驗收的新重大歧義，停止後續寫入，保留現有 artifacts，返回 interviewing 並重新取得摘要確認；之後協調受影響 artifacts 使其一致。次要細節依上游規則記錄合理假設。

## ready / recoverable-failure — 回報並停止

成功時檢查 schema 所需全部 artifacts 完成（或合法跳過），回報 change 路徑、artifact 清單與最終 OpenSpec status。status 的 ready 表示可開始撰寫，不能當作 artifact 已完成。提示另行執行 `$openspec-apply-change <name>`，即使最初請求包含實作意圖，也在本次規劃結束後停止。

產檔失敗時保留可恢復 change，列出已完成與缺少項目、錯誤及恢復方式，不刪除或宣稱成功。若 status 也失敗，區分已核實的檔案與未知狀態。後續使用者授權繼續時重新讀取 artifacts 與 status。
