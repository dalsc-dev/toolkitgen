/**
 * Screenshot Sensitive Data & Secret Scanner logic
 */

export interface SecretPattern {
  id: string;
  name: string;
  regex: RegExp;
  severity: 'Critical' | 'High' | 'Medium';
}

export const SECRET_PATTERNS: SecretPattern[] = [
  {
    id: 'openai_key',
    name: 'OpenAI API Key',
    regex: /\b(sk-(?:proj-)?[a-zA-Z0-9_-]{40,})\b/g,
    severity: 'Critical',
  },
  {
    id: 'anthropic_key',
    name: 'Anthropic API Key',
    regex: /\b(sk-ant-[a-zA-Z0-9_-]{30,})\b/g,
    severity: 'Critical',
  },
  {
    id: 'aws_access_key',
    name: 'AWS Access Key ID',
    regex: /\b(AKIA[0-9A-Z]{16})\b/g,
    severity: 'Critical',
  },
  {
    id: 'github_pat',
    name: 'GitHub Personal Access Token',
    regex: /\b(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{50,})\b/g,
    severity: 'Critical',
  },
  {
    id: 'google_api_key',
    name: 'Google API Key',
    regex: /\b(AIza[0-9A-Za-z-_]{35})\b/g,
    severity: 'High',
  },
  {
    id: 'slack_token',
    name: 'Slack Token',
    regex: /\b(xox[baprs]-[0-9a-zA-Z-]{20,})\b/g,
    severity: 'High',
  },
  {
    id: 'private_key_header',
    name: 'Private Key Block',
    regex: /-----BEGIN [A-Z\s]+PRIVATE KEY-----/g,
    severity: 'Critical',
  },
  {
    id: 'email_address',
    name: 'Email Address',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    severity: 'Medium',
  },
  {
    id: 'credit_card_luhn',
    name: 'Credit Card Number',
    regex: /\b(?:\d{4}[ -]?){3}\d{4}\b/g,
    severity: 'Critical',
  },
];

export interface DetectedSecret {
  id: string;
  name: string;
  matchedText: string;
  maskedPreview: string;
  startIndex: number;
  endIndex: number;
  severity: 'Critical' | 'High' | 'Medium';
}

function luhnCheck(numStr: string): boolean {
  const digits = numStr.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function maskSecretString(secret: string): string {
  if (secret.length <= 8) {
    return '***REDACTED***';
  }
  const prefix = secret.slice(0, 4);
  const suffix = secret.slice(-3);
  return `${prefix}...[REDACTED]...${suffix}`;
}

export function scanTextForSecrets(text: string): DetectedSecret[] {
  if (!text) return [];

  const results: DetectedSecret[] = [];

  for (const pattern of SECRET_PATTERNS) {
    const matches = text.matchAll(pattern.regex);
    for (const match of matches) {
      const matchedText = match[0];
      const startIndex = match.index || 0;
      const endIndex = startIndex + matchedText.length;

      // Extra check for credit cards to prevent false positives on random 16-digit numbers
      if (pattern.id === 'credit_card_luhn') {
        if (!luhnCheck(matchedText)) continue;
      }

      results.push({
        id: `${pattern.id}_${startIndex}`,
        name: pattern.name,
        matchedText,
        maskedPreview: maskSecretString(matchedText),
        startIndex,
        endIndex,
        severity: pattern.severity,
      });
    }
  }

  return results;
}

export interface RedactionBox {
  x: number;
  y: number;
  width: number;
  height: number;
  style: 'blackout' | 'blur' | 'pixelate';
}

export function createRedactionBox(
  x: number,
  y: number,
  width: number,
  height: number,
  style: 'blackout' | 'blur' | 'pixelate' = 'blackout'
): RedactionBox {
  return {
    x: Math.round(Math.max(0, x)),
    y: Math.round(Math.max(0, y)),
    width: Math.round(Math.max(1, width)),
    height: Math.round(Math.max(1, height)),
    style,
  };
}
