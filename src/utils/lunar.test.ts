import { describe, expect, it } from 'vitest';
import { formatLunarDate } from './lunar';

describe('formatLunarDate', () => {
  it('shows regular lunar month clearly', () => {
    expect(formatLunarDate({ lunarMonth: 8, lunarDay: 15, isLeap: false })).toBe('农历八月十五日');
  });

  it('shows leap lunar month clearly while keeping the numeric month separate', () => {
    expect(formatLunarDate({ lunarMonth: 6, lunarDay: 2, isLeap: true })).toBe('农历闰六月初二日');
  });
});
