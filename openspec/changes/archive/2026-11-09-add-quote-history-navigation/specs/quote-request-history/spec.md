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
