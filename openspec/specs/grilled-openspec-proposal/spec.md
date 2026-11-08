# grilled-openspec-proposal Specification

## Purpose

此 capability 提供一條明確啟動、先完整釐清決策再建立 OpenSpec 規劃 artifacts 的安全流程，使訪談結論、確認閘門與產檔交接具有一致且可驗證的行為。

## Requirements

### Requirement: 明確啟動與 OpenSpec 預檢

系統 SHALL 僅在使用者明確呼叫 `grilled-openspec-propose` 或直接點名該 skill 時啟動整合流程，並在訪談前唯讀確認 OpenSpec root、schema 與 project context 可解析。

#### Scenario: 使用者明確啟動流程
- **WHEN** 使用者呼叫 `grilled-openspec-propose` 並描述待規劃的變更
- **THEN** 系統先執行 OpenSpec 唯讀預檢，再開始設計樹訪談

#### Scenario: 一般 OpenSpec 提案請求
- **WHEN** 使用者只呼叫既有 `openspec-propose` 且未點名整合 skill
- **THEN** 系統不得因此自動啟動 `grilling` 深度訪談

#### Scenario: 預檢無法解析 OpenSpec root
- **WHEN** OpenSpec 尚未初始化或宣告的 store 無法解析
- **THEN** 系統停止整合流程、回報可採取的處理方式，且不得建立 change 或 artifact

### Requirement: 完整的設計樹訪談

系統 SHALL 透過 canonical `grilling` 行為建立決策相依樹，逐輪詢問當前 frontier 的所有問題；每題 SHALL 編號並提供一個能以「是」接受的建議答案，直到 frontier 清空。

#### Scenario: 同輪存在多個獨立決策
- **GIVEN** 多個決策的前置條件均已確定
- **WHEN** 系統產生下一輪問題
- **THEN** 系統在同一輪列出全部已解鎖問題及各自的建議答案

#### Scenario: 問題依賴尚未決定的答案
- **GIVEN** 一個決策依賴本輪尚未回答的問題
- **WHEN** 系統計算當前 frontier
- **THEN** 系統將該依賴決策保留到後續輪次，不得以假設代替答案

#### Scenario: 設計樹尚未完成
- **WHEN** 仍存在尚未訪問的已解鎖或待解鎖決策分支
- **THEN** 系統繼續訪談，且不得因固定題數或輪數限制提前結束

### Requirement: 事實查證與使用者決策分工

系統 MUST 自行查證可從程式碼、設定、文件或工具取得的事實，只把會影響範圍、外部行為、相容性或驗收條件的取捨交由使用者決定。

#### Scenario: 問題可由專案環境回答
- **WHEN** frontier 決策需要一項可從現有環境取得的事實
- **THEN** 系統自行調查該事實，並繼續詢問其他不受該調查阻擋的 frontier 問題

#### Scenario: 決策會改變規格結果
- **WHEN** 一項選擇會實質改變範圍、可觀察行為、相容性或驗收條件
- **THEN** 系統向使用者提出該決策，不得自行選定

### Requirement: 共同理解與明確確認閘門

系統 SHALL 在 frontier 清空後提供共同理解摘要，至少涵蓋目標、範圍、非目標、可觀察行為、主要設計決策、限制及驗收條件，並在收到明確確認前禁止建立 OpenSpec change 或 artifacts。

#### Scenario: 訪談已完成但尚未確認
- **GIVEN** 設計樹 frontier 已清空且沒有未決問題
- **WHEN** 系統呈現共同理解摘要
- **THEN** 系統要求使用者明確確認，且不得開始 `openspec-propose`

#### Scenario: 使用者確認共同理解
- **WHEN** 使用者明確確認共同理解摘要
- **THEN** 系統得以確認內容作為唯一規劃輸入，開始 `openspec-propose` 流程

#### Scenario: 使用者修正摘要或先前答案
- **WHEN** 使用者在確認前修正任何決策
- **THEN** 系統更新設計樹、重新計算 frontier，並在分支完成後再次要求確認

### Requirement: 取消與訪談狀態邊界

系統 SHALL 在使用者取消、改變主題或未完成訪談時停止或暫停流程，不得留下 OpenSpec 半成品；訪談狀態僅保證在目前對話中可繼續。

#### Scenario: 使用者中途取消
- **WHEN** 使用者在確認閘門前取消整合流程
- **THEN** 系統停止訪談，且 `openspec/changes/` 中不得因本次流程新增 change

#### Scenario: 使用者在同一對話繼續訪談
- **WHEN** 使用者在目前對話中回覆尚未完成的 frontier 問題
- **THEN** 系統從現有設計樹繼續，而非要求重建已確認的決策

#### Scenario: 使用者從新的 session 重新開始
- **WHEN** 新 session 無法取得先前訪談狀態
- **THEN** 系統不保證復原舊設計樹，且不得宣稱存在持久化訪談記錄

### Requirement: 安全交接至 OpenSpec 提案流程

系統 SHALL 在確認後委派既有 `openspec-propose` 建立 schema 所需的全部規劃 artifacts；若產檔階段出現新的重大歧義，系統 SHALL 返回設計樹訪談並重新取得確認。

#### Scenario: 確認後成功交接
- **WHEN** 使用者已確認共同理解且 OpenSpec 預檢仍有效
- **THEN** 系統依 `openspec-propose` 規則建立完整 proposal、delta spec、design 與 tasks

#### Scenario: 產檔時發現重大新歧義
- **WHEN** project context、artifact instructions 或專案檢查揭露會改變規格結果的新決策
- **THEN** 系統停止後續產檔、返回 `grilling` 補問，並在繼續前再次要求明確確認

#### Scenario: 同名 change 已存在
- **WHEN** 產檔前發現衍生出的 change 名稱已存在
- **THEN** 系統要求使用者選擇繼續既有 change 或使用新名稱，不得覆寫或自行決定

### Requirement: 規格內容與訪談隱私

系統 SHALL 僅把已確認決策濃縮為 OpenSpec artifacts，不得把完整訪談逐字稿或已淘汰的選項寫入 `openspec/`。

#### Scenario: 建立規劃 artifacts
- **WHEN** 系統把已確認共同理解轉換為 OpenSpec 文件
- **THEN** 文件包含最終需求與相關理由，但不包含逐題問答紀錄

#### Scenario: 訪談中曾考慮不同選項
- **WHEN** 使用者已選定其中一個方案
- **THEN** 系統只在設計理由需要時摘要替代方案，不保存完整被淘汰答案

### Requirement: 失敗回報與規劃邊界

系統 MUST 如實回報產檔進度與失敗，保留可恢復的已建立 change，不得自動刪除；所有 artifacts 完成後 MUST 停止，不得在同一次請求中實作變更。

#### Scenario: 產檔途中失敗
- **WHEN** `openspec-propose` 已建立部分 artifacts 後遇到錯誤
- **THEN** 系統保留可恢復狀態，列出已完成與未完成項目，且不得宣稱規劃完成

#### Scenario: 所有規劃 artifacts 完成
- **WHEN** OpenSpec status 顯示實作所需 artifacts 全部 ready
- **THEN** 系統回報 change 路徑、artifact 清單與 status，並提示另行執行 `$openspec-apply-change`

#### Scenario: 同一請求要求直接實作
- **WHEN** 整合流程完成規劃且原始請求同時包含實作意圖
- **THEN** 系統仍在 planning boundary 停止並等待新的 apply 請求

### Requirement: 既有 skills 保持相容

系統 SHALL 以協調與委派方式組合既有 skills，不得改變 `grill-me`、`grilling` 或 `openspec-propose` 的獨立觸發方式與既有行為。

#### Scenario: 獨立呼叫既有 skill
- **WHEN** 使用者直接呼叫 `grill-me`、`grilling` 或 `openspec-propose`
- **THEN** 該 skill 維持原本流程，不受新增整合 skill 影響

#### Scenario: canonical grilling 規則更新
- **WHEN** 可用的 `grilling` skill 日後更新訪談協議
- **THEN** 整合流程透過委派採用 canonical 行為，不依賴一份複製且可能過期的訪談規則
