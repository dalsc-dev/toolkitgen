export const SENSITIVE_HEADERS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'proxy-authorization',
  'x-auth-token',
  'x-api-key',
  'apikey'
]);

export function sanitizeHarEntry(entry: any): { strippedHeaders: number; strippedCookies: number } {
  let strippedHeaders = 0;
  let strippedCookies = 0;

  if (entry.request) {
    if (Array.isArray(entry.request.headers)) {
      entry.request.headers = entry.request.headers.map((h: any) => {
        if (SENSITIVE_HEADERS.has(h.name.toLowerCase())) {
          strippedHeaders++;
          return { name: h.name, value: '[REDACTED_BY_TOOLKITGEN]' };
        }
        return h;
      });
    }
    if (Array.isArray(entry.request.cookies)) {
      strippedCookies += entry.request.cookies.length;
      entry.request.cookies = [];
    }
  }

  if (entry.response) {
    if (Array.isArray(entry.response.headers)) {
      entry.response.headers = entry.response.headers.map((h: any) => {
        if (SENSITIVE_HEADERS.has(h.name.toLowerCase())) {
          strippedHeaders++;
          return { name: h.name, value: '[REDACTED_BY_TOOLKITGEN]' };
        }
        return h;
      });
    }
    if (Array.isArray(entry.response.cookies)) {
      strippedCookies += entry.response.cookies.length;
      entry.response.cookies = [];
    }
  }

  return { strippedHeaders, strippedCookies };
}

export function sanitizeEntireHar(harJson: any): { sanitized: any; totalStrippedHeaders: number; totalStrippedCookies: number } {
  if (!harJson || !harJson.log || !Array.isArray(harJson.log.entries)) {
    return { sanitized: harJson, totalStrippedHeaders: 0, totalStrippedCookies: 0 };
  }

  let totalStrippedHeaders = 0;
  let totalStrippedCookies = 0;

  for (const entry of harJson.log.entries) {
    const { strippedHeaders, strippedCookies } = sanitizeHarEntry(entry);
    totalStrippedHeaders += strippedHeaders;
    totalStrippedCookies += strippedCookies;
  }

  return { sanitized: harJson, totalStrippedHeaders, totalStrippedCookies };
}
