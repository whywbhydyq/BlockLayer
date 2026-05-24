export type ShapeKind = 'circle' | 'ellipse' | 'sphere' | 'dome';
export type InputMode = 'diameter' | 'radius';
export type FillMode = 'outline' | 'filled';
export type SolidMode = 'hollow' | 'solid';
export type BuildDirection = 'bottom-up' | 'top-down';
export type DomeHalf = 'top' | 'bottom';
export type InclusionMode = 'center' | 'inner-corner' | 'outer-corner';
export type CenterType = 'single-block' | 'between-blocks';
export type CellRole = 'outline' | 'fill' | 'ghost' | 'center' | 'axis';

export type GridCell = {
  x: number;
  z: number;
  filled: boolean;
  role: CellRole;
};

export type Segment = { startX: number; endX: number; length: number };
export type RowSegment = { z: number; segments: Segment[]; blockCount: number };
export type GridBounds = { minX: number; maxX: number; minZ: number; maxZ: number; width: number; height: number };

export type StackCount = {
  totalBlocks: number;
  fullStacks: number;
  remainder: number;
  totalStacksRoundedUp: number;
  shulkerBoxes: number;
  shulkerRemainderStacks: number;
};

export type BlueprintWarningCode =
  | 'INPUT_CLAMPED'
  | 'EVEN_CENTER'
  | 'ODD_CENTER'
  | 'LARGE_BLUEPRINT'
  | 'PERFORMANCE_DEGRADED'
  | 'EXPORT_TOO_LARGE'
  | 'PRINT_TOO_MANY_PAGES'
  | 'CUSTOM_HEIGHT_CLAMPED';

export type BlueprintWarning = {
  code: BlueprintWarningCode;
  message: string;
  severity: 'info' | 'warning' | 'error';
};

export type BaseResult = {
  shape: ShapeKind;
  title: string;
  dimensions: { width: number; height: number; depth?: number };
  centerType: CenterType;
  totalBlocks: number;
  stacks: StackCount;
  warnings: BlueprintWarning[];
  generatedAt: string;
};

export type TwoDimensionalResult = BaseResult & {
  shape: 'circle' | 'ellipse';
  cells: GridCell[];
  rows: RowSegment[];
  bounds: GridBounds;
  outlineBlocks: number;
  filledBlocks: number;
};

export type LayerBlueprint = {
  index: number;
  y: number;
  label: string;
  cells: GridCell[];
  rows: RowSegment[];
  bounds: GridBounds;
  blockCount: number;
  localRadius: number;
  isCenterLayer: boolean;
};

export type LayeredResult = BaseResult & {
  shape: 'sphere' | 'dome';
  layers: LayerBlueprint[];
  layerCount: number;
  mode: SolidMode;
  shellThickness: number;
  buildDirection: BuildDirection;
};

export type BlueprintResult = TwoDimensionalResult | LayeredResult;

export type CircleParams = {
  inputMode: InputMode;
  diameter: number;
  radius: number;
  fillMode: FillMode;
  thickness: number;
};

export type EllipseParams = {
  width: number;
  height: number;
  fillMode: FillMode;
  thickness: number;
};

export type SphereParams = {
  inputMode: InputMode;
  diameter: number;
  radius: number;
  mode: SolidMode;
  shellThickness: number;
  buildDirection: BuildDirection;
};

export type DomeParams = SphereParams & {
  capHeight: number;
  half: DomeHalf;
};
