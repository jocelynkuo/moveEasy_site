# Proposal

## Why

使用者開啟詢價紀錄後，畫面目前沒有明確的離開控制，容易被困在紀錄頁。將它呈現為全螢幕 Modal，並提供固定在右上角的關閉按鈕，能讓使用者清楚辨認如何返回原本的工作流程。

## What Changes

- 將詢價紀錄改為覆蓋整個視窗的 Modal 頁面，不露出底下頁面的元件。
- 沿用頁首原有的「詢價紀錄」控制作為 Modal 開關：開啟時切換為「X」關閉按鈕，關閉後恢復為「詢價紀錄」，不另加第二個關閉控制。
- 關閉時回到開啟紀錄前的工作流程頁面，並保留進行中的資料。
- 保留既有詢價紀錄列表、空狀態、刪除紀錄與恢復紀錄行為。

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `workflow-navigation`: 定義詢價紀錄全螢幕 Modal 的呈現方式，以及關閉後返回先前頁面的行為。

## Impact

- `src/main.jsx`: 詢價紀錄的開啟、關閉與工作流程頁面狀態。
- `src/styles.css`: 全視窗 Modal 版面、頂部關閉控制與不同螢幕尺寸的呈現。
- `openspec/specs/workflow-navigation/spec.md`: 增補歷史頁面 Modal 與返回行為規格。
