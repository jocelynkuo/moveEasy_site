# Design

## Context

The application renders five workflow stages and an inquiry history view inside one React app. Major actions use the shared `primary` button styling, including repeated vendor and saved-record actions and state-dependent actions. The header logo currently scrolls to the top; workflow stage and form data are held in `App` state. See proposal.md and the spec deltas for the intended behavior.

## Goals / Non-Goals

**Goals:**
- Keep one visually primary action in each rendered page state.
- Make the shared header logo switch to the first workflow stage without clearing form, quote, or history data.

**Non-Goals:**
- Change workflow rules, labels, data handling, or the behavior of supporting controls beyond their visual emphasis and any duplicate primary presentation that must be resolved.
- Add routes, dependencies, or a new design system.

## Decisions

- Treat the existing `primary` visual treatment as the marker for the page's single CTA. Keep form controls, back navigation, row-level actions, and utility controls in their existing roles, using their existing non-primary treatments where needed. This gives a testable interpretation of CTA without changing the workflow's available actions.
- Choose the page's primary action based on its current state and progression: the action that advances the user's current task gets the primary treatment. Where a page repeats the same action across cards, retain one primary emphasis and show the other instances as supporting actions.
- Handle logo navigation in the application-level state owner: set the workflow stage to the first page and close inquiry history, without invoking the workflow reset path. This preserves in-progress data and works from both workflow and history views.
- Keep the header logo's button semantics and accessible name, and ensure it remains keyboard operable. The navigation behavior changes while its shared header placement remains the same.

## Risks / Trade-offs

- [The most useful primary action can change as page data changes] → Select the primary action from the rendered state and verify both empty and populated variants for the workflow and history pages.
- [Users may confuse returning home with starting over] → Preserve current data when the logo is activated; keep the existing explicit new-request action responsible for starting over.

## Migration Plan

No data migration is needed. Update the existing app in place; rollback consists of restoring the previous button emphasis and logo click handler.
