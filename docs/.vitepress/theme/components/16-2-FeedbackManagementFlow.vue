<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnimation } from '../composables/useAnimation'

const { delay, clearAll } = useAnimation()

interface FlowStep {
  id: number
  title: string
  description: string
  details: string[]
  icon: string
}

const steps: FlowStep[] = [
  {
    id: 1,
    title: '收集反馈',
    description: '多渠道收集用户声音',
    details: ['用户反馈', '数据分析', 'Bug 报告'],
    icon: 'inbox',
  },
  {
    id: 2,
    title: '分类整理',
    description: '按类型归纳反馈',
    details: ['Bug', '功能请求', '体验优化', '其他'],
    icon: 'folder',
  },
  {
    id: 3,
    title: '优先级评估',
    description: '按紧急程度排序',
    details: ['P0 紧急', 'P1 高', 'P2 中', 'P3 低'],
    icon: 'sort',
  },
  {
    id: 4,
    title: '执行',
    description: '按优先级处理反馈',
    details: ['修复 Bug', '开发功能', '优化体验'],
    icon: 'code',
  },
  {
    id: 5,
    title: '验证',
    description: '确认改动是否有效',
    details: ['用户确认', '数据验证'],
    icon: 'check',
  },
  {
    id: 6,
    title: '闭环',
    description: '反馈已解决，通知用户',
    details: ['通知反馈者', '记录归档'],
    icon: 'loop',
  },
]

const currentStep = ref(-1)
const isPlaying = ref(false)

const stepStatus = computed(() => {
  return steps.map((_, index) => {
    if (currentStep.value < 0) return 'idle'
    if (index < currentStep.value) return 'completed'
    if (index === currentStep.value) return 'active'
    return 'idle'
  })
})

async function startAnimation() {
  if (isPlaying.value) return
  isPlaying.value = true
  currentStep.value = -1

  for (let i = 0; i < steps.length; i++) {
    currentStep.value = i
    await delay(1200)
  }

  await delay(600)
  isPlaying.value = false
}

function reset() {
  clearAll()
  currentStep.value = -1
  isPlaying.value = false
}

const iconPaths: Record<string, string> = {
  inbox: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  sort: 'M3 4h13M3 8h9M3 12h5M3 16h2M17 8l4 4-4 4',
  code: 'M10 20l4-16M18 8l4 4-4 4M6 16l-4-4 4-4',
  check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  loop: 'M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.5-3.5L20 4M20 15a9 9 0 01-14.5 3.5L4 20',
}
</script>

<template>
  <div class="fm-root">
    <div class="fm-header">
      <h3 class="fm-title">反馈管理流程</h3>
      <div class="fm-controls">
        <button class="btn btn-primary" :disabled="isPlaying" @click="startAnimation">
          {{ isPlaying ? '播放中...' : '播放' }}
        </button>
        <button class="btn" :disabled="isPlaying" @click="reset">
          重置
        </button>
      </div>
    </div>

    <div class="fm-flow">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="fm-step-group"
      >
        <!-- Step card -->
        <div
          class="fm-card"
          :class="stepStatus[index]"
        >
          <div class="fm-card-left">
            <div class="fm-icon-wrap" :class="stepStatus[index]">
              <svg
                class="fm-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path :d="iconPaths[step.icon]" />
              </svg>
            </div>
            <div class="fm-step-number">{{ step.id }}</div>
          </div>
          <div class="fm-card-body">
            <div class="fm-card-title">{{ step.title }}</div>
            <div class="fm-card-desc">{{ step.description }}</div>
            <div class="fm-tags">
              <span v-for="tag in step.details" :key="tag" class="fm-tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Connector arrow -->
        <div v-if="index < steps.length - 1" class="fm-connector" :class="{ filled: currentStep > index }">
          <div class="fm-connector-line"></div>
          <div class="fm-connector-head"></div>
        </div>
      </div>
    </div>

    <p class="fm-hint">点击「播放」按钮查看完整流程</p>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.fm-root {
  margin: 1.5rem auto;
  max-width: 688px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.fm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.fm-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.fm-controls {
  display: flex;
  gap: var(--spacing-sm);
}

/* Flow layout */
.fm-flow {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.fm-step-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Card */
.fm-card {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 2px solid var(--vp-c-divider);
  background: var(--component-bg);
  transition: all var(--transition-slow);
  width: 100%;
}

.fm-card.active {
  border-color: var(--vp-c-brand-1, var(--color-primary));
  background: rgba(0, 122, 255, 0.04);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.fm-card.completed {
  border-color: var(--color-success);
  background: rgba(21, 160, 81, 0.04);
}

.fm-card-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.fm-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  transition: all var(--transition-slow);
}

.fm-icon-wrap.active {
  background: var(--color-primary);
  color: white;
}

.fm-icon-wrap.completed {
  background: var(--color-success);
  color: white;
}

.fm-icon {
  width: 20px;
  height: 20px;
}

.fm-step-number {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-3);
}

.fm-card-body {
  flex: 1;
  min-width: 0;
}

.fm-card-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 2px;
}

.fm-card-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: var(--spacing-sm);
}

.fm-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.fm-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 500;
}

.fm-card.active .fm-tag {
  background: rgba(0, 122, 255, 0.08);
  color: var(--color-primary);
}

.fm-card.completed .fm-tag {
  background: rgba(21, 160, 81, 0.08);
  color: var(--color-success);
}

/* Connector */
.fm-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 28px;
  justify-content: center;
}

.fm-connector-line {
  width: 2px;
  height: 16px;
  background: var(--vp-c-divider);
  transition: background var(--transition-slow);
}

.fm-connector-head {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid var(--vp-c-divider);
  transition: border-color var(--transition-slow);
}

.fm-connector.filled .fm-connector-line {
  background: var(--color-success);
}

.fm-connector.filled .fm-connector-head {
  border-top-color: var(--color-success);
}

.fm-hint {
  text-align: center;
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: var(--spacing-md);
  margin-bottom: 0;
}

/* Dark mode */
:global(html.dark) .fm-card.active {
  background: rgba(0, 122, 255, 0.08);
}

:global(html.dark) .fm-card.completed {
  background: rgba(21, 160, 81, 0.06);
}

/* Responsive */
@media (max-width: 640px) {
  .fm-root {
    padding: var(--spacing-md);
  }

  .fm-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .fm-card {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .fm-icon-wrap {
    width: 32px;
    height: 32px;
  }

  .fm-icon {
    width: 16px;
    height: 16px;
  }

  .fm-card-title {
    font-size: 14px;
  }

  .fm-card-desc {
    font-size: 12px;
  }

  .fm-tag {
    font-size: 10px;
  }
}
</style>
