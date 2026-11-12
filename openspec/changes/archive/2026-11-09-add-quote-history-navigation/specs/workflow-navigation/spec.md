# Spec Delta

## Purpose

Provide predictable, state-preserving navigation across MoveEasy's inquiry workflow and between saved moving requests, while retaining clear progress feedback.

## ADDED Requirements

### Requirement: Inquiry page provides a previous-page control
The system SHALL display a top-left arrow control on the inquiry page that returns the active request to vendor recommendations.

#### Scenario: Return from inquiry to recommendations
- **WHEN** the user activates the top-left previous-page control on the inquiry page
- **THEN** the system displays vendor recommendations for the active request

### Requirement: Quote organization returns to recommendations
The system SHALL display a top-left “返回推薦業者” control on the quote-organization page.

#### Scenario: Return from quote organization
- **WHEN** the user activates “返回推薦業者” on the quote-organization page
- **THEN** the system displays vendor recommendations for the active request

### Requirement: Comparison returns to recommendations
The system SHALL display a top-left “返回推薦業者” control on the comparison page.

#### Scenario: Return from comparison
- **WHEN** the user activates “返回推薦業者” on the comparison page
- **THEN** the system displays vendor recommendations for the active request

### Requirement: Back-navigation preserves active request state
The system SHALL preserve the active request's form values, selected vendor, edited inquiry message, unsubmitted quote input, parsed quote result, and confirmed quotes when returning to recommendations.

#### Scenario: Return after editing inquiry message
- **WHEN** the user edits the inquiry message and returns to recommendations
- **THEN** reopening the same vendor inquiry restores the edited message

#### Scenario: Return after organizing quotes
- **WHEN** the user returns to recommendations from quote organization or comparison
- **THEN** the active request retains all quote input and confirmed quote data

### Requirement: History is globally accessible
The system SHALL provide an “詢價紀錄” control in the application header that opens the history view from any workflow stage.

#### Scenario: Open history during active workflow
- **WHEN** the user activates “詢價紀錄” while working on a request
- **THEN** the system saves the active request state and displays the history view

### Requirement: Progress and navigation have distinct roles
The system SHALL retain the five-step progress indicator for stage context while using explicit back controls for local navigation and the history control for switching records.

#### Scenario: User views a workflow stage
- **WHEN** any of the five workflow stages is displayed
- **THEN** the progress indicator identifies the active stage without replacing the page's explicit back control

#### Scenario: User views history
- **WHEN** the history view is displayed
- **THEN** the system does not present history as an additional numbered workflow step

---

# 中文翻譯

## 目的

在 MoveEasy 的詢價流程以及已儲存的搬家需求之間，提供可預期且保留狀態的導覽體驗，同時維持清楚的進度回饋。

## 新增需求

### 需求：詢價頁面提供返回上一頁控制項
系統應在詢價頁面的左上角顯示箭頭控制項，讓目前使用中的需求返回推薦業者頁面。

#### 情境：從詢價頁面返回推薦業者頁面
- **當**使用者啟用詢價頁面左上角的返回上一頁控制項
- **則**系統顯示目前使用中需求的推薦業者

### 需求：整理報價頁面可返回推薦業者頁面
系統應在整理報價頁面的左上角顯示「返回推薦業者」控制項。

#### 情境：從整理報價頁面返回
- **當**使用者在整理報價頁面啟用「返回推薦業者」
- **則**系統顯示目前使用中需求的推薦業者

### 需求：比較頁面可返回推薦業者頁面
系統應在比較頁面的左上角顯示「返回推薦業者」控制項。

#### 情境：從比較頁面返回
- **當**使用者在比較頁面啟用「返回推薦業者」
- **則**系統顯示目前使用中需求的推薦業者

### 需求：返回導覽會保留目前使用中需求的狀態
系統應在返回推薦業者頁面時，保留目前使用中需求的表單值、所選業者、已編輯的詢價訊息、尚未提交的報價輸入、已解析的報價結果，以及已確認的報價。

#### 情境：編輯詢價訊息後返回
- **當**使用者編輯詢價訊息並返回推薦業者頁面
- **則**再次開啟同一業者的詢價頁面時，會還原已編輯的訊息

#### 情境：整理報價後返回
- **當**使用者從整理報價或比較頁面返回推薦業者頁面
- **則**目前使用中的需求會保留所有報價輸入及已確認的報價資料

### 需求：詢價紀錄可從全域存取
系統應在應用程式頁首提供「詢價紀錄」控制項，讓使用者可從工作流程的任何階段開啟紀錄檢視畫面。

#### 情境：在進行中的工作流程裡開啟詢價紀錄
- **當**使用者在處理需求期間啟用「詢價紀錄」
- **則**系統儲存目前使用中需求的狀態，並顯示紀錄檢視畫面

### 需求：進度與導覽各自扮演不同角色
系統應保留五步驟進度指示器以呈現目前所處階段，同時使用明確的返回控制項進行局部導覽，並使用詢價紀錄控制項切換不同紀錄。

#### 情境：使用者檢視工作流程階段
- **當**顯示五個工作流程階段中的任一階段
- **則**進度指示器會標示目前所處階段，且不會取代頁面上的明確返回控制項

#### 情境：使用者檢視詢價紀錄
- **當**顯示紀錄檢視畫面
- **則**系統不會將詢價紀錄呈現為額外的編號工作流程步驟
