export type TemplateVars = Record<string, string>;

export function applyTemplate(content: string, vars: TemplateVars): string {
  let out = content;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, value);
  }
  return out;
}