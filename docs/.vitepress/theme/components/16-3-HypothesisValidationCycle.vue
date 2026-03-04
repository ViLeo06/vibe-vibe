<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnimation } from '../composables/useAnimation'

const { delay, clearAll } = useAnimation()

interface Phase {
  id: number
  name: string
  description: string
  activities: string[]
  color: string
  colorBg: string
}

const phases: Phase[] = [
  {
    id: 1,
    name: '观察',
    description: '发现问题或机会',
    activities: ['用户行为数据', '用户反馈'],
    color: '#2eb3df',
    colorBg: 'rgba(46, 179, 223, 0.1)',
  },
  {
    id: 2,
    name: '假设',
    description: '提出可验证的假设',
    activities: ['如果我做 X，用户会 Y'],
    color: '#8b5cf6',
    colorBg: 'rgba(139, 92, 246, 0.1)',
  },
  {
    id: 3,
    name: '实验',
    description: '最小化验证',
    activities: ['A/B 测试', '原型测试'],
    color: '#D4952C',
    colorBg: 'rgba(212, 149, 44, 0.1)',
  },
  {
    id: 4,
    name: '结论',
    description: '数据验证假设是否成立',
    activities: ['分析实验数据', '判断是否支持假设'],
    color: '#15a051',
    colorBg: 'rgba(21, 160, 81, 0.1)',
  },
]

const currentPhase = ref(-1)
const isPlaying = ref(false)
const hypothesisResult = ref<'supported' | 'rejected'>('supported')

const phaseStatus = computed(() => {
  return phases.map((_, index) => {
    if (currentPhase.value < 0) return 'idle'
    if (index < currentPhase.value) return 'completed'
    if (index === currentPhase.value) return 'active'
    return 'idle'
  })
})

async function startAnimation() {
  if (isPlaying.value) return
  isPlaying.value = true
  currentPhase.value = -1

  for (let cycle = 0; cycle < 2; cycle++) {
    for (let i = 0; i < phases.length; i++) {
      currentPhase.value = i
      await delay(1000)
    }
    await delay(400)
    currentPhase.value = -1
    await delay(200)
  }

  isPlaying.value = false
}

function reset() {
  clearAll()
  currentPhase.value = -1
  isPlaying.value = false
}

const arrowLabels = ['发现问题', '形成假设', '设计实验', '得出结论']
</script>

<template>
  <div class="hv-root">
    <div class="hv-header">
      <h3 class="hv-title">假设验证循环</h3>
      <div class="hv-controls">
        <button class="btn btn-primary" :disabled="isPlaying" @click="startAnimation">
          {{ isPlaying ? '循环中...' : '播放循环' }}
        </button>
        <button class="btn" :disabled="isPlaying" @click="reset">
          重置
        </button>
      </div>
    </div>

    <!-- Cycle diagram: 2x2 grid with arrows -->
    <div class="hv-cycle">
      <!-- Top row -->
      <div
        class="hv-phase"
        :class="phaseStatus[0]"
        :style="{ '--phase-color': phases[0].color, '--phase-bg': phases[0].colorBg }"
      >
        <div class="hv-phase-number">1</div>
        <div class="hv-phase-name">{{ phases[0].name }}</div>
        <div class="hv-phase-desc">{{ phases[0].description }}</div>
        <div class="hv-phase-activities">
          <span v-for="a in phases[0].activities" :key="a" class="hv-activity">{{ a }}</span>
        </div>
      </div>

      <div class="hv-arrow hv-arrow-right" :class="{ filled: currentPhase >= 1 }">
        <span class="hv-arrow-label">{{ arrowLabels[1] }}</span>
        <svg viewBox="0 0 80 24" class="hv-arrow-svg">
          <line x1="0" y1="12" x2="68" y2="12" stroke="currentColor" stroke-width="2" />
          <polygon points="68,6 80,12 68,18" fill="currentColor" />
        </svg>
      </div>

      <div
        class="hv-phase"
        :class="phaseStatus[1]"
        :style="{ '--phase-color': phases[1].color, '--phase-bg': phases[1].colorBg }"
      >
        <div class="hv-phase-number">2</div>
        <div class="hv-phase-name">{{ phases[1].name }}</div>
        <div class="hv-phase-desc">{{ phases[1].description }}</div>
        <div class="hv-phase-activities">
          <span v-for="a in phases[1].activities" :key="a" class="hv-activity">{{ a }}</span>
        </div>
      </div>

      <!-- Right arrow (down) -->
      <div class="hv-arrow-vertical hv-arrow-down-right" :class="{ filled: currentPhase >= 2 }">
        <span class="hv-arrow-label">{{ arrowLabels[2] }}</span>
        <svg viewBox="0 0 24 60" class="hv-arrow-svg-v">
          <line x1="12" y1="0" x2="12" y2="48" stroke="currentColor" stroke-width="2" />
          <polygon points="6,48 12,60 18,48" fill="currentColor" />
        </svg>
      </div>

      <!-- Left arrow (up) -->
      <div class="hv-arrow-vertical hv-arrow-up-left" :class="{ filled: currentPhase === 0 && isPlaying }">
        <span class="hv-arrow-label">{{ arrowLabels[0] }}</span>
        <svg viewBox="0 0 24 60" class="hv-arrow-svg-v">
          <line x1="12" y1="60" x2="12" y2="12" stroke="currentColor" stroke-width="2" />
          <polygon points="6,12 12,0 18,12" fill="currentColor" />
        </svg>
      </div>

      <!-- Bottom row (reversed) -->
      <div
        class="hv-phase"
        :class="phaseStatus[3]"
        :style="{ '--phase-color': phases[3].color, '--phase-bg': phases[3].colorBg }"
      >
        <div class="hv-phase-number">4</div>
        <div class="hv-phase-name">{{ phases[3].name }}</div>
        <div class="hv-phase-desc">{{ phases[3].description }}</div>
        <div class="hv-phase-activities">
          <span v-for="a in phases[3].activities" :key="a" class="hv-activity">{{ a }}</span>
        </div>
      </div>

      <div class="hv-arrow hv-arrow-left" :class="{ filled: currentPhase >= 3 }">
        <span class="hv-arrow-label">{{ arrowLabels[3] }}</span>
        <svg viewBox="0 0 80 24" class="hv-arrow-svg">
          <line x1="80" y1="12" x2="12" y2="12" stroke="currentColor" stroke-width="2" />
          <polygon points="12,6 0,12 12,18" fill="currentColor" />
        </svg>
      </div>

      <div
        class="hv-phase"
        :class="phaseStatus[2]"
        :style="{ '--phase-color': phases[2].color, '--phase-bg': phases[2].colorBg }"
      >
        <div class="hv-phase-number">3</div>
        <div class="hv-phase-name">{{ phases[2].name }}</div>
        <div class="hv-phase-desc">{{ phases[2].description }}</div>
        <div class="hv-phase-activities">
          <span v-for="a in phases[2].activities" :key="a" class="hv-activity">{{ a }}</span>
        </div>
      </div>
    </div>

    <!-- Outcome toggle -->
    <div class="hv-outcome">
      <div class="hv-outcome-label">结论阶段的结果：</div>
      <div class="hv-toggle-group">
        <button
          class="hv-toggle"
          :class="{ active: hypothesisResult === 'supported' }"
          @click="hypothesisResult = 'supported'"
        >
          假设成立
        </button>
        <button
          class="hv-toggle"
          :class="{ active: hypothesisResult === 'rejected' }"
          @click="hypothesisResult = 'rejected'"
        >
          假设不成立
        </button>
      </div>

      <Transition name="hv-fade" mode="out-in">
        <div v-if="hypothesisResult === 'supported'" key="supported" class="hv-outcome-detail hv-outcome-success">
          <div class="hv-outcome-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="hv-outcome-title">采纳改变，正式实施</div>
            <div class="hv-outcome-desc">数据支持假设 -- 将实验方案推广到全部用户，继续观察长期效果。</div>
          </div>
        </div>
        <div v-else key="rejected" class="hv-outcome-detail hv-outcome-retry">
          <div class="hv-outcome-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
              <path d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.5-3.5L20 4M20 15a9 9 0 01-14.5 3.5L4 20" />
            </svg>
          </div>
          <div>
            <div class="hv-outcome-title">回到观察，形成新假设</div>
            <div class="hv-outcome-desc">数据不支持假设 -- 分析原因，重新观察用户行为，提出新的假设再验证。</div>
          </div>
        </div>
      </Transition>
    </div>

    <p class="hv-hint">点击「播放循环」查看假设验证的迭代过程</p>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.hv-root {
  margin: 1.5rem auto;
  max-width: 688px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.hv-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.hv-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.hv-controls {
  display: flex;
  gap: var(--spacing-sm);
}

/* Cycle grid layout */
.hv-cycle {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto auto auto;
  gap: 0;
  align-items: center;
  justify-items: center;
}

/* Phase card positions */
.hv-phase:nth-child(1) { grid-column: 1; grid-row: 1; }
.hv-arrow-right     { grid-column: 2; grid-row: 1; }
.hv-phase:nth-child(3) { grid-column: 3; grid-row: 1; }

.hv-arrow-up-left    { grid-column: 1; grid-row: 2; }
.hv-arrow-down-right { grid-column: 3; grid-row: 2; }

.hv-phase:nth-child(6) { grid-column: 1; grid-row: 3; }
.hv-arrow-left       { grid-column: 2; grid-row: 3; }
.hv-phase:nth-child(8) { grid-column: 3; grid-row: 3; }

/* Phase card */
.hv-phase {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  background: var(--phase-bg);
  transition: all var(--transition-slow);
  width: 100%;
  max-width: 240px;
}

.hv-phase.active {
  border-color: var(--phase-color);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--phase-color) 20%, transparent);
  transform: scale(1.04);
}

.hv-phase.completed {
  border-color: var(--phase-color);
  opacity: 0.7;
}

.hv-phase-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--phase-color);
  background: color-mix(in srgb, var(--phase-color) 15%, transparent);
  margin-bottom: 6px;
}

.hv-phase.active .hv-phase-number {
  background: var(--phase-color);
  color: white;
}

.hv-phase-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.hv-phase-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: var(--spacing-sm);
}

.hv-phase-activities {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

.hv-activity {
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 500;
  color: var(--phase-color);
  background: color-mix(in srgb, var(--phase-color) 10%, transparent);
}

/* Horizontal arrows */
.hv-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0 var(--spacing-sm);
  color: var(--vp-c-divider);
  transition: color var(--transition-slow);
}

.hv-arrow.filled {
  color: var(--color-primary);
}

.hv-arrow-svg {
  width: 60px;
  height: 20px;
}

.hv-arrow-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

/* Vertical arrows */
.hv-arrow-vertical {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: var(--spacing-sm) 0;
  color: var(--vp-c-divider);
  transition: color var(--transition-slow);
}

.hv-arrow-vertical.filled {
  color: var(--color-primary);
}

.hv-arrow-svg-v {
  width: 20px;
  height: 40px;
}

/* Outcome section */
.hv-outcome {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--vp-c-divider);
}

.hv-outcome-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: var(--spacing-sm);
}

.hv-toggle-group {
  display: flex;
  gap: 0;
  margin-bottom: var(--spacing-md);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-md);
  overflow: hidden;
  width: fit-content;
}

.hv-toggle {
  padding: 6px 16px;
  border: none;
  background: var(--component-bg);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
}

.hv-toggle:first-child {
  border-right: 1px solid var(--vp-c-divider);
}

.hv-toggle.active {
  background: var(--vp-c-brand-1, var(--color-primary));
  color: white;
}

.hv-toggle:hover:not(.active) {
  background: var(--component-hover-bg);
}

.hv-outcome-detail {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  align-items: flex-start;
}

.hv-outcome-success {
  background: rgba(21, 160, 81, 0.08);
  border: 1px solid rgba(21, 160, 81, 0.2);
}

.hv-outcome-retry {
  background: rgba(212, 149, 44, 0.08);
  border: 1px solid rgba(212, 149, 44, 0.2);
}

.hv-outcome-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hv-outcome-success .hv-outcome-icon {
  color: var(--color-success);
}

.hv-outcome-retry .hv-outcome-icon {
  color: var(--color-warning);
}

.hv-outcome-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.hv-outcome-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.hv-hint {
  text-align: center;
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: var(--spacing-md);
  margin-bottom: 0;
}

/* Transitions */
.hv-fade-enter-active,
.hv-fade-leave-active {
  transition: all 0.25s ease;
}

.hv-fade-enter-from,
.hv-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* Dark mode */
:global(html.dark) .hv-outcome-success {
  background: rgba(21, 160, 81, 0.06);
}

:global(html.dark) .hv-outcome-retry {
  background: rgba(212, 149, 44, 0.06);
}

/* Responsive: stack vertically */
@media (max-width: 640px) {
  .hv-root {
    padding: var(--spacing-md);
  }

  .hv-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .hv-cycle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  /* Hide grid-based vertical arrows on mobile */
  .hv-arrow-up-left,
  .hv-arrow-down-right {
    display: none;
  }

  /* Reorder: 1 -> right -> 2 -> down(implicit) -> 3 -> left -> 4 */
  .hv-phase { order: initial; max-width: 100%; width: 100%; }
  .hv-phase:nth-child(1) { order: 1; }
  .hv-arrow-right { order: 2; transform: rotate(90deg); }
  .hv-phase:nth-child(3) { order: 3; }
  .hv-phase:nth-child(8) { order: 5; }
  .hv-arrow-left { order: 4; transform: rotate(90deg); }
  .hv-phase:nth-child(6) { order: 7; }

  .hv-arrow-svg {
    width: 40px;
  }

  .hv-phase-name {
    font-size: 14px;
  }

  .hv-phase-desc {
    font-size: 11px;
  }

  .hv-toggle {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
