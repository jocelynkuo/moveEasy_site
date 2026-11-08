# Proposal

## Why

目前 `grill-me`／`grilling` 能釐清設計決策，`openspec-propose` 能建立完整規劃 artifacts，但兩者之間沒有受控的交接流程。新增一個明確啟動的複合 skill，可確保重大歧義在寫入 OpenSpec 前已形成共同理解，並避免未完成訪談留下半成品 change。

## What Changes

- 新增專案層級 `grilled-openspec-propose` skill，依序協調 OpenSpec 唯讀預檢、`grill-me` 入口語意、canonical `grilling` 設計樹訪談，以及 `openspec-propose` 產檔流程。
- 要求訪談逐輪處理所有已解鎖的 decision frontier，每題附可由「是」接受的建議答案，直到所有分支完成。
- 在建立任何 OpenSpec change 或 artifact 前加入共同理解摘要與明確確認閘門。
- 規範取消、答案修正、後續重大歧義、同名 change 與產檔失敗等分支的可觀察行為。
- 僅將已確認決策濃縮進 artifacts，不保存完整訪談逐字稿或跨 session 訪談狀態。
- 保持 `grill-me`、`grilling` 與 `openspec-propose` 原有檔案和獨立使用方式不變。

## Capabilities

### New Capabilities

- `grilled-openspec-proposal`: 定義以完整設計樹訪談、明確確認閘門及安全 OpenSpec 交接建立規劃 artifacts 的行為。

### Modified Capabilities

None.

## Impact

- 新增預定實作檔案 `.agents/skills/grilled-openspec-propose/SKILL.md`。
- 依賴既有專案 skill `.agents/skills/grill-me/SKILL.md`、可用的 canonical `grilling` skill，以及 `.agents/skills/openspec-propose/SKILL.md`。
- 不改動 MoveEasy 應用程式、既有 OpenSpec skills、既有 change 或 runtime dependencies。
- 行為驗證以代表性對話情境及 OpenSpec CLI 狀態檢查為主，不在此 change 引入專用測試框架。
