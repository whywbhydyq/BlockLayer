export const AD_ELIGIBLE_PATHS = new Set([
  '/',
  '/minecraft-circle-generator',
  '/minecraft-oval-generator',
  '/minecraft-sphere-generator',
  '/minecraft-dome-generator',
  '/minecraft-block-count-calculator'
]);


export function isAdEligiblePath(pathname: string) {
  return AD_ELIGIBLE_PATHS.has(pathname);
}

export function isPresetPath(pathname: string) {
  return pathname.startsWith('/presets/');
}
