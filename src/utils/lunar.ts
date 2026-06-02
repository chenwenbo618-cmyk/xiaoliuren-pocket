import solarLunar from 'solarlunar-es';

export interface LunarDate {
  lunarYear?: number;
  lunarMonth: number;
  lunarDay: number;
  isLeap: boolean;
}

type LunarCalendarResult = {
  lYear?: number;
  lMonth: number;
  lDay: number;
  isLeap?: boolean;
};

const MONTH_NAMES = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const DAY_NAMES = [
  '初一',
  '初二',
  '初三',
  '初四',
  '初五',
  '初六',
  '初七',
  '初八',
  '初九',
  '初十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九',
  '二十',
  '廿一',
  '廿二',
  '廿三',
  '廿四',
  '廿五',
  '廿六',
  '廿七',
  '廿八',
  '廿九',
  '三十',
];

export function solarToLunar(date: Date): LunarDate {
  return solarToLunarFromParts(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function solarToLunarFromParts(year: number, month: number, day: number): LunarDate {
  const result = solarLunar.solar2lunar(year, month, day) as LunarCalendarResult;

  return {
    lunarYear: result.lYear,
    lunarMonth: result.lMonth,
    lunarDay: result.lDay,
    isLeap: Boolean(result.isLeap),
  };
}

export function formatLunarDate(date: Pick<LunarDate, 'lunarMonth' | 'lunarDay' | 'isLeap'>): string {
  const month = MONTH_NAMES[date.lunarMonth - 1] ?? String(date.lunarMonth);
  const day = DAY_NAMES[date.lunarDay - 1] ?? String(date.lunarDay);
  return `农历${date.isLeap ? '闰' : ''}${month}月${day}日`;
}
