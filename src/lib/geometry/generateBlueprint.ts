import { generateCircle } from './circle';
import { generateDome } from './dome';
import { generateEllipse } from './ellipse';
import { generateSphere } from './sphere';
import type { BlueprintResult, BuildDirection, DomeHalf, FillMode, InputMode, ShapeKind, SolidMode } from './types';

export type BlueprintInputState = {
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
};

export function generateBlueprint(state: BlueprintInputState): BlueprintResult {
  if (state.shape === 'ellipse') {
    return generateEllipse({ width: state.width, height: state.height, fillMode: state.fillMode, thickness: state.thickness });
  }
  if (state.shape === 'sphere') {
    return generateSphere({
      inputMode: state.inputMode,
      diameter: state.diameter,
      radius: state.radius,
      mode: state.solidMode,
      shellThickness: state.shellThickness,
      buildDirection: state.buildDirection
    });
  }
  if (state.shape === 'dome') {
    return generateDome({
      inputMode: state.inputMode,
      diameter: state.diameter,
      radius: state.radius,
      mode: state.solidMode,
      shellThickness: state.shellThickness,
      buildDirection: state.buildDirection,
      capHeight: state.capHeight,
      half: state.domeHalf
    });
  }
  return generateCircle({
    inputMode: state.inputMode,
    diameter: state.diameter,
    radius: state.radius,
    fillMode: state.fillMode,
    thickness: state.thickness
  });
}
