# Tasks

## 1. History data model and persistence

- [ ] 1.1 Add a versioned localStorage envelope, record validation, safe read/write helpers, and stable record ID creation; verify malformed, unsupported, and unavailable storage paths return a usable empty history without throwing.
- [ ] 1.2 Extend application state with history records and an active record identity, create exactly one record after valid form submission, and verify revisiting recommendations does not increase the record count.
- [ ] 1.3 Build centralized snapshot and restore functions covering form data, vendor selection, inquiry message, quote draft, parsed result, confirmed quotes, timestamps, and latest completed stage; verify a serialized record round-trips to equivalent UI state.
- [ ] 1.4 Persist active-record edits and meaningful stage transitions while keeping in-memory behavior functional on write failure; verify a production build succeeds and recent edits survive a browser reload when storage is available.

## 2. Inquiry history experience

- [ ] 2.1 Add a global “詢價紀錄” header control and view state outside the five numbered steps; verify it is reachable from every workflow stage and history is not rendered as step 6.
- [ ] 2.2 Implement responsive history cards showing moving date, route, progress, quote count, and localized last-update time ordered newest first; verify ordering and displayed summaries with at least two records.
- [ ] 2.3 Add the no-record history state with an action that resets to a new moving request; verify the empty state appears for fresh and invalid localStorage data.
- [ ] 2.4 Implement record resumption through the centralized restore function; verify recommendation-stage and later-stage records reopen at their latest completed stage with saved data intact.

## 3. State-preserving workflow navigation

- [ ] 3.1 Add a reusable top-left back-control pattern and use an arrow-icon “上一頁” control on the inquiry page; verify it returns to recommendations and remains keyboard accessible.
- [ ] 3.2 Add top-left “返回推薦業者” controls to quote organization and comparison; verify both use the centralized recommendation-return transition instead of browser history or the immediately preceding step.
- [ ] 3.3 Preserve selected vendor, edited inquiry message, quote draft, parsed result, and confirmed quotes across every recommendation-return path; verify reopening the relevant stage restores each value without a destructive confirmation dialog.
- [ ] 3.4 Update desktop and mobile styling for the header history action, page-level back controls, history layout, progress labels, and status badges; verify the layout remains readable at desktop and 320px-wide viewport sizes.

## 4. Integrated verification

- [ ] 4.1 Run `npm run build` and verify the Vite production build completes without compilation errors.
- [ ] 4.2 Exercise the complete multi-record flow—create two requests, edit inquiry content, add quotes, return to recommendations, reload, resume both records, and compare quotes—and verify every specified state and navigation outcome remains correct.
- [ ] 4.3 Seed malformed and unsupported-version localStorage payloads, then verify the application loads, shows an empty usable history, and still permits creating a new request.
