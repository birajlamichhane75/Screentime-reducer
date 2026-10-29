import { describe, it, expect } from 'vitest';
import { calculateScreenTimeSavings } from '@/lib/utils';

describe('Screen-Time Savings & Impact Calculations', () => {
  it('correctly calculates daily reduction, annualized hours, and equivalent days', () => {
    // Baseline: 240 mins (4h), Current: 90 mins (1.5h) -> 150 mins saved/day (2.5h)
    const result = calculateScreenTimeSavings(240, 90);

    expect(result.dailyReductionMins).toBe(150);
    // (150 * 365) / 60 = 912.5 -> rounded to 913
    expect(result.annualizedHours).toBe(913);
    // 913 / 24 = 38.0
    expect(result.equivalentDays).toBe(38.0);
  });

  it('handles negative or zero reduction cleanly without giving negative savings', () => {
    const result = calculateScreenTimeSavings(120, 180);
    expect(result.dailyReductionMins).toBe(0);
    expect(result.annualizedHours).toBe(0);
    expect(result.equivalentDays).toBe(0);
  });
});
