# page-call-to-action Specification

## Purpose

確保 MoveEasy 每個可見頁面都清楚呈現唯一的主要行動按鈕，讓使用者能辨認當前最重要的下一步，同時保留完成流程所需的輔助控制。

## Requirements

### Requirement: Each page presents one primary call to action
The system SHALL present exactly one primary call-to-action button on each visible page, including the inquiry history view.

#### Scenario: Page contains multiple possible next actions
- **WHEN** a workflow or history page is displayed
- **THEN** exactly one button is presented as that page's primary call to action

#### Scenario: Page has conditional content
- **WHEN** the visible page changes based on empty, saved, or completed data
- **THEN** the displayed state still contains no more than one primary call-to-action button

### Requirement: Supporting controls are not primary calls to action
The system SHALL keep form choices, local navigation, editing, deletion, modal controls, and other supporting actions distinct from the page's single primary call to action.

#### Scenario: User uses a supporting control
- **WHEN** the user activates a form choice, back control, edit or delete control, or history modal control
- **THEN** that control remains available without being presented as an additional primary call to action
