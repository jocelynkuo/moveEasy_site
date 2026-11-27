# Proposal

## Why

The moving request form currently asks users to type origin and destination districts, so values can be inconsistent and may not belong to the selected city. The location controls should guide users with valid, city-specific choices and make the form easier to complete.

## What Changes

- Replace the origin and destination district text fields with selectable menus populated for the corresponding selected city.
- Keep each origin and destination city/district selection independent; changing a city clears an incompatible district and prompts the user to choose a valid one.
- Improve the request form's location validation and feedback so users can tell which location still needs a selection.
- Preserve selected location values in request summaries and saved inquiry history.

## Capabilities

### New Capabilities

- `moving-request-form`: Captures a moving request, including valid city and district selections at both ends of the route.

### Modified Capabilities

None.

## Impact

- `src/main.jsx`: request-form location controls, dependent selection behavior, and validation.
- `src/styles.css`: location select presentation and responsive form layout as needed.
- New `openspec/specs/moving-request-form/spec.md` capability requirements.
- No API or external dependency changes are expected. The current city menu contains Taipei City, New Taipei City, and Taoyuan City; district options should cover the districts of those supported cities unless the product scope is expanded.
