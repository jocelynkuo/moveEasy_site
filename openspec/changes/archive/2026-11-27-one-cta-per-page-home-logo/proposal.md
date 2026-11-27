# Proposal

## Why

頁面上同時出現多個主要行動按鈕時，使用者不容易判斷當下最重要的下一步。導覽列左側的 MoveEasy Logo 目前只捲動到頁面頂端，無法讓使用者直接回到流程首頁。

## What Changes

- 每個可見頁面只呈現一個主要 CTA 按鈕，讓頁面當下最重要的行動清楚可辨。
- 將導覽列左側 Logo 設為回到搬家需求首頁的導覽控制，保留目前已輸入的流程資料。
- 表單選項、返回、編輯、刪除、關閉、歷程與其他必要的輔助控制不納入 CTA 數量限制。
- 不改動上述範圍以外的內容或功能。

## Capabilities

### New Capabilities

- `page-call-to-action`: 每個頁面唯一主要 CTA 的行為與呈現規則。

### Modified Capabilities

- `workflow-navigation`: 左側品牌 Logo 可返回搬家需求首頁，並保留目前流程資料。

## Impact

- 影響 `src/main.jsx` 中的共用頁首與五個流程階段、詢價紀錄頁的主要行動按鈕安排。
- 不新增依賴或 API；不涉及資料格式變更。
