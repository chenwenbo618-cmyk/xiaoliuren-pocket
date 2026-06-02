<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { palaceMeanings, type PalaceName } from './data/meanings';
import { formatLunarDate, solarToLunarFromParts, type LunarDate } from './utils/lunar';
import {
  buildAnimationStages,
  calculateXiaoLiuRen,
  getChineseHour,
  PALACES,
  type AnimationStage,
  type ChineseHour,
} from './utils/xiaoliuren';

const question = ref('');
const selectedDateTime = ref(getBeijingDateTimeValue());
const showGuide = ref(false);
const showAiDialog = ref(false);
const toast = ref('');
const result = ref<CastResult | null>(null);
const pendingResult = ref<CastResult | null>(null);
const calculating = ref(false);
const activePalaceIndex = ref<number | null>(null);
const animationLabel = ref('');
const animationTimers: number[] = [];

const compassPositions = [
  { left: '50%', top: '12%' },
  { left: '83%', top: '31%' },
  { left: '83%', top: '69%' },
  { left: '50%', top: '88%' },
  { left: '17%', top: '69%' },
  { left: '17%', top: '31%' },
];

interface DateTimeParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

interface CastResult {
  question: string;
  solarText: string;
  lunar: LunarDate;
  lunarText: string;
  chineseHour: ChineseHour;
  monthIndex: number;
  dayIndex: number;
  hourIndex: number;
  monthPalace: PalaceName;
  dayPalace: PalaceName;
  hourPalace: PalaceName;
  finalPalace: PalaceName;
}

const displayResult = computed(() => pendingResult.value ?? result.value);

const currentMeaning = computed(() => {
  if (!result.value) {
    return null;
  }
  return palaceMeanings[result.value.finalPalace];
});

onMounted(() => {
  if (localStorage.getItem('xiaoliuren-guide-seen') !== '1') {
    showGuide.value = true;
  }
});

function getBeijingDateTimeValue(): string {
  const beijing = new Date(Date.now() + 8 * 60 * 60 * 1000);
  return [
    `${beijing.getUTCFullYear()}-${pad(beijing.getUTCMonth() + 1)}-${pad(beijing.getUTCDate())}`,
    `${pad(beijing.getUTCHours())}:${pad(beijing.getUTCMinutes())}`,
  ].join('T');
}

function parseDateTimeValue(value: string): DateTimeParts | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute] = match;
  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
  };
}

function formatSolar(parts: DateTimeParts): string {
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)} ${pad(parts.hour)}:${pad(parts.minute)}，北京时间`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function closeGuide(): void {
  localStorage.setItem('xiaoliuren-guide-seen', '1');
  showGuide.value = false;
}

function cast(): void {
  const parts = parseDateTimeValue(selectedDateTime.value);
  if (!parts) {
    showToast('请选择有效的公历日期时间。');
    return;
  }

  clearAnimationTimers();
  const lunar = solarToLunarFromParts(parts.year, parts.month, parts.day);
  const chineseHour = getChineseHour(parts.hour);
  const castResult = calculateXiaoLiuRen(lunar.lunarMonth, lunar.lunarDay, chineseHour.number);
  const stages = buildAnimationStages(castResult, {
    lunarMonth: lunar.lunarMonth,
    lunarDay: lunar.lunarDay,
    hourNumber: chineseHour.number,
  });

  pendingResult.value = {
    question: question.value.trim() || '未填写',
    solarText: formatSolar(parts),
    lunar,
    lunarText: `${formatLunarDate(lunar)}，${chineseHour.name}`,
    chineseHour,
    monthIndex: castResult.monthIndex,
    dayIndex: castResult.dayIndex,
    hourIndex: castResult.hourIndex,
    monthPalace: castResult.monthPalace,
    dayPalace: castResult.dayPalace,
    hourPalace: castResult.hourPalace,
    finalPalace: castResult.finalPalace,
  };

  result.value = null;
  calculating.value = true;
  runAnimation(stages);
}

function runAnimation(stages: AnimationStage[]): void {
  let elapsed = 0;
  const stageDuration = 820;

  stages.forEach((stage) => {
    const stepDuration = stageDuration / stage.path.length;
    stage.path.forEach((palaceIndex, stepIndex) => {
      animationTimers.push(
        window.setTimeout(() => {
          animationLabel.value = stage.label;
          activePalaceIndex.value = palaceIndex;
        }, elapsed + stepIndex * stepDuration),
      );
    });
    elapsed += stageDuration;
  });

  animationTimers.push(
    window.setTimeout(() => {
      if (pendingResult.value) {
        activePalaceIndex.value = pendingResult.value.hourIndex;
        result.value = pendingResult.value;
      }
      calculating.value = false;
    }, elapsed + 120),
  );
}

function clearAnimationTimers(): void {
  while (animationTimers.length > 0) {
    const timer = animationTimers.pop();
    if (timer) {
      window.clearTimeout(timer);
    }
  }
}

async function copyResult(): Promise<void> {
  if (!result.value || !currentMeaning.value) {
    return;
  }

  const text = `【小六爻起卦结果】

所问之事：${result.value.question}
公历时间：${result.value.solarText}
农历时间：${result.value.lunarText}

月宫：${result.value.monthPalace}
日宫：${result.value.dayPalace}
时宫：${result.value.hourPalace}
最终结果：${result.value.finalPalace}

此卦处理方式：
${currentMeaning.value.actionAdvice}

传统口诀：
${currentMeaning.value.poem}

传统占语：
${currentMeaning.value.traditional}

白话解释：
${currentMeaning.value.plain}

仅供传统文化体验与个人参考。`;

  try {
    await navigator.clipboard.writeText(text);
    showToast('已复制结果。');
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('已复制结果。');
  }
}

function showToast(message: string): void {
  toast.value = message;
  window.setTimeout(() => {
    toast.value = '';
  }, 1800);
}
</script>

<template>
  <main class="app-shell">
    <section class="hero">
      <p class="seal">掌上起课</p>
      <h1>小六爻 · 掌上起课</h1>
      <p>输入所问之事，择时起卦，自动排出六宫结果</p>
    </section>

    <section class="panel input-panel">
      <label class="field">
        <span>所问之事</span>
        <textarea
          v-model="question"
          rows="3"
          placeholder="请输入你想问的事情，例如：这件事能不能顺利推进？"
        />
      </label>

      <label class="field">
        <span>公历日期时间</span>
        <input v-model="selectedDateTime" type="datetime-local" />
      </label>

      <button class="primary-button" type="button" :disabled="calculating" @click="cast">
        {{ calculating ? '起课流转中' : '开始起卦' }}
      </button>
    </section>

    <section v-if="calculating && displayResult" class="panel result-panel calculating-panel">
      <p class="eyebrow">六宫流转</p>
      <div class="compass" aria-label="六宫罗盘流转">
        <div class="compass-center pulsing">
          <span>起数中</span>
          <strong>{{ activePalaceIndex === null ? '起' : PALACES[activePalaceIndex] }}</strong>
        </div>
        <div
          v-for="(palace, index) in PALACES"
          :key="palace"
          class="compass-palace"
          :class="{ active: index === activePalaceIndex }"
          :style="compassPositions[index]"
        >
          <span>{{ palace }}</span>
        </div>
      </div>
      <p class="animation-label">{{ animationLabel || '大安起月，六宫顺行。' }}</p>
    </section>

    <section v-if="result && currentMeaning" class="panel result-panel">
      <div class="result-header">
        <div>
          <p class="eyebrow">最终结果</p>
          <h2>{{ result.finalPalace }}</h2>
          <p class="short-action">{{ currentMeaning.shortAction }}</p>
        </div>
        <span class="level">{{ currentMeaning.level }}</span>
      </div>

      <div class="compass" aria-label="六宫罗盘">
        <div class="compass-center">
          <span>中宫</span>
          <strong>{{ result.finalPalace }}</strong>
        </div>
        <div
          v-for="(palace, index) in PALACES"
          :key="palace"
          class="compass-palace"
          :class="{ active: palace === result.finalPalace }"
          :style="compassPositions[index]"
        >
          <span>{{ palace }}</span>
        </div>
      </div>

      <div class="meta-list">
        <p><span>所问之事</span>{{ result.question }}</p>
        <p><span>公历时间</span>{{ result.solarText }}</p>
        <p><span>农历时间</span>{{ result.lunarText }}</p>
      </div>

      <div class="palace-row">
        <div><span>月宫</span><strong>{{ result.monthPalace }}</strong></div>
        <div><span>日宫</span><strong>{{ result.dayPalace }}</strong></div>
        <div><span>时宫</span><strong>{{ result.hourPalace }}</strong></div>
      </div>

      <article class="advice-box">
        <h3>此卦处理方式</h3>
        <p>{{ currentMeaning.actionAdvice }}</p>
      </article>

      <div class="keywords">
        <span v-for="keyword in currentMeaning.keywords" :key="keyword">{{ keyword }}</span>
      </div>

      <article class="meaning">
        <h3>传统口诀</h3>
        <p class="poem">{{ currentMeaning.poem }}</p>

        <h3>传统占语</h3>
        <p>{{ currentMeaning.traditional }}</p>

        <div class="attribute-grid">
          <span>五行：{{ currentMeaning.wuxing }}</span>
          <span>颜色：{{ currentMeaning.color }}</span>
          <span>方位：{{ currentMeaning.direction }}</span>
          <span>神煞：{{ currentMeaning.spirit }}</span>
          <span>谋事数：{{ currentMeaning.numbers }}</span>
        </div>

        <h3>白话解释</h3>
        <p>{{ currentMeaning.plain }}</p>
      </article>

      <details class="process">
        <summary>查看推算过程</summary>
        <p>农历月数：{{ result.lunar.lunarMonth }}，从大安起数，落在 {{ result.monthPalace }}宫</p>
        <p>农历日数：{{ result.lunar.lunarDay }}，从月宫起数，落在 {{ result.dayPalace }}宫</p>
        <p>时辰序号：{{ result.chineseHour.number }}，从日宫起数，落在 {{ result.hourPalace }}宫</p>
      </details>

      <div class="actions">
        <button class="secondary-button" type="button" @click="copyResult">复制结果</button>
        <button class="ghost-button" type="button" @click="showAiDialog = true">
          AI 详细解读，后续开放
        </button>
      </div>
    </section>

    <footer>
      <p>结果仅供传统文化体验与个人参考，不构成决策建议。</p>
      <p>口诀和占语采用常见民间版本，个别字句因流派不同可能略有差异。</p>
    </footer>

    <div v-if="showGuide" class="modal-backdrop" role="dialog" aria-modal="true">
      <div class="modal">
        <h2>使用方法</h2>
        <p>
          输入你想问的事情，选择起卦时间，系统会自动换算农历月、日、时辰，并按小六壬六宫顺序排出结果。本工具仅供传统文化体验与个人记录参考。
        </p>
        <p class="modal-note">口诀和占语采用常见民间版本，个别字句因流派不同可能略有差异。</p>
        <button class="primary-button" type="button" @click="closeGuide">知道了</button>
      </div>
    </div>

    <div v-if="showAiDialog" class="modal-backdrop" role="dialog" aria-modal="true">
      <div class="modal">
        <h2>AI 详细解读</h2>
        <p>第一版暂未接入 AI 解读。当前结果基于固定传统断语和白话解释生成。</p>
        <button class="primary-button" type="button" @click="showAiDialog = false">知道了</button>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </main>
</template>
