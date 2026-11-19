/**
 * Shannon entropy & password strength estimation.
 * Calculations run in your browser. Inputs are not uploaded.
 */

export interface EntropyResult {
  length: number;
  poolSize: number;
  entropyBits: number;
  hasLower: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  rating: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
}

export function calculatePasswordEntropy(password: string): EntropyResult {
  const length = password.length;
  if (length === 0) {
    return {
      length: 0,
      poolSize: 0,
      entropyBits: 0,
      hasLower: false,
      hasUpper: false,
      hasNumber: false,
      hasSpecial: false,
      rating: 'Very Weak',
    };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSpecial) poolSize += 33; // standard ASCII printable symbols

  // Entropy H = L * log2(R)
  const entropyBits = Math.round(length * Math.log2(poolSize || 1) * 10) / 10;

  let rating: EntropyResult['rating'] = 'Very Weak';
  if (entropyBits >= 80 && length >= 12) {
    rating = 'Very Strong';
  } else if (entropyBits >= 60 && length >= 10) {
    rating = 'Strong';
  } else if (entropyBits >= 45) {
    rating = 'Moderate';
  } else if (entropyBits >= 28) {
    rating = 'Weak';
  }

  return {
    length,
    poolSize,
    entropyBits,
    hasLower,
    hasUpper,
    hasNumber,
    hasSpecial,
    rating,
  };
}
