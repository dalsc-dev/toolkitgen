import { describe, it, expect } from 'vitest';
import { sanitizeHarEntry, sanitizeEntireHar } from './logic';

describe('HAR Sanitizer & Viewer Logic', () => {
  it('strips authorization and cookie headers from request and response', () => {
    const entry = {
      request: {
        headers: [
          { name: 'Authorization', value: 'Bearer secret_token_xyz' },
          { name: 'Accept', value: 'application/json' }
        ],
        cookies: [{ name: 'session_id', value: '12345' }]
      },
      response: {
        headers: [
          { name: 'Set-Cookie', value: 'jwt=secret_jwt; Secure' }
        ],
        cookies: [{ name: 'jwt', value: 'secret' }]
      }
    };

    const res = sanitizeHarEntry(entry);
    expect(res.strippedHeaders).toBe(2);
    expect(res.strippedCookies).toBe(2);
    expect(entry.request.headers[0].value).toBe('[REDACTED_BY_TOOLKITGEN]');
    expect(entry.request.cookies).toHaveLength(0);
  });

  it('sanitizes full HAR log structures', () => {
    const har = {
      log: {
        entries: [
          {
            request: { headers: [{ name: 'Authorization', value: 'Bearer abc' }] },
            response: { headers: [] }
          }
        ]
      }
    };
    const { totalStrippedHeaders } = sanitizeEntireHar(har);
    expect(totalStrippedHeaders).toBe(1);
  });
});
