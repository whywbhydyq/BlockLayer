import type { GridBounds } from './types';
import { axisCoords, boundsFromSizes } from './utils';

export function boundsForDiameter(diameter: number): GridBounds {
  return boundsFromSizes(diameter, diameter);
}

export function boundsForEllipse(width: number, height: number): GridBounds {
  return boundsFromSizes(width, height);
}

export function inclusiveSize(min: number, max: number): number {
  return Math.abs(max - min) + 1;
}

export function coordinateRange(size: number): number[] {
  return axisCoords(size);
}
