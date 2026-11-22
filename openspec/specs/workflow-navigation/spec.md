# workflow-navigation Specification

## Purpose

Provide predictable, state-preserving navigation across MoveEasy's inquiry workflow and between saved moving requests, while retaining clear progress feedback.

## Requirements

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
