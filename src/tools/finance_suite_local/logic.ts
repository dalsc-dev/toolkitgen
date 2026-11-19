export function calculateCompoundInterest(
  principal: number,
  annualRatePercent: number,
  years: number,
  compoundFrequencyPerYear: number = 12
): number {
  if (principal <= 0 || years <= 0) return principal;
  const r = annualRatePercent / 100;
  const n = compoundFrequencyPerYear;
  const amount = principal * Math.pow(1 + r / n, n * years);
  return Math.round(amount * 100) / 100;
}

export function calculateLoanEmi(
  principal: number,
  annualRatePercent: number,
  tenureYears: number
): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  const totalMonths = tenureYears * 12;
  if (monthlyRate === 0) return Math.round((principal / totalMonths) * 100) / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return Math.round(emi * 100) / 100;
}
