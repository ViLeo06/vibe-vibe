<script setup lang="ts">
import { ref } from 'vue'
import { useAnimation } from '../composables/useAnimation'

interface FlowStep {
  label: string
  type: 'trigger' | 'process' | 'pass' | 'fail'
}

const { delay, clearAll } = useAnimation()

const hookSteps: FlowStep[] = [
  { label: 'git commit', type: 'trigger' },
  { label: 'Husky 触发', type: 'process' },
  { label: 'pnpm test', type: 'process' },
  { label: 'commit 成功', type: 'pass' },
]

const hookFailStep: FlowStep = { label: 'commit 被阻止', type: 'fail' }

const ciSteps: FlowStep[] = [
  { label: 'git push', type: 'trigger' },
  { label: 'CI 触发', type: 'process' },
  { label: '干净环境安装', type: 'process' },
  { label: '运行测试', type: 'process' },
  { label: 'PR 显示绿勾', type: 'pass' },
]

const ciFailStep: FlowStep = { label: 'PR 显示红叉', type: 'fail' }

const hookActiveStep = ref(-1)
const ciActiveStep = ref(-1)
const isPlaying = ref(false)
const hookResult = ref<'none' | 'pass' | 'fail'>('none')
const ciResult = ref<'none' | 'pass' | 'fail'>('none')

async function playAnimation() {
  if (isPlaying.value) return
  isPlaying.value = true
  hookActiveStep.value = -1
  ciActiveStep.value = -1
  hookResult.value = 'none'
  ciResult.value = 'none'

  // Play hook steps
  for (let i = 0; i < hookSteps.length; i++) {
    hookActiveStep.value = i
    await delay(700)
  }
  hookResult.value = 'pass'
  await delay(500)

  // Play CI steps
  for (let i = 0; i < ciSteps.length; i++) {
    ciActiveStep.value = i
    await delay(700)
  }
  ciResult.value = 'pass'

  isPlaying.value = false
}

function reset() {
  clearAll()
  isPlaying.value = false
  hookActiveStep.value = -1
  ciActiveStep.value = -1
  hookResult.value = 'none'
  ciResult.value = 'none'
}
</script>

<template>
  <div class="ghw-root">
    <div class="ghw-header">
      <span class="ghw-title">两道防线：本地 + CI</span>
      <div class="ghw-actions">
        <button class="ghw-btn ghw-btn-play" :disabled="isPlaying" @click="playAnimation">
          {{ isPlaying ? '播放中...' : '播放动画' }}
        </button>
        <button class="ghw-btn" :disabled="isPlaying" @click="reset">重置</button>
      </div>
    </div>

    <div class="ghw-columns">
      <!-- Left: Git Hooks -->
      <div class="ghw-column">
        <div class="ghw-col-title ghw-col-title-hook">第一道防线：Git Hooks</div>
        <div class="ghw-flow">
          <div
            v-for="(step, i) in hookSteps"
            :key="i"
            :class="[
              'ghw-step',
              'ghw-step-' + step.type,
              { 'ghw-step-active': hookActiveStep === i },
              { 'ghw-step-done': hookActiveStep > i },
            ]"
          >
            <span class="ghw-step-num">{{ i + 1 }}</span>
            <span class="ghw-step-label">{{ step.label }}</span>
          </div>
          <!-- Fail branch (shown as alternate) -->
          <div :class="['ghw-step', 'ghw-step-fail', 'ghw-step-alt']">
            <span class="ghw-step-num">!</span>
            <span class="ghw-step-label">{{ hookFailStep.label }}</span>
          </div>
        </div>
        <div v-if="hookResult !== 'none'" class="ghw-result" :class="'ghw-result-' + hookResult">
          {{ hookResult === 'pass' ? 'Commit 通过' : '被阻止' }}
        </div>
      </div>

      <!-- Right: GitHub Actions -->
      <div class="ghw-column">
        <div class="ghw-col-title ghw-col-title-ci">第二道防线：GitHub Actions</div>
        <div class="ghw-flow">
          <div
            v-for="(step, i) in ciSteps"
            :key="i"
            :class="[
              'ghw-step',
              'ghw-step-' + step.type,
              { 'ghw-step-active': ciActiveStep === i },
              { 'ghw-step-done': ciActiveStep > i },
            ]"
          >
            <span class="ghw-step-num">{{ i + 1 }}</span>
            <span class="ghw-step-label">{{ step.label }}</span>
          </div>
          <div :class="['ghw-step', 'ghw-step-fail', 'ghw-step-alt']">
            <span class="ghw-step-num">!</span>
            <span class="ghw-step-label">{{ ciFailStep.label }}</span>
          </div>
        </div>
        <div v-if="ciResult !== 'none'" class="ghw-result" :class="'ghw-result-' + ciResult">
          {{ ciResult === 'pass' ? 'PR 通过' : '被拒绝' }}
        </div>
      </div>
    </div>

    <p class="ghw-hint">点击「播放动画」查看两道防线的工作流程</p>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.ghw-root {
  max-width: 688px;
  margin: 1.5rem auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.ghw-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.ghw-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.ghw-actions {
  display: flex;
  gap: 8px;
}

.ghw-btn {
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.ghw-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.ghw-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ghw-btn-play {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.ghw-btn-play:hover:not(:disabled) {
  opacity: 0.9;
  color: #fff;
}

.ghw-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 20px;
}

.ghw-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ghw-col-title {
  font-size: 13px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 6px;
  text-align: center;
}

.ghw-col-title-hook {
  background: rgba(139, 92, 246, 0.08);
  color: #8b5cf6;
}

.ghw-col-title-ci {
  background: rgba(46, 179, 223, 0.08);
  color: #2eb3df;
}

.ghw-flow {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ghw-step {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1.5px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  transition: all 0.3s;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.ghw-step-active {
  border-color: var(--vp-c-brand-1);
  background: rgba(21, 160, 81, 0.06);
  color: var(--vp-c-text-1);
  box-shadow: 0 0 0 2px rgba(21, 160, 81, 0.15);
}

.ghw-step-done {
  border-color: rgba(21, 160, 81, 0.3);
  color: var(--vp-c-text-3);
}

.ghw-step-alt {
  opacity: 0.45;
  border-style: dashed;
}

.ghw-step-num {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  background: var(--vp-c-divider);
  color: var(--vp-c-text-3);
}

.ghw-step-active .ghw-step-num {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.ghw-step-done .ghw-step-num {
  background: rgba(21, 160, 81, 0.2);
  color: var(--color-success);
}

.ghw-step-fail .ghw-step-num {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.ghw-step-label {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
}

.ghw-step-trigger .ghw-step-label {
  font-weight: 600;
}

.ghw-result {
  text-align: center;
  padding: 6px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  animation: fadeIn 0.3s ease;
}

.ghw-result-pass {
  background: rgba(21, 160, 81, 0.1);
  color: var(--color-success);
}

.ghw-result-fail {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.ghw-hint {
  text-align: center;
  font-size: 12px;
  color: var(--vp-c-text-3);
  padding: 0 20px 14px;
  margin: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Dark mode */
:global(html.dark) .ghw-col-title-hook {
  background: rgba(139, 92, 246, 0.12);
}
:global(html.dark) .ghw-col-title-ci {
  background: rgba(46, 179, 223, 0.12);
}
:global(html.dark) .ghw-step-active {
  background: rgba(21, 160, 81, 0.1);
}

/* Responsive */
@media (max-width: 640px) {
  .ghw-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    padding: 12px 14px;
  }
  .ghw-columns {
    grid-template-columns: 1fr;
    padding: 14px;
  }
  .ghw-step { padding: 6px 8px; }
  .ghw-step-label { font-size: 11px; }
  .ghw-col-title { font-size: 12px; }
}
</style>
