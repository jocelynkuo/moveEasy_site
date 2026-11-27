# Design

## Context

The request form stores origin and destination city and district values separately. The supported-city district map in `src/main.jsx` provides the option set; form updates already clear a district when its city changes, and submission validates both city and district pairs. See proposal.md for the motivation and the spec delta for required behavior.

## Goals / Non-Goals

**Goals:**
- Use the supported-city district map consistently for menus and validation.
- Preserve independently selected route endpoints in the existing request and history data flow.

**Non-Goals:**
- Expand supported cities, change the request data shape, or add an external location service.
- Change recommendation, inquiry, or history behavior beyond displaying and retaining the selected locations.

## Decisions

- Keep district options as a local city-to-district map because the supported city set is small and already defined in the application. A remote lookup would add a dependency and failure mode without improving this scoped flow.
- Use controlled select menus for each endpoint and derive both menus from their own selected city. When a city changes, clear its district only if that value is not valid for the new city; this avoids stale selections while leaving the other endpoint untouched.
- Validate the selected district against the same map used to populate the menu. This prevents a stale or malformed value from advancing even if it bypasses normal selection.
- Keep the existing form and history record shape. The selected city and district values already flow through summaries, generated inquiry text, and saved request snapshots, so a data migration is unnecessary.

## Risks / Trade-offs

- [The local district list can become outdated] → Keep the map as the single source for menu choices and validation, and update it when supported-city coverage changes.
- [Clearing an invalid district requires the user to choose again] → Clear only the affected endpoint and show endpoint-specific validation feedback on submission.

## Migration Plan

No data migration is required. Existing supported city and district strings remain compatible with saved requests. Rollback consists of restoring text entry for the district fields and the previous location validation.
