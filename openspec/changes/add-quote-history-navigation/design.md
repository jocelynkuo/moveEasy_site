# Design

## Context

MoveEasy is a single React entry point whose workflow data is held in independent `useState` values and whose current screen is selected by a numeric step. There is no router, durable storage, or record identity. Existing back controls either sit at the bottom of a page or return to the immediately preceding step, which conflicts with the requested recommendation-centric navigation. See `proposal.md` for motivation and the two delta specs for observable behavior.

## Goals / Non-Goals

**Goals:**

- Introduce a stable record identity that separates different moving requests.
- Persist enough state to resume inquiry and quote work without a backend.
- Centralize transitions so explicit back controls, the progress indicator, and history resumption cannot produce conflicting state.
- Keep the implementation compatible with the current single-page, dependency-light prototype.
- Make the new history and navigation UI responsive and keyboard accessible.

**Non-Goals:**

- Cross-device synchronization, accounts, cloud storage, or multi-user access.
- Permanent retention guarantees or migration of data beyond this prototype's schema version.
- Browser URL routing or deep links to individual records.
- Automatic sending of inquiry messages or real AI quote extraction.
- Deleting, duplicating, or renaming history records in this change.

## Decisions

### 1. Use a versioned record envelope in localStorage

Store records under one namespaced key with an envelope such as `{ version: 1, records: [] }`. Each record contains `id`, `createdAt`, `updatedAt`, `lastCompletedStep`, `form`, `selectedCompanyId`, `message`, `quoteDraft`, `parsedQuote`, and `quotes`.

This creates an explicit compatibility boundary and makes malformed-data handling deterministic. Separate localStorage keys per record were considered but rejected because listing, ordering, and version validation would require scanning and coordinating multiple keys.

### 2. Separate the active workflow snapshot from the history collection

Keep the existing React state as the immediate UI source of truth. Add `activeRecordId` and a history collection initialized through a safe localStorage reader. A single snapshot builder converts current UI state into a record, and a single restore function hydrates all related state from a chosen record.

Writing every field directly to localStorage from individual input handlers was rejected because it would duplicate persistence logic and increase the risk of partially updated records.

### 3. Create records at the validated form boundary

After form validation succeeds and before recommendations render, create a new record only when `activeRecordId` is absent. Revisiting recommendations for an existing active record updates that record. Starting a new request clears `activeRecordId` and resets workflow state.

This boundary matches the user's explicit intent to request recommendations and prevents incomplete form drafts from polluting history.

### 4. Persist on meaningful state transitions and editable-state changes

Persist when a record is created, a vendor is selected, the inquiry message changes, quote draft or parsed data changes, a confirmed quote changes, the active stage advances, or the user opens history. Use a React effect scoped to the active record so rapid edits converge on the latest complete snapshot. Catch read and write errors and retain in-memory state.

Persisting only when leaving a page was rejected because browser closure or refresh could lose recent edits.

### 5. Model history as a view outside the five-step sequence

Represent the visible page with a workflow step plus a separate `historyOpen` view flag (or equivalent discriminated view state). The progress indicator remains hidden or visually inactive on history because history is not a sixth step. The header owns the global history action.

Adding history as step 6 was rejected because it would imply task progression rather than cross-record navigation.

### 6. Centralize recommendation-return navigation

Define one transition that snapshots the active record and navigates to step 1 (recommendations). Use it for the inquiry arrow, quote-organization link, and comparison link. Place a reusable back-control component before each page intro so the control is consistently located at the top-left of the content container.

Using browser history was rejected because the application has no URL-based router and browser history could navigate away from the product.

### 7. Resume at the latest completed stage

Store a bounded numeric `lastCompletedStep` from 1 through 4. Selecting a history record hydrates its snapshot, closes history, and opens that stage. Records created at the validation boundary resume at recommendations. Navigation backward does not reduce the stored latest completed stage.

This preserves progress while still allowing users to revisit recommendations without making future resumption unexpectedly jump backward.

## Risks / Trade-offs

- **[Local data can be cleared or unavailable]** → Label history as stored on this browser and keep the in-memory workflow usable after storage errors.
- **[Record schema may evolve]** → Validate a versioned envelope and ignore unsupported or malformed data instead of partially hydrating it.
- **[Frequent writes during text editing]** → Persist a small prototype payload only; use a short debounce if interaction testing shows noticeable overhead.
- **[Existing monolithic component will gain more orchestration]** → Extract small persistence helpers and focused history/back-control components without introducing a new state library.
- **[Dates and timestamps can render inconsistently]** → Store ISO timestamps and format them at display time using the user's locale.
- **[Returning to recommendations while a quote editor is open can surprise users]** → Preserve draft and parsed states exactly as specified, with no destructive confirmation dialog.

## Migration Plan

1. Add safe storage helpers and the versioned record model without changing current navigation.
2. Connect record creation and snapshot updates to the existing workflow.
3. Add the history view and restore transition.
4. Replace page-specific back behavior with the centralized recommendation-return transition.
5. Add responsive styling and verify the complete flow, reload persistence, empty state, malformed storage fallback, and multiple-record resumption.

Rollback consists of removing history initialization, persistence effects, and new navigation components. Existing in-memory workflow state remains the fallback, and the unused namespaced localStorage entry can be left harmlessly in place or cleared manually during development.
