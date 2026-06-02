import type { PalaceName } from '../data/meanings';

export const PALACES = ['大安', '留连', '速喜', '赤口', '小吉', '空亡'] as const;

export type XiaoLiuRenPalace = (typeof PALACES)[number];

export interface ChineseHour {
  name: string;
  number: number;
  range: string;
}

export interface XiaoLiuRenResult {
  monthIndex: number;
  dayIndex: number;
  hourIndex: number;
  monthPalace: PalaceName;
  dayPalace: PalaceName;
  hourPalace: PalaceName;
  finalPalace: PalaceName;
}

export interface AnimationStage {
  key: 'month' | 'day' | 'hour';
  label: string;
  targetIndex: number;
  path: number[];
}

const CHINESE_HOURS: ChineseHour[] = [
  { name: '子时', number: 1, range: '23:00-00:59' },
  { name: '丑时', number: 2, range: '01:00-02:59' },
  { name: '寅时', number: 3, range: '03:00-04:59' },
  { name: '卯时', number: 4, range: '05:00-06:59' },
  { name: '辰时', number: 5, range: '07:00-08:59' },
  { name: '巳时', number: 6, range: '09:00-10:59' },
  { name: '午时', number: 7, range: '11:00-12:59' },
  { name: '未时', number: 8, range: '13:00-14:59' },
  { name: '申时', number: 9, range: '15:00-16:59' },
  { name: '酉时', number: 10, range: '17:00-18:59' },
  { name: '戌时', number: 11, range: '19:00-20:59' },
  { name: '亥时', number: 12, range: '21:00-22:59' },
];

export function move(startIndex: number, count: number): number {
  return (startIndex + count - 1) % 6;
}

export function getChineseHour(hour: number): ChineseHour {
  if (hour === 23 || hour === 0) {
    return CHINESE_HOURS[0];
  }

  const index = Math.floor((hour + 1) / 2);
  return CHINESE_HOURS[index];
}

export function calculateXiaoLiuRen(
  lunarMonth: number,
  lunarDay: number,
  hourNumber: number,
): XiaoLiuRenResult {
  const monthIndex = move(0, lunarMonth);
  const dayIndex = move(monthIndex, lunarDay);
  const hourIndex = move(dayIndex, hourNumber);

  return {
    monthIndex,
    dayIndex,
    hourIndex,
    monthPalace: PALACES[monthIndex],
    dayPalace: PALACES[dayIndex],
    hourPalace: PALACES[hourIndex],
    finalPalace: PALACES[hourIndex],
  };
}

export function buildAnimationStages(
  result: XiaoLiuRenResult,
  counts: { lunarMonth: number; lunarDay: number; hourNumber: number },
): AnimationStage[] {
  return [
    {
      key: 'month',
      label: `以农历月起数，落于：${result.monthPalace}宫`,
      targetIndex: result.monthIndex,
      path: buildVisualPath(0, counts.lunarMonth, result.monthIndex),
    },
    {
      key: 'day',
      label: `以农历日续数，落于：${result.dayPalace}宫`,
      targetIndex: result.dayIndex,
      path: buildVisualPath(result.monthIndex, counts.lunarDay, result.dayIndex),
    },
    {
      key: 'hour',
      label: `以时辰续数，最终落于：${result.hourPalace}宫`,
      targetIndex: result.hourIndex,
      path: buildVisualPath(result.dayIndex, counts.hourNumber, result.hourIndex),
    },
  ];
}

function buildVisualPath(startIndex: number, count: number, targetIndex: number): number[] {
  const visualSteps = Math.min(Math.max(count, 2), 12);
  const path = Array.from({ length: visualSteps }, (_, step) => (startIndex + step) % PALACES.length);
  path[path.length - 1] = targetIndex;
  return path;
}
