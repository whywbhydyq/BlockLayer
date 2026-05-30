export type ToolContentKey =
  | 'home'
  | 'circle'
  | 'oval'
  | 'sphere'
  | 'dome'
  | 'block-count'
  | 'pixel-circle'
  | 'center-guide'
  | 'layered-sphere'
  | 'dome-blueprint'
  | 'preset';

export type ToolContentPackage = {
  key: ToolContentKey;
  intro: string;
  howToTitle: string;
  howToSteps: string[];
  outputsTitle: string;
  outputs: string[];
  tipsTitle: string;
  tips: string[];
  faq: Array<[string, string]>;
  links: Array<{ label: string; href: string }>;
};
