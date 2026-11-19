import { describe, it, expect } from 'vitest';
import { calculateCompoundInterest, calculateLoanEmi } from './logic';

describe('Finance Suite Logic (Verified against Known Financial Benchmarks)', () => {
  it('calculates compound interest accurately for known reference benchmarks', () => {
    // $10,000 at 5% compounded monthly for 10 years -> $16,470.09
    const val = calculateCompoundInterest(10000, 5, 10, 12);
    expect(val).toBe(16470.09);

    // $1,000 at 7% compounded annually for 5 years -> $1,402.55
    const val2 = calculateCompoundInterest(1000, 7, 5, 1);
    expect(val2).toBe(1402.55);
  });

  it('calculates standard loan amortization EMI against banking benchmark', () => {
    // $100,000 mortgage at 6% for 30 years -> $599.55/month
    const emi = calculateLoanEmi(100000, 6, 30);
    expect(emi).toBe(599.55);

    // Zero interest loan: $12,000 for 1 year -> $1,000/month
    const zeroInterestEmi = calculateLoanEmi(12000, 0, 1);
    expect(zeroInterestEmi).toBe(1000);
  });
});
