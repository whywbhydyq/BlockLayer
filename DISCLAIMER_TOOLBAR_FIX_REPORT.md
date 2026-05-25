# Fast UI Fix Report

Scope:
- Removed the global unofficial disclaimer bar from the app layout because it occupied vertical workspace and blocked the blueprint area at high zoom.
- Kept legal/disclaimer pages and footer links intact.
- Made the blueprint toolbar wrap naturally instead of clipping buttons when the browser is zoomed or translated text becomes longer.
- Removed fixed toolbar height and changed the blueprint workspace overflow so wrapped controls do not get hidden inside the card.

Validation:
- Per user instruction, no tests, lint, typecheck, audit, browser check, or build were run.
