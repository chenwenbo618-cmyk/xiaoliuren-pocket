import { describe, expect, it } from 'vitest';
import { buildAnimationStages, getChineseHour, move, calculateXiaoLiuRen } from './xiaoliuren';

describe('xiaoliuren algorithm', () => {
  it('moves with inclusive counting from the starting palace', () => {
    expect(move(0, 1)).toBe(0);
    expect(move(0, 2)).toBe(1);
    expect(move(4, 3)).toBe(0);
  });

  it('calculates month, day and hour palace in sequence', () => {
    const result = calculateXiaoLiuRen(3, 15, 11);

    expect(result.monthPalace).toBe('速喜');
    expect(result.dayPalace).toBe('小吉');
    expect(result.hourPalace).toBe('速喜');
    expect(result.finalPalace).toBe('速喜');
  });
});

describe('buildAnimationStages', () => {
  it('builds three capped visual paths that end on the accurate calculated palaces', () => {
    const result = calculateXiaoLiuRen(3, 15, 11);
    const stages = buildAnimationStages(result, { lunarMonth: 3, lunarDay: 15, hourNumber: 11 });

    expect(stages).toHaveLength(3);
    expect(stages[0].label).toBe('以农历月起数，落于：速喜宫');
    expect(stages[1].label).toBe('以农历日续数，落于：小吉宫');
    expect(stages[2].label).toBe('以时辰续数，最终落于：速喜宫');
    expect(stages[0].path.at(-1)).toBe(result.monthIndex);
    expect(stages[1].path.at(-1)).toBe(result.dayIndex);
    expect(stages[2].path.at(-1)).toBe(result.hourIndex);
    expect(stages.every((stage) => stage.path.length >= 2 && stage.path.length <= 12)).toBe(true);
  });
});

describe('getChineseHour', () => {
  it('maps 23:00 and midnight to Zi hour as number 1', () => {
    expect(getChineseHour(23)).toEqual({ name: '子时', number: 1, range: '23:00-00:59' });
    expect(getChineseHour(0)).toEqual({ name: '子时', number: 1, range: '23:00-00:59' });
  });

  it('maps daytime hours to the correct two-hour branch', () => {
    expect(getChineseHour(19)).toEqual({ name: '戌时', number: 11, range: '19:00-20:59' });
    expect(getChineseHour(22)).toEqual({ name: '亥时', number: 12, range: '21:00-22:59' });
  });
});
