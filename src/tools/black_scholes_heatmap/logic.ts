// Standard Black-Scholes European Option Pricing Model

function normalCdf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.sqrt(2.0);
  const t = 1.0 / (1.0 + p * absX);
  const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return 0.5 * (1.0 + sign * erf);
}

export function blackScholes(
  s: number, // Spot Price
  k: number, // Strike Price
  t: number, // Time to Maturity in Years
  r: number, // Risk-free rate (decimal, e.g. 0.05 for 5%)
  sigma: number // Volatility (decimal, e.g. 0.2 for 20%)
): { call: number; put: number } {
  if (t <= 0 || sigma <= 0 || s <= 0 || k <= 0) {
    return { call: Math.max(0, s - k), put: Math.max(0, k - s) };
  }

  const d1 = (Math.log(s / k) + (r + (sigma * sigma) / 2) * t) / (sigma * Math.sqrt(t));
  const d2 = d1 - sigma * Math.sqrt(t);

  const call = s * normalCdf(d1) - k * Math.exp(-r * t) * normalCdf(d2);
  const put = k * Math.exp(-r * t) * normalCdf(-d2) - s * normalCdf(-d1);

  return {
    call: Math.round(call * 100) / 100,
    put: Math.round(put * 100) / 100,
  };
}
