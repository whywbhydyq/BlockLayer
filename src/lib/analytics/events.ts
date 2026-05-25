import type { ShapeKind } from '@/lib/geometry';

export type ToolEventName =
  | 'tool_view'
  | 'shape_changed'
  | 'params_changed'
  | 'generate_success'
  | 'large_blueprint_warning'
  | 'layer_changed'
  | 'zoom_used'
  | 'pan_used'
  | 'fit_to_screen_clicked'
  | 'download_png_clicked'
  | 'download_svg_clicked'
  | 'download_csv_clicked'
  | 'print_clicked'
  | 'copy_summary_clicked'
  | 'copy_row_list_clicked'
  | 'copy_layer_summary_clicked'
  | 'copy_share_url_clicked'
  | 'faq_opened'
  | 'related_tool_clicked'
  | 'related_guide_clicked'
  | 'affiliate_clicked'
  | 'ad_slot_viewed';

export type ToolEventPayload = Record<string, string | number | boolean | undefined> & { shape?: ShapeKind };

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const legacyEventMap: Partial<Record<string, ToolEventName>> = {
  generate: 'params_changed',
  shape_switch: 'shape_changed',
  layer_change: 'layer_changed',
  export_png: 'download_png_clicked',
  export_svg: 'download_svg_clicked',
  export_csv: 'download_csv_clicked',
  print: 'print_clicked',
  copy_row_list: 'copy_row_list_clicked',
  copy_layer_summary: 'copy_layer_summary_clicked',
  copy_share_url: 'copy_share_url_clicked'
};

export function normalizeToolEventName(name: ToolEventName | string): ToolEventName {
  return (legacyEventMap[name] || name) as ToolEventName;
}

export function trackToolEvent(name: ToolEventName | string, payload: ToolEventPayload = {}) {
  if (typeof window === 'undefined') return;
  const normalizedName = normalizeToolEventName(name);
  const event = { event: `blocklayer_${normalizedName}`, event_name: normalizedName, ...payload };
  window.dispatchEvent(new CustomEvent('blocklayer:analytics', { detail: event }));
  window.dataLayer?.push(event);
}
