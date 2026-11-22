# Spec Delta

## ADDED Requirements

### Requirement: Inquiry history opens as a full-screen modal
The system SHALL display inquiry history in a modal that covers the full viewport, hides the underlying workflow and footer, and reuses the shared header's existing inquiry-history control as the modal's close control.

#### Scenario: Open inquiry history
- **WHEN** the user activates “詢價紀錄” in the shared header from any workflow stage
- **THEN** the history modal fills the viewport, the underlying workflow and footer are hidden, the shared header remains visible, and the same top-right control changes to an “X” with the accessible name “關閉詢價紀錄”; no second close control is shown

### Requirement: Closing inquiry history restores the previous workflow view
The system SHALL close inquiry history when the user activates the same top-right control in its “X” state, restore the workflow stage and in-progress state that were visible before history opened, and return the control to its “詢價紀錄” state.

#### Scenario: Close inquiry history
- **WHEN** the user activates the top-right “X” control while viewing inquiry history
- **THEN** the modal closes, the previously visible workflow stage and its in-progress state are restored, and the same control again displays “詢價紀錄”
