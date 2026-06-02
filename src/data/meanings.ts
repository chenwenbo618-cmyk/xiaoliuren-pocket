export interface PalaceMeaning {
  name: string;
  level: '吉' | '平' | '凶';
  poem: string;
  traditional: string;
  wuxing: string;
  color: string;
  direction: string;
  spirit: string;
  numbers: string;
  keywords: string[];
  plain: string;
  actionAdvice: string;
  shortAction: string;
}

export const palaceMeanings = {
  大安: {
    name: '大安',
    level: '吉',
    poem: '大安事事昌，求财在坤方，失物去不远，宅舍保安康。\n行人身未动，病者主无妨，将军回田野，仔细更推详。',
    traditional:
      '身不动时，五行属木，颜色青色，方位东方，临青龙，凡谋事主一、五、七。有静止、心安、吉祥之含义。',
    wuxing: '木',
    color: '青色',
    direction: '东方',
    spirit: '青龙',
    numbers: '一、五、七',
    keywords: ['平安', '稳定', '守成', '安心'],
    plain: '整体偏稳，事情不一定很快推进，但风险较低。适合稳扎稳打，不宜频繁变动。',
    actionAdvice: '不必急着改变，保持原节奏，稳中推进。',
    shortAction: '保持稳定，不要乱改计划。',
  },
  留连: {
    name: '留连',
    level: '平',
    poem: '留连事难成，求谋日未明，官事凡宜缓，去者未回程。\n失物南方见，急讨方心称，更须防口舌，人口且平平。',
    traditional:
      '卒未归时，五行属水，颜色黑色，方位北方，临玄武，凡谋事主二、八、十。有暗昧不明、延迟、纠缠、拖延、漫长之含义。',
    wuxing: '水',
    color: '黑色',
    direction: '北方',
    spirit: '玄武',
    numbers: '二、八、十',
    keywords: ['拖延', '反复', '等待', '阻滞'],
    plain: '这件事短期内不太容易马上有结果，可能会反复沟通、等待或卡在某个环节。',
    actionAdvice: '不硬冲，先稳住，慢慢收。',
    shortAction: '别急着做决定，先缓一缓。',
  },
  速喜: {
    name: '速喜',
    level: '吉',
    poem: '速喜喜来临，求财向南行，失物申未午，逢人路上寻。\n官事有福德，病者无祸侵，田宅六畜吉，行人有信音。',
    traditional:
      '人即至时，五行属火，颜色红色，方位南方，临朱雀，凡谋事主三、六、九。有快速、喜庆、吉利之含义，指时机已到。',
    wuxing: '火',
    color: '红色',
    direction: '南方',
    spirit: '朱雀',
    numbers: '三、六、九',
    keywords: ['快速', '喜讯', '顺利', '回应'],
    plain: '事情有较快出现好消息的倾向，适合主动推进，尤其适合等待回复、消息、机会类问题。',
    actionAdvice: '可以主动推进，抓住窗口，快做快收。',
    shortAction: '有机会就动，别拖。',
  },
  赤口: {
    name: '赤口',
    level: '凶',
    poem: '赤口主口舌，官非切宜防，失物速速讨，行人有惊慌。\n六畜多作怪，病者出西方，更须防咀咒，诚恐染瘟皇。',
    traditional:
      '官事凶时，五行属金，颜色白色，方位西方，临白虎，凡谋事主四、七、十。有不吉、惊恐、凶险、口舌是非之含义。',
    wuxing: '金',
    color: '白色',
    direction: '西方',
    spirit: '白虎',
    numbers: '四、七、十',
    keywords: ['口舌', '争执', '误会', '是非'],
    plain: '这件事容易因为沟通、态度或误会产生冲突。建议少冲动，多确认细节，避免硬碰硬。',
    actionAdvice: '少说少冲，避开硬碰硬，先降火。',
    shortAction: '别冲动，别硬刚，先冷静。',
  },
  小吉: {
    name: '小吉',
    level: '吉',
    poem: '小吉最吉昌，路上好商量，阴人来报喜，失物在坤方。\n行人即便至，交关甚是强，凡事皆和合，病者叩穷苍。',
    traditional: '人来喜时，五行属水，临六合，凡谋事主一、五、七。有和合、吉利之含义。',
    wuxing: '水',
    color: '无固定颜色',
    direction: '无固定方位',
    spirit: '六合',
    numbers: '一、五、七',
    keywords: ['小成', '贵人', '可行', '渐顺'],
    plain: '整体偏吉，但不是大开大合的顺利，更像是慢慢变好。适合继续推进，留意身边帮助。',
    actionAdvice: '小步推进，见好就收，积累小胜。',
    shortAction: '先做一点点，别一下子做太满。',
  },
  空亡: {
    name: '空亡',
    level: '凶',
    poem: '空亡事不祥，阴人多乖张，求财无利益，行人有灾殃。\n失物寻一见，官事有刑伤，病人逢暗鬼，解禳保安康。',
    traditional:
      '音信稀时，五行属土，颜色黄色，方位中央，临勾陈，凡谋事主三、六、九。有不吉、无结果、忧虑之含义。',
    wuxing: '土',
    color: '黄色',
    direction: '中央',
    spirit: '勾陈',
    numbers: '三、六、九',
    keywords: ['落空', '虚耗', '不实', '无果'],
    plain: '这件事可能暂时没有实质结果，或信息不完整、期待落空。建议先别投入太多成本。',
    actionAdvice: '先别投入太多，查清楚再说，避免白费力。',
    shortAction: '先别押太重，可能白忙一场。',
  },
} as const satisfies Record<string, PalaceMeaning>;

export type PalaceName = keyof typeof palaceMeanings;
