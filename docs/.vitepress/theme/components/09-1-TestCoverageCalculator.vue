<script setup lang="ts">
import { ref, computed } from 'vue'

interface Question {
  id: number
  text: string
  answer: boolean
}

const questions = ref<Question[]>([
  { id: 1, text: '项目超过 5 个页面？', answer: false },
  { id: 2, text: '核心业务流程超过 3 步？', answer: false },
  { id: 3, text: '遇到过「修 A 坏 B」的问题？', answer: false },
  { id: 4, text: '开始害怕改代码了？', answer: false },
])

const yesCount = computed(() => questions.value.filter(q => q.answer).length)

const result = computed(() => {
  if (yesCount.value <= 1) {
    return { label: '暂时不需要', desc: '项目规模较小，手动测试即可覆盖。', level: 'low' as const }
  }
  if (yesCount.value <= 3) {
    return { label: '建议引入', desc: '项目复杂度在上升，自动化测试能帮你节省回归时间。', level: 'mid' as const }
  }
  return { label: '强烈建议', desc: '项目已经到了不测试就不敢改的阶段，赶紧引入。', level: 'high' as const }
})

function toggle(id: number) {
  questions.value = questions.value.map(q =>
    q.id === id ? { ...q, answer: !q.answer } : q
  )
}
</script>

<template>
  <div class="tcc-root">
    <div class="tcc-title">你的项目需要自动化测试吗？</div>

    <div class="tcc-questions">
      <button
        v-for="q in questions"
        :key="q.id"
        :class="['tcc-card', { 'tcc-card-yes': q.answer }]"
        @click="toggle(q.id)"
      >
        <span class="tcc-indicator" :class="{ 'tcc-indicator-yes': q.answer }">
          {{ q.answer ? '是' : '否' }}
        </span>
        <span class="tcc-question">{{ q.text }}</span>
      </button>
    </div>

    <div :class="['tcc-result', 'tcc-result-' + result.level]">
      <div class="tcc-result-header">
        <span class="tcc-result-label">{{ result.label }}</span>
        <span class="tcc-result-score">{{ yesCount }}/{{ questions.length }} 项命中</span>
      </div>
      <div class="tcc-result-desc">{{ result.desc }}</div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.tcc-root {
  max-width: 688px;
  margin: 1.5rem auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
  padding: 20px;
}

.tcc-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
}

.tcc-questions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.tcc-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-family: inherit;
  width: 100%;
}

.tcc-card:hover {
  border-color: var(--vp-c-brand-1);
}

.tcc-card-yes {
  border-color: var(--color-success);
  background: rgba(21, 160, 81, 0.05);
}

.tcc-indicator {
  width: 32px;
  height: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  background: var(--vp-c-divider);
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: all 0.2s;
}

.tcc-indicator-yes {
  background: var(--color-success);
  color: #fff;
}

.tcc-question {
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.tcc-result {
  padding: 14px 16px;
  border-radius: 10px;
  border: 1.5px solid;
  transition: all 0.3s;
}

.tcc-result-low {
  background: rgba(107, 114, 128, 0.06);
  border-color: rgba(107, 114, 128, 0.2);
}

.tcc-result-mid {
  background: rgba(212, 149, 44, 0.06);
  border-color: rgba(212, 149, 44, 0.2);
}

.tcc-result-high {
  background: rgba(21, 160, 81, 0.06);
  border-color: rgba(21, 160, 81, 0.2);
}

.tcc-result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.tcc-result-label {
  font-size: 15px;
  font-weight: 700;
}

.tcc-result-low .tcc-result-label { color: #6b7280; }
.tcc-result-mid .tcc-result-label { color: var(--color-warning); }
.tcc-result-high .tcc-result-label { color: var(--color-success); }

.tcc-result-score {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

.tcc-result-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

/* Dark mode */
:global(html.dark) .tcc-card-yes {
  background: rgba(21, 160, 81, 0.08);
}
:global(html.dark) .tcc-result-low {
  background: rgba(107, 114, 128, 0.1);
  border-color: rgba(107, 114, 128, 0.25);
}
:global(html.dark) .tcc-result-mid {
  background: rgba(212, 149, 44, 0.1);
  border-color: rgba(212, 149, 44, 0.25);
}
:global(html.dark) .tcc-result-high {
  background: rgba(21, 160, 81, 0.1);
  border-color: rgba(21, 160, 81, 0.25);
}

/* Responsive */
@media (max-width: 640px) {
  .tcc-root { padding: 14px; }
  .tcc-card { padding: 10px 12px; gap: 10px; }
  .tcc-question { font-size: 13px; }
  .tcc-result { padding: 12px 14px; }
  .tcc-result-label { font-size: 14px; }
  .tcc-result-desc { font-size: 12px; }
}
</style>
