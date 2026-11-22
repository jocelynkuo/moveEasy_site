# Tasks

## 1. Full-screen history modal behavior

- [x] 1.1 Render inquiry history as a viewport-filling dialog that retains the shared header and hides the progress indicator, workflow content, and footer; verify the existing top-right “詢價紀錄” control becomes the only visible X close control.
- [x] 1.2 Make the same header control close history and restore its “詢價紀錄” label and icon without changing the active workflow stage or its in-progress data; preserve the existing resume and create-new actions, and verify each restores or resets the workflow as intended.
- [x] 1.3 Manage modal focus and background scrolling while open, then restore focus to the same header control when dismissed; verify its X state remains usable with keyboard and touch.

## 2. Full-screen layout

- [x] 2.1 Style the dialog to cover the viewport at desktop and mobile sizes, keep the shared header and toggled close control visible, and scroll the history list independently; verify no underlying workflow components or footer show through and long lists remain reachable.
