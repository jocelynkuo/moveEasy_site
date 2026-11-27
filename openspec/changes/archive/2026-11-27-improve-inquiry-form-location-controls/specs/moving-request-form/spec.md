# Spec Delta

## Purpose

Captures the details of a moving request through clear, valid form controls, including origin and destination locations that remain consistent with the selected city and can be carried through recommendations and saved inquiry history.

## ADDED Requirements

### Requirement: Select districts from the chosen city
The system SHALL offer an origin and destination district selection menu whose options correspond to the city selected for that location.

#### Scenario: Choose a district for a supported city
- **WHEN** the user selects a supported city for either location
- **THEN** the corresponding district menu displays the districts belonging to that city

#### Scenario: Change the selected city
- **WHEN** the user changes a location's city
- **THEN** the district selection is cleared if it is not valid for the newly selected city, and the user can select a district from the newly available options

#### Scenario: Select origin and destination independently
- **WHEN** the user chooses cities and districts for both ends of the move
- **THEN** changing one location's city or district does not change the other location's selection

### Requirement: Require valid origin and destination locations
The system SHALL prevent a moving request from advancing until both locations contain a supported city and a district belonging to that city, and SHALL identify any incomplete or invalid location.

#### Scenario: Submit with a missing district
- **WHEN** the user attempts to view recommendations with either district unselected
- **THEN** the form remains on the request step and shows validation feedback for the affected location

#### Scenario: Submit with valid locations
- **WHEN** the user submits the request with a valid city and matching district at both locations
- **THEN** the form accepts the locations and advances to recommendations

### Requirement: Carry selected locations through the request flow
The system SHALL use the selected origin and destination city and district in request summaries, generated inquiry content, and saved inquiry records.

#### Scenario: Continue with selected locations
- **WHEN** the user advances with valid locations and views a summary, generated inquiry, or saved request
- **THEN** each view presents the selected city and district for both locations

#### Scenario: Resume a saved request
- **WHEN** the user resumes a saved request
- **THEN** the origin and destination city and district selections are restored
