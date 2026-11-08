# Design

## Context

專案目前將 OpenSpec 工作流程 skills 放在 `.agents/skills/`。`grill-me` 是停用自動觸發的薄入口，只要求委派給 canonical `grilling`；後者定義 design tree、frontier rounds、建議答案與事實查證規則。`openspec-propose` 則負責 root 檢查、schema 驅動的 artifacts 建立與 planning boundary，但不要求在產檔前完成深度決策訪談。參見 `proposal.md` 與 `specs/grilled-openspec-proposal/spec.md`。

## Goals / Non-Goals

**Goals:**

- 用單一專案層級 orchestration skill 串接既有 skills，而不複製或分叉其核心規則。
- 把訪談期與產檔期分成明確狀態，確保確認前沒有 OpenSpec 寫入。
- 在委派前保留完整、可重算的決策相依關係，並將確認後的摘要轉成穩定 handoff input。
- 讓取消、重答、late ambiguity、同名 change 與產檔錯誤都有確定的恢復路徑。

**Non-Goals:**

- 修改或取代 `grill-me`、`grilling`、`openspec-propose`。
- 持久化訪談樹、跨 session 恢復狀態或儲存問答逐字稿。
- 新增 OpenSpec CLI wrapper、應用程式 UI、runtime dependency 或專用測試框架。
- 在 proposal workflow 中執行任何 implementation task。

## Decisions

### 1. 新增薄型 project-local orchestration skill

在 `.agents/skills/grilled-openspec-propose/SKILL.md` 新增具明確觸發描述的 skill。它只定義階段順序、狀態閘門、handoff contract 與失敗處理；訪談細節委派給 `grilling`，artifact 細節委派給 `openspec-propose`。

直接修改 `openspec-propose` 被否決，因為會讓所有普通提案承擔長訪談。複製 `grilling` 全文也被否決，因為 canonical 規則更新後容易產生分歧。

### 2. 把 grill-me 視為入口語意，直接使用 canonical grilling 行為

`grill-me` 目前唯一行為是呼叫 `grilling`，且禁止自動模型觸發。新 skill 應明確保留這個 alias 關係，但實際訪談以可用的 canonical `grilling` skill 為規則來源，不自行維護第二份 design-tree protocol。

要求 runtime 先呼叫 `grill-me` 再由它轉呼叫 `grilling` 的雙重 dispatch 被否決，因為增加工具相依卻沒有新增行為，且部分 agent 環境未必提供通用 Skill tool。

### 3. 以狀態機約束唯讀與寫入邊界

流程分為以下狀態：

1. `preflight`：只執行 OpenSpec root、schema、context 與現有 change 的唯讀檢查。
2. `interviewing`：維護 design tree，逐輪詢問 frontier，不建立 change。
3. `awaiting-confirmation`：frontier 清空後輸出共同理解摘要，等待明確確認。
4. `proposing`：將確認摘要交給 `openspec-propose`，允許建立 planning artifacts。
5. `ready` 或 `recoverable-failure`：回報完整 status，或保留並說明部分完成狀態。

只依賴自然語言提醒、沒有明確狀態邊界的方案被否決，因為較難驗證取消與重答時不會提早寫入。

### 4. 預檢發生在長訪談之前

orchestration skill 先依 `openspec-propose` 的 project check 與 context loading 規則確認目標可用，但不得執行 `new change`。如果沒有 root、store 宣告無效或 context 解析失敗，流程在任何訪談成本與寫入之前停止。

將預檢延後到訪談完成後被否決，因為使用者可能在投入多輪決策後才得知環境無法產檔。

### 5. 共同理解摘要是不可略過的 write gate

frontier 清空時，skill 產生包含目標、範圍、非目標、外部行為、設計決策、限制與驗收條件的摘要，並明示沒有未決問題。只有使用者在看到該摘要後的明確確認才能進入 `proposing`。

把逐輪的「是」視為對最終產檔的隱含授權被否決；那些答覆只確定個別決策，不能取代對完整組合結果的確認。

### 6. 答案修正與 late ambiguity 都回到 design tree

使用者修正答案時，先使所有依賴該答案的後代決策失效，再重新計算 frontier。`openspec-propose` 的 instructions 或專案檢查若揭露重大新歧義，也採相同方式回到 `interviewing`，完成新分支後重新產生摘要並再次確認。

由 orchestration skill 靜默補假設被否決，因為這會破壞「所有實質決策由使用者決定」的核心契約。

### 7. Handoff 使用濃縮決策包，不傳遞逐字稿

交給 `openspec-propose` 的輸入包含 change description、已確認範圍、非目標、需求、設計限制、驗收情境與命名決策。被淘汰答案只在解釋 design trade-off 必要時摘要，不保存問答全文。

直接把完整對話寫入 planning artifacts 被否決，因為會混入過時選項、增加噪音並形成不必要的訪談資料保存。

### 8. 遵循上游的衝突與失敗恢復語意

同名 change 在任何寫入前交由使用者選擇繼續或重新命名。確認後若 artifact creation 部分失敗，保留 OpenSpec CLI 產生的可恢復 change，列出 done／missing artifacts，不自動刪除。成功後顯示最終 status 並停在 planning boundary。

以刪除 partial change 模擬 atomicity 被否決，因為刪除可能破壞使用者或其他流程同時加入的內容，也會失去可恢復進度。

## Risks / Trade-offs

- **[深度訪談可能讓簡單需求顯得繁瑣]** → 僅在明確呼叫新 skill 時啟動，保留原 `openspec-propose` 快速路徑。
- **[canonical grilling skill 在某些環境不可用]** → 在開始訪談前檢查可用性並清楚回報；不得以內嵌的過期複本靜默降級。
- **[對話壓縮可能遺失設計樹細節]** → 每輪保留精簡決策摘要，最終仍要求使用者審閱完整共同理解；不承諾跨 session 恢復。
- **[確認後才出現 artifact-specific 限制]** → 把重大新決策送回訪談，只有不改變規格結果的次要細節才依既有 OpenSpec 規則記錄合理假設。
- **[部分產檔不是交易式操作]** → 保留 change 並以 OpenSpec status 精確回報，使後續 apply 或續寫不會建立在假成功上。

## Migration Plan

1. 新增 project-local `grilled-openspec-propose` skill，不改動既有 skill 檔案。
2. 以靜態檢查確認 frontmatter、觸發描述、委派名稱及 planning boundary。
3. 依 spec 的代表性情境進行對話式驗證，包括預檢失敗、重答、取消、重新確認、名稱衝突與 partial failure。
4. 使用一個測試 change 驗證成功 handoff 能產生 schema 所需 artifacts 與最終 status；測試資料不得混入正式 change。

Rollback 只需移除新增的 skill 目錄。由於既有三個 skills 未修改，rollback 不需要資料遷移或應用程式變更。
