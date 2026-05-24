import { countStacks, generateCircle, generateDome, generateEllipse, generateSphere } from '../src/lib/geometry';
import { boundsForDiameter, coordinateRange, inclusiveSize } from '../src/lib/geometry/bounds';
import { isInsideCircle, isInsideEllipse, isInsideSphere } from '../src/lib/geometry/inclusion';
import { circleFixtures, domeFixtures, ellipseFixtures, sphereFixtures } from '../src/lib/geometry/tests-fixtures';

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

for (const diameter of [1, 2, 3, 5, 10, 32, 64, 257]) {
  const circle = generateCircle({ inputMode: 'diameter', diameter, radius: Math.floor(diameter / 2), fillMode: 'outline', thickness: 1 });
  assert(circle.shape === 'circle', `circle ${diameter} shape mismatch`);
  assert(circle.bounds.width === diameter, `circle ${diameter} diameter bounds mismatch`);
  assert(circle.bounds.height === diameter, `circle ${diameter} height bounds mismatch`);
  assert(circle.totalBlocks > 0, `circle ${diameter} should have blocks`);
  assert(circle.rows.length > 0, `circle ${diameter} should have row segments`);
}

const oneCircle = generateCircle({ inputMode: 'diameter', diameter: 1, radius: 0, fillMode: 'outline', thickness: 1 });
assert(oneCircle.totalBlocks === 1, 'diameter 1 circle should contain one block');
const twoCircle = generateCircle({ inputMode: 'diameter', diameter: 2, radius: 1, fillMode: 'outline', thickness: 1 });
assert(twoCircle.centerType === 'between-blocks', 'diameter 2 circle should have between-blocks center');
const oddCircle = generateCircle({ inputMode: 'diameter', diameter: 31, radius: 15, fillMode: 'outline', thickness: 1 });
assert(oddCircle.centerType === 'single-block', '31 circle should have single center');
const filledCircle = generateCircle({ inputMode: 'diameter', diameter: 10, radius: 5, fillMode: 'filled', thickness: 1 });
assert(filledCircle.filledBlocks >= filledCircle.outlineBlocks, 'filled circle should have filled block count at least outline count');
const largeCircle = generateCircle({ inputMode: 'diameter', diameter: 257, radius: 128, fillMode: 'outline', thickness: 1 });
assert(largeCircle.warnings.some((warning) => warning.code === 'LARGE_BLUEPRINT'), '257 circle should warn as large');

for (const [width, height] of [[1, 1], [10, 5], [11, 5], [64, 32]]) {
  const ellipse = generateEllipse({ width, height, fillMode: 'filled', thickness: 1 });
  assert(ellipse.shape === 'ellipse', `ellipse ${width}x${height} shape mismatch`);
  assert(ellipse.bounds.width === width && ellipse.bounds.height === height, `ellipse ${width}x${height} bounds mismatch`);
  assert(ellipse.totalBlocks > 0, `ellipse ${width}x${height} should have blocks`);
}
const clampedEllipse = generateEllipse({ width: -8, height: Number.NaN, fillMode: 'outline', thickness: 99 });
assert(clampedEllipse.bounds.width === 1 && clampedEllipse.bounds.height === 1, 'invalid ellipse dimensions should clamp to one block minimum');

for (const diameter of [1, 2, 3, 5, 16, 32]) {
  const sphere = generateSphere({ inputMode: 'diameter', diameter, radius: Math.floor(diameter / 2), mode: 'hollow', shellThickness: 1, buildDirection: 'bottom-up' });
  assert(sphere.shape === 'sphere', `sphere ${diameter} shape mismatch`);
  assert(sphere.layerCount === diameter, `sphere ${diameter} layer count should match diameter`);
  assert(sphere.totalBlocks === sphere.layers.reduce((sum, layer) => sum + layer.blockCount, 0), `sphere ${diameter} total should equal sum of layers`);
}
const sphere64 = generateSphere({ inputMode: 'diameter', diameter: 64, radius: 32, mode: 'hollow', shellThickness: 1, buildDirection: 'top-down' });
assert(sphere64.layerCount === 64, '64 sphere should have 64 layers');
assert(sphere64.buildDirection === 'top-down', 'sphere should preserve top-down order');

for (const diameter of [16, 32, 64]) {
  const dome = generateDome({ inputMode: 'diameter', diameter, radius: Math.floor(diameter / 2), mode: 'hollow', shellThickness: 1, buildDirection: 'bottom-up', capHeight: Math.ceil(diameter / 2), half: 'top' });
  assert(dome.shape === 'dome', `dome ${diameter} shape mismatch`);
  assert(dome.layerCount > 0, `dome ${diameter} should have layers`);
  assert(dome.totalBlocks === dome.layers.reduce((sum, layer) => sum + layer.blockCount, 0), `dome ${diameter} total should equal sum of layers`);
}
const clampedDome = generateDome({ inputMode: 'diameter', diameter: 16, radius: 8, mode: 'hollow', shellThickness: 1, buildDirection: 'bottom-up', capHeight: 999, half: 'top' });
assert(clampedDome.warnings.some((warning) => warning.code === 'CUSTOM_HEIGHT_CLAMPED'), 'too-tall dome cap should be clamped');

assert(boundsForDiameter(5).width === 5, 'bounds helper should preserve diameter');
assert(coordinateRange(4)[0] === -2 && coordinateRange(4)[3] === 1, 'even coordinate range should be inclusive and centered between blocks');
assert(inclusiveSize(-2, 2) === 5, 'inclusive size helper should count both ends');
assert(isInsideCircle(0, 0, 1), 'circle inclusion should include origin');
assert(isInsideEllipse(0, 0, 2, 1), 'ellipse inclusion should include origin');
assert(isInsideSphere(0, 0, 0, 1), 'sphere inclusion should include origin');
assert(circleFixtures.length >= 8 && ellipseFixtures.length >= 3 && sphereFixtures.length >= 7 && domeFixtures.length >= 3, 'geometry fixtures should cover documented dimensions');

const stacks = countStacks(130);
assert(stacks.fullStacks === 2 && stacks.remainder === 2 && stacks.totalStacksRoundedUp === 3, 'stack count mismatch');

console.log('geometry tests passed');
