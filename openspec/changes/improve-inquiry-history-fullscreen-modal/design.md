# Design

## Context

See proposal.md for the motivation and specs/workflow-navigation/spec.md for the observable behavior. The app currently switches its main content to `History` while keeping the shared header and footer visible. Workflow stage and form data already remain in React state while the history view is open.

## Goals / Non-Goals

**Goals:**
- Present inquiry history as a viewport-filling layer with its own top bar and close control.
- Keep history content scrollable on short screens while the modal occupies the full screen.
- Closing the view restores the existing workflow stage and its current state.

**Non-Goals:**
- Change how records are saved, listed, deleted, or resumed.
- Change navigation between the five workflow stages.
- Add browser URL or browser-history routing for the modal.

## Decisions

- Render the history view as a fixed, full-viewport layer at the application level. Hide the progress bar, workflow page content, and footer, while retaining the shared application header as the modal's top bar. Keep the workflow state mounted in `App`; opening history changes only the visible layer, and closing it restores the prior stage without reconstructing its data.
- Reuse the shared header's existing top-right “詢價紀錄” control as the modal toggle: show its X state and accessible name “關閉詢價紀錄” while history is open, then restore the “詢價紀錄” label and icon when closed. Do not add a separate close button. Use dialog semantics, move focus to the control's X state when history opens, and restore focus to that same control after closing.
- Let the modal body scroll independently beneath the header and prevent background page scrolling while it is open. On narrow screens, retain edge-to-edge coverage and keep the close target comfortably tappable.
- Keep selecting “繼續這筆詢價” and “建立搬家需求” as explicit actions that close history and restore or reset the workflow, respectively. The X control only dismisses history and must not change the active record or stage.

Alternatives considered:
- Continue rendering history as an ordinary page between the shared header and footer: rejected because it does not cover the viewport or hide the underlying workflow context.
- Navigate to a separate history route: rejected because the app currently uses in-memory workflow state and does not have URL routing; a route would add unrelated navigation and restoration complexity.

## Risks / Trade-offs

- **A fixed layer may not cover content if a parent creates a stacking context** → Mount it directly under the app shell/root and use a viewport-level stacking order.
- **Long history lists can make the close control scroll away** → Keep the shared header outside the independently scrolling history body.
- **The shared header serves as both the history trigger and close control** → Keep it visible as modal chrome and update the same control's icon, accessible name, and action together so users always have one clear exit.

## Migration Plan

No data migration is needed. Replace the current history content switch with the full-screen presentation while retaining existing history callbacks. Rollback can restore the prior conditional history view without changing stored records.
