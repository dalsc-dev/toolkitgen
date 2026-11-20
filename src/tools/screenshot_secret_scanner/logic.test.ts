import { describe, it, expect } from 'vitest';
import { scanTextForSecrets, createRedactionBox } from './logic';

describe('Screenshot Sensitive Data & Secret Scanner Logic', () => {
  it('detects OpenAI project API keys and masks preview', () => {
    const text = 'Here is the key: sk-proj-1234567890abcdef1234567890abcdef1234567890abcdef for testing';
    const secrets = scanTextForSecrets(text);

    expect(secrets.length).toBe(1);
    expect(secrets[0].name).toBe('OpenAI API Key');
    expect(secrets[0].severity).toBe('Critical');
    expect(secrets[0].maskedPreview).toContain('sk-p...[REDACTED]...def');
  });

  it('detects AWS access keys and GitHub PATs', () => {
    const text = 'Export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE and GITHUB_TOKEN=ghp_123456789012345678901234567890123456';
    const secrets = scanTextForSecrets(text);

    expect(secrets.length).toBe(2);
    const aws = secrets.find((s) => s.name === 'AWS Access Key ID');
    const ghp = secrets.find((s) => s.name === 'GitHub Personal Access Token');

    expect(aws).toBeDefined();
    expect(ghp).toBeDefined();
  });

  it('detects private key blocks', () => {
    const text = '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0...';
    const secrets = scanTextForSecrets(text);

    expect(secrets.length).toBe(1);
    expect(secrets[0].name).toBe('Private Key Block');
  });

  it('validates credit card numbers with Luhn algorithm', () => {
    // Valid sample Luhn Visa: 4532 0151 1283 0366
    const textValid = 'Payment card: 4532 0151 1283 0366';
    const secretsValid = scanTextForSecrets(textValid);
    expect(secretsValid.some((s) => s.name === 'Credit Card Number')).toBe(true);

    // Invalid Luhn 16-digit sequence
    const textInvalid = 'Not a card: 1111 2222 3333 4441';
    const secretsInvalid = scanTextForSecrets(textInvalid);
    expect(secretsInvalid.some((s) => s.name === 'Credit Card Number')).toBe(false);
  });

  it('creates clean redaction box coordinates', () => {
    const box = createRedactionBox(10.4, 20.6, 100.2, 50.8, 'blur');
    expect(box.x).toBe(10);
    expect(box.y).toBe(21);
    expect(box.width).toBe(100);
    expect(box.height).toBe(51);
    expect(box.style).toBe('blur');
  });
});
