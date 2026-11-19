export type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

export function evaluateGate(gate: GateType, a: boolean, b: boolean = false): boolean {
  switch (gate) {
    case 'AND':
      return a && b;
    case 'OR':
      return a || b;
    case 'NOT':
      return !a;
    case 'NAND':
      return !(a && b);
    case 'NOR':
      return !(a || b);
    case 'XOR':
      return a !== b;
    case 'XNOR':
      return a === b;
    default:
      return false;
  }
}
