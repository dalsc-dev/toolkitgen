import { describe, it, expect } from 'vitest';
import { evaluateGate } from './logic';

describe('Digital Logic Gate Evaluation', () => {
  it('correctly evaluates AND gate truth table', () => {
    expect(evaluateGate('AND', false, false)).toBe(false);
    expect(evaluateGate('AND', true, false)).toBe(false);
    expect(evaluateGate('AND', false, true)).toBe(false);
    expect(evaluateGate('AND', true, true)).toBe(true);
  });

  it('correctly evaluates XOR gate truth table (odd parity)', () => {
    expect(evaluateGate('XOR', false, false)).toBe(false);
    expect(evaluateGate('XOR', true, false)).toBe(true);
    expect(evaluateGate('XOR', false, true)).toBe(true);
    expect(evaluateGate('XOR', true, true)).toBe(false);
  });

  it('correctly evaluates NAND universal gate', () => {
    expect(evaluateGate('NAND', false, false)).toBe(true);
    expect(evaluateGate('NAND', true, false)).toBe(true);
    expect(evaluateGate('NAND', true, true)).toBe(false);
  });
});
