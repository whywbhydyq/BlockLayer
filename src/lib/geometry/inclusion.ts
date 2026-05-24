export function isInsideCircle(dx: number, dz: number, radius: number): boolean {
  return dx * dx + dz * dz <= radius * radius;
}

export function isInsideEllipse(dx: number, dz: number, radiusX: number, radiusZ: number): boolean {
  if (radiusX <= 0 || radiusZ <= 0) return false;
  return (dx * dx) / (radiusX * radiusX) + (dz * dz) / (radiusZ * radiusZ) <= 1;
}

export function isInsideSphere(dx: number, dy: number, dz: number, radius: number): boolean {
  return dx * dx + dy * dy + dz * dz <= radius * radius;
}

export function isInShell(distance: number, radius: number, thickness: number): boolean {
  return distance <= radius && distance >= Math.max(0, radius - thickness);
}
