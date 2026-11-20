export const SENSITIVE_PDF_FIELDS = [
  'Title',
  'Author',
  'Subject',
  'Keywords',
  'Creator',
  'Producer',
  'CreationDate',
  'ModDate'
];

export function sanitizeInfoDictionary(info: Record<string, string>): { sanitized: Record<string, string>; strippedCount: number } {
  const sanitized: Record<string, string> = {};
  let strippedCount = 0;
  for (const [key, val] of Object.entries(info)) {
    if (SENSITIVE_PDF_FIELDS.includes(key)) {
      strippedCount++;
    } else {
      sanitized[key] = val;
    }
  }
  return { sanitized, strippedCount };
}

export function redactStringMetadata(rawText: string): string {
  let cleaned = rawText;
  cleaned = cleaned.replace(/\/(Author|Creator|Producer|Keywords|Subject)\s*\([^)]*\)/gi, '');
  cleaned = cleaned.replace(/\/(CreationDate|ModDate)\s*\(D:[^)]*\)/gi, '');
  return cleaned;
}
