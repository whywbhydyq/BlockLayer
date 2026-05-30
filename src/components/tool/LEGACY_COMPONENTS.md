# Legacy modular tool components

`ToolShell.tsx` is the current server wrapper for homepage and tool pages. `BlueprintWorkspace.tsx` is the active interactive client workspace. Together they own the first-screen task flow, result strip, canvas, exports, companion mode, and selected-range print/CSV workflow.

The components listed below are retained as migration/reference components. They are not the active primary path unless imported by `BlueprintWorkspace.tsx`, `ToolShell.tsx`, or a route-level page:

- `BlueprintTables.tsx`
- `CircleControls.tsx`
- `CoordinateReadout.tsx`
- `DisplayOptions.tsx`
- `DomeControls.tsx`
- `EllipseControls.tsx`
- `ExportPanel.tsx`
- `InputPanel.tsx`
- `LayerSlider.tsx`
- `PresetSelector.tsx`
- `PrintPanel.tsx`
- `ResultsPanel.tsx`
- `ResultsSummary.tsx`
- `RowSegmentTable.tsx`
- `ShapeControls.tsx`
- `ShapeTabs.tsx`
- `SphereControls.tsx`

Migration rule: when a legacy component is reintroduced, first update this file plus `BlueprintWorkspace.tsx` / `ToolShell.tsx` so the component is connected to the current result/export state. Do not create a second parallel builder path with its own stale controls, print behavior, or export assumptions.
