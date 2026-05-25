# Responsive Canvas Fix Report

No tests were run per user instruction.

Changes made:

- Changed default Circle diameter from 31 to 16.
- Changed reset/default radius to 8 and default oval size to 16 x 16.
- Updated quick diameter chips to include 16.
- Added ResizeObserver-based canvas refit so the blueprint redraws when the page or viewport width changes. This prevents the canvas bitmap from being visually stretched when the browser is resized or the page is zoomed.

Deployment note:

- If an old share URL contains `?d=14`, that URL will still restore diameter 14 by design. A fresh `/` or `/minecraft-circle-generator` visit now defaults to 16.
