import type { BuildDirection, DomeHalf, FillMode, InputMode, ShapeKind, SolidMode } from '@/lib/geometry';

export type FormState = {
  shape: ShapeKind;
  inputMode: InputMode;
  diameter: number;
  radius: number;
  width: number;
  height: number;
  fillMode: FillMode;
  solidMode: SolidMode;
  thickness: number;
  shellThickness: number;
  capHeight: number;
  buildDirection: BuildDirection;
  domeHalf: DomeHalf;
  showCoordinates: boolean;
  showSegments: boolean;
  showGhost: boolean;
  highContrast: boolean;
};

export type ToolShellProps = {
  initialShape?: ShapeKind;
  initialDiameter?: number;
  initialWidth?: number;
  initialHeight?: number;
  title?: string;
};

export type UpdateFormState = <K extends keyof FormState>(key: K, value: FormState[K]) => void;

export const shapeLabels: Record<ShapeKind, string> = {
  circle: 'Circle',
  ellipse: 'Ellipse / Oval',
  sphere: 'Sphere',
  dome: 'Dome'
};

export const defaultFormState: FormState = {
  shape: 'circle',
  inputMode: 'diameter',
  diameter: 16,
  radius: 8,
  width: 16,
  height: 16,
  fillMode: 'outline',
  solidMode: 'hollow',
  thickness: 1,
  shellThickness: 1,
  capHeight: 16,
  buildDirection: 'bottom-up',
  domeHalf: 'top',
  showCoordinates: true,
  showSegments: true,
  showGhost: true,
  highContrast: false
};

export function parseNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function initialFormState(props: ToolShellProps): FormState {
  const diameter = props.initialDiameter || defaultFormState.diameter;
  return {
    ...defaultFormState,
    shape: props.initialShape || defaultFormState.shape,
    diameter,
    radius: Math.floor(diameter / 2),
    width: props.initialWidth || defaultFormState.width,
    height: props.initialHeight || defaultFormState.height,
    capHeight: Math.ceil(diameter / 2)
  };
}
