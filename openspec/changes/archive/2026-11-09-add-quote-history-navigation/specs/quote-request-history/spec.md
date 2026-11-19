# Spec Delta

## Purpose

Provide a persistent, resumable history of moving requests so users can continue inquiry and quote-comparison work without recreating previously entered information.

## ADDED Requirements

### Requirement: Create one record per moving request
The system SHALL create exactly one history record when a valid moving-request form first advances to vendor recommendations.

#### Scenario: Valid request reaches recommendations
- **WHEN** the user submits a valid moving request and selects “查看推薦業者”
- **THEN** the system creates one record containing the request details and recommendation-stage progress

#### Scenario: Existing request revisits recommendations
- **WHEN** the active request returns to vendor recommendations after its record has been created
- **THEN** the system updates the existing record instead of creating a duplicate

### Requirement: Persist active workflow data
The system SHALL persist the request form, selected vendor, inquiry message, confirmed quotes, latest completed stage, creation time, and last-updated time for each history record in browser-local storage.

#### Scenario: Inquiry content changes
- **WHEN** the user changes the selected vendor or edits the generated inquiry message
- **THEN** the system updates those values and the last-updated time on the active record

#### Scenario: Confirmed quote changes
- **WHEN** the user adds, edits, or removes a confirmed quote
- **THEN** the system updates the active record's quote collection, progress, and last-updated time

#### Scenario: Browser is reopened
- **WHEN** the user reopens the application in the same browser with intact site data
- **THEN** previously stored history records remain available

### Requirement: Present inquiry history
The system SHALL provide a history view listing each stored record with moving date, origin and destination areas, current progress, confirmed quote count, and last-updated time.

#### Scenario: Multiple records exist
- **WHEN** the user opens inquiry history with multiple stored records
- **THEN** the system displays every record ordered by most recently updated first

#### Scenario: No records exist
- **WHEN** the user opens inquiry history without stored records
- **THEN** the system displays an empty state with an action to create a moving request

### Requirement: Resume a stored request
The system SHALL allow the user to select a history record and restore its saved state at the latest completed workflow stage.

#### Scenario: Resume recommendation-stage record
- **WHEN** the user selects a record whose latest completed stage is vendor recommendations
- **THEN** the system restores its request data and displays its recommendation results

#### Scenario: Resume later-stage record
- **WHEN** the user selects a record with saved inquiry or quote progress
- **THEN** the system restores all saved data and displays the latest completed stage

### Requirement: Handle unavailable local data safely
The system MUST remain usable when local storage is unavailable, malformed, or contains an unsupported record shape.

#### Scenario: Stored history cannot be parsed
- **WHEN** the application encounters malformed or unsupported history data
- **THEN** the system ignores the invalid data, presents an empty usable history state, and does not block creation of a new request

#### Scenario: Local storage write fails
- **WHEN** the browser rejects a history write
- **THEN** the active in-memory workflow remains usable for the current session

---

# 中文翻譯

## 目的

提供可持續保存且可恢復的搬家需求紀錄，讓使用者無須重新建立先前輸入的資訊，即可繼續進行詢價與報價比較作業。

## 新增需求

### 需求：每個搬家需求建立一筆紀錄
當有效的搬家需求表單首次進入推薦業者階段時，系統應建立且只建立一筆歷史紀錄。

#### 情境：有效需求進入推薦業者頁面
- **當**使用者提交有效的搬家需求並選擇「查看推薦業者」
- **則**系統建立一筆包含需求詳細資料與推薦階段進度的紀錄

#### 情境：既有需求再次進入推薦業者頁面
- **當**目前使用中的需求在紀錄建立後返回推薦業者頁面
- **則**系統更新既有紀錄，而不建立重複紀錄

### 需求：保存進行中的工作流程資料
系統應將每筆歷史紀錄的需求表單、所選業者、詢價訊息、已確認報價、最新完成階段、建立時間及最後更新時間，保存於瀏覽器的本機儲存空間中。

#### 情境：詢價內容變更
- **當**使用者變更所選業者或編輯產生的詢價訊息
- **則**系統更新目前使用中紀錄的相關值與最後更新時間

#### 情境：已確認報價變更
- **當**使用者新增、編輯或移除已確認的報價
- **則**系統更新目前使用中紀錄的報價集合、進度與最後更新時間

#### 情境：重新開啟瀏覽器
- **當**使用者在網站資料保持完整的同一瀏覽器中重新開啟應用程式
- **則**先前儲存的歷史紀錄仍可使用

### 需求：呈現詢價紀錄
系統應提供紀錄檢視畫面，列出每筆已儲存紀錄的搬家日期、起點與目的地區域、目前進度、已確認報價數量，以及最後更新時間。

#### 情境：存在多筆紀錄
- **當**使用者在存在多筆已儲存紀錄的情況下開啟詢價紀錄
- **則**系統顯示所有紀錄，並依最後更新時間由近至遠排序

#### 情境：不存在紀錄
- **當**使用者在沒有已儲存紀錄的情況下開啟詢價紀錄
- **則**系統顯示空白狀態，並提供建立搬家需求的操作

### 需求：恢復已儲存的需求
系統應允許使用者選擇一筆歷史紀錄，並在最新完成的工作流程階段恢復其已儲存狀態。

#### 情境：恢復推薦業者階段的紀錄
- **當**使用者選擇最新完成階段為推薦業者的紀錄
- **則**系統恢復其需求資料並顯示推薦結果

#### 情境：恢復後續階段的紀錄
- **當**使用者選擇已儲存詢價或報價進度的紀錄
- **則**系統恢復所有已儲存資料，並顯示最新完成的階段

### 需求：安全處理無法使用的本機資料
當本機儲存空間無法使用、資料格式錯誤，或包含不受支援的紀錄結構時，系統必須保持可用。

#### 情境：無法解析已儲存的紀錄
- **當**應用程式遇到格式錯誤或不受支援的歷史資料
- **則**系統忽略無效資料、呈現可正常使用的空白紀錄狀態，且不阻礙建立新需求

#### 情境：寫入本機儲存空間失敗
- **當**瀏覽器拒絕寫入歷史紀錄
- **則**目前記憶體內的工作流程在本次工作階段中仍可正常使用
