import type { CircleParams, DomeParams, EllipseParams, SphereParams } from './types';

export const circleFixtures: CircleParams[] = [1, 2, 3, 5, 10, 32, 64, 257].map((diameter) => ({
  inputMode: 'diameter',
  diameter,
  radius: Math.floor(diameter / 2),
  fillMode: diameter === 10 ? 'filled' : 'outline',
  thickness: 1
}));

export const ellipseFixtures: EllipseParams[] = [
  { width: 10, height: 5, fillMode: 'outline', thickness: 1 },
  { width: 11, height: 5, fillMode: 'outline', thickness: 1 },
  { width: 64, height: 32, fillMode: 'filled', thickness: 1 }
];

export const sphereFixtures: SphereParams[] = [1, 2, 3, 5, 16, 32, 64].map((diameter) => ({
  inputMode: 'diameter',
  diameter,
  radius: Math.floor(diameter / 2),
  mode: 'hollow',
  shellThickness: 1,
  buildDirection: 'bottom-up'
}));

export const domeFixtures: DomeParams[] = [16, 32, 64].map((diameter) => ({
  inputMode: 'diameter',
  diameter,
  radius: Math.floor(diameter / 2),
  mode: 'hollow',
  shellThickness: 1,
  capHeight: Math.ceil(diameter / 2),
  buildDirection: 'bottom-up',
  half: 'top'
}));
