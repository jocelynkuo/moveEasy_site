# Proposal

## Why

MoveEasy's current five-step flow keeps all state only in React memory and offers inconsistent back-navigation, so users can lose context or struggle to return to vendor recommendations while collecting and comparing quotes. Adding persistent request history and predictable navigation will let users pause, resume, and move between key stages without recreating the same moving request.

## What Changes

- Create one saved moving-request record when a valid request advances to vendor recommendations.
- Persist each record in browser local storage and continuously update its inquiry message, selected vendor, confirmed quotes, workflow progress, and last-updated timestamp.
- Add a global inquiry-history entry in the application header and a dedicated history view showing route, moving date, progress, quote count, and last update.
- Allow users to resume a saved record at its last completed workflow stage.
- Add a top-left back control on the inquiry page and explicit “back to recommendations” controls on quote organization and comparison pages.
- Preserve the active record's form, message, and quote state when navigating back to recommendations.
- Keep the existing five-step progress indicator while separating step progress, local back-navigation, and cross-record history navigation.

## Capabilities

### New Capabilities

- `quote-request-history`: Covers creation, local persistence, listing, and resumption of moving-request inquiry records.
- `workflow-navigation`: Covers predictable return paths and state-preserving navigation across recommendation, inquiry, quote organization, comparison, and history views.

### Modified Capabilities

None.

## Impact

- Primary UI and state orchestration in `src/main.jsx`.
- Responsive navigation, history-list, status, and back-control styling in `src/styles.css`.
- Browser `localStorage` becomes the prototype persistence mechanism; no server, account, or database is introduced.
- Existing recommendation, inquiry-message, quote-editing, and comparison behavior must remain functional when records are resumed.
