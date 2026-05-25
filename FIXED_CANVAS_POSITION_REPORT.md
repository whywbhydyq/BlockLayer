# Fixed Canvas Position Pass

Scope: user reported that the blueprint can be dragged out of place after resizing/zooming.

Changes made:

- Disabled mouse/pointer panning on the blueprint canvas.
- Kept wheel zoom and touch pinch zoom.
- Kept the existing Fit button as the recenter/reset control.
- Updated the canvas aria label to state that the blueprint is fixed in place.
- Changed the canvas cursor from grab/grabbing to default so users no longer expect dragging.

Validation policy:

- Per user instruction, no test, lint, typecheck, build, browser check, or audit command was run.
