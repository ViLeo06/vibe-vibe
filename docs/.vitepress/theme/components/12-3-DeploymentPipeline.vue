<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnimation } from '../composables/useAnimation'

const { delay, clearAll } = useAnimation()

interface PipelineStep {
  id: string
  label: string
  icon: string
}

const steps: PipelineStep[] = [
  { id: 'push', label: 'git push', icon: '📤' },
  { id: 'trigger', label: '触发 CI', icon: '⚙️' },
  { id: 'install', label: '安装依赖', icon: '📦' },
  { id: 'test', label: '运行测试', icon: '✅' },
  { id: 'build', label: '构建项目', icon: '🔨' },
  { id: 'deploy', label: '部署上线', icon: '🚀' },
]

const currentStep = ref(-1)
const isPlaying = ref(false)
const simulateFailure = ref(false)
const failedStep = ref(-1)
const pipelineComplete = ref(false)

const isAnimating = computed(() => isPlaying.value)

function stepStatus(index: number): 'pending' | 'active' | 'done' | 'failed' {
  if (failedStep.value === index) return 'failed'
  if (currentStep.value === index && isPlaying.value) return 'active'
  if (currentStep.value > index) return 'done'
  return 'pending'
}

async function play() {
  if (isPlaying.value) return
  isPlaying.value = true
  currentStep.value = -1
  failedStep.value = -1
  pipelineComplete.value = false

  const failAt = simulateFailure.value ? 3 : -1

  for (let i = 0; i < steps.length; i++) {
    currentStep.value = i
    await delay(900)

    if (i === failAt) {
      failedStep.value = i
      isPlaying.value = false
      return
    }
  }

  pipelineComplete.value = true
  isPlaying.value = false
}

function reset() {
  clearAll()
  currentStep.value = -1
  failedStep.value = -1
  isPlaying.value = false
  pipelineComplete.value = false
}
</script>

<template>
  <div class="dp-root">
    <div class="dp-header">
      <h4 class="dp-title">GitHub Actions 部署流水线</h4>
      <div class="dp-controls">
        <label class="dp-toggle">
          <input type="checkbox" v-model="simulateFailure" :disabled="isAnimating" />
          <span class="dp-toggle-label">模拟失败</span>
        </label>
        <button class="dp-btn dp-btn-primary" @click="play" :disabled="isAnimating">
          {{ isAnimating ? '运行中...' : '播放' }}
        </button>
        <button
          v-if="currentStep >= 0 && !isPlaying"
          class="dp-btn dp-btn-outline"
          @click="reset"
        >
          重置
        </button>
      </div>
    </div>

    <!-- Pipeline (horizontal on desktop, vertical on mobile) -->
    <div class="dp-pipeline">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="dp-step-wrapper"
      >
        <div :class="['dp-step', stepStatus(index)]">
          <div class="dp-step-icon">{{ step.icon }}</div>
          <div class="dp-step-label">{{ step.label }}</div>
          <div v-if="stepStatus(index) === 'active'" class="dp-spinner-wrap">
            <div class="dp-spinner" />
          </div>
          <div v-if="stepStatus(index) === 'done'" class="dp-check">&#10003;</div>
          <div v-if="stepStatus(index) === 'failed'" class="dp-cross">&#10007;</div>
        </div>
        <!-- Arrow connector (not after last) -->
        <div v-if="index < steps.length - 1" class="dp-connector">
          <div
            :class="[
              'dp-connector-line',
              { filled: currentStep > index && failedStep !== index },
            ]"
          />
          <div class="dp-connector-arrow" />
        </div>
      </div>
    </div>

    <!-- Result -->
    <Transition name="dp-fade">
      <div v-if="pipelineComplete" class="dp-result dp-result-success">
        <span class="dp-result-icon">🎉</span>
        <div class="dp-result-content">
          <div class="dp-result-title">部署成功</div>
          <div class="dp-result-desc">所有步骤通过，用户已经可以访问最新版本</div>
        </div>
      </div>
      <div v-else-if="failedStep >= 0 && !isPlaying" class="dp-result dp-result-fail">
        <span class="dp-result-icon">🚫</span>
        <div class="dp-result-content">
          <div class="dp-result-title">流水线中断</div>
          <div class="dp-result-desc">
            "{{ steps[failedStep].label }}" 步骤失败，后续步骤不会执行
          </div>
        </div>
      </div>
    </Transition>

    <div class="dp-info">
      <span class="dp-info-icon">💡</span>
      <span class="dp-info-text">
        打开"模拟失败"后再播放，可以看到测试不通过时流水线如何中断
      </span>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.dp-root {
  margin: 24px auto;
  max-width: 688px;
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.dp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.dp-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.dp-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* Toggle */
.dp-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--vp-c-text-2);
  user-select: none;
}

.dp-toggle input {
  accent-color: var(--color-error);
}

.dp-toggle-label {
  font-weight: 500;
}

/* Buttons */
.dp-btn {
  padding: 7px 18px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.dp-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dp-btn-primary {
  background: var(--color-success);
  color: #fff;
}

.dp-btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.dp-btn-outline {
  background: transparent;
  border: 1.5px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.dp-btn-outline:hover:not(:disabled) {
  border-color: var(--vp-c-text-3);
}

/* Pipeline */
.dp-pipeline {
  display: flex;
  align-items: flex-start;
  gap: 0;
  margin-bottom: var(--spacing-lg);
  overflow-x: auto;
  padding-bottom: var(--spacing-sm);
}

.dp-step-wrapper {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.dp-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-sm);
  min-width: 80px;
  border-radius: var(--radius-md);
  border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  transition: all 0.3s;
  position: relative;
}

.dp-step.pending {
  opacity: 0.45;
}

.dp-step.active {
  border-color: var(--color-info);
  background: rgba(46, 179, 223, 0.06);
  box-shadow: 0 0 0 3px rgba(46, 179, 223, 0.12);
  opacity: 1;
}

.dp-step.done {
  border-color: var(--color-success);
  background: rgba(21, 160, 81, 0.06);
  opacity: 1;
}

.dp-step.failed {
  border-color: var(--color-error);
  background: rgba(255, 59, 48, 0.06);
  box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.12);
  opacity: 1;
}

.dp-step-icon {
  font-size: 22px;
}

.dp-step-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-align: center;
  white-space: nowrap;
}

.dp-spinner-wrap {
  position: absolute;
  top: 6px;
  right: 6px;
}

.dp-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--color-info);
  border-radius: 50%;
  animation: dp-spin 0.8s linear infinite;
}

@keyframes dp-spin {
  to { transform: rotate(360deg); }
}

.dp-check {
  position: absolute;
  top: 4px;
  right: 6px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-success);
  color: #fff;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
}

.dp-cross {
  position: absolute;
  top: 4px;
  right: 6px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-error);
  color: #fff;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
}

/* Connector arrows */
.dp-connector {
  display: flex;
  align-items: center;
  width: 24px;
  flex-shrink: 0;
  position: relative;
}

.dp-connector-line {
  width: 100%;
  height: 2px;
  background: var(--vp-c-divider);
  transition: background 0.3s;
}

.dp-connector-line.filled {
  background: var(--color-success);
}

.dp-connector-arrow {
  position: absolute;
  right: 0;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 6px solid var(--vp-c-divider);
}

.dp-connector-line.filled + .dp-connector-arrow {
  border-left-color: var(--color-success);
}

/* Result */
.dp-result {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
  border: 1.5px solid;
}

.dp-result-success {
  background: rgba(21, 160, 81, 0.08);
  border-color: rgba(21, 160, 81, 0.3);
}

.dp-result-fail {
  background: rgba(255, 59, 48, 0.08);
  border-color: rgba(255, 59, 48, 0.3);
}

.dp-result-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.dp-result-content {
  flex: 1;
}

.dp-result-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 2px;
}

.dp-result-success .dp-result-title {
  color: var(--color-success);
}

.dp-result-fail .dp-result-title {
  color: var(--color-error);
}

.dp-result-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

/* Info */
.dp-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.dp-info-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.dp-info-text {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* Transitions */
.dp-fade-enter-active,
.dp-fade-leave-active {
  transition: all 0.3s ease;
}

.dp-fade-enter-from,
.dp-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Responsive */
@media (max-width: 640px) {
  .dp-root {
    padding: var(--spacing-md);
  }

  .dp-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .dp-pipeline {
    flex-direction: column;
    align-items: stretch;
  }

  .dp-step-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .dp-step {
    flex-direction: row;
    min-width: auto;
    padding: 10px var(--spacing-md);
    gap: var(--spacing-sm);
  }

  .dp-step-icon {
    font-size: 20px;
  }

  .dp-step-label {
    font-size: 13px;
    text-align: left;
    flex: 1;
  }

  .dp-connector {
    width: auto;
    height: 16px;
    justify-content: center;
    align-self: center;
  }

  .dp-connector-line {
    width: 2px;
    height: 100%;
  }

  .dp-connector-arrow {
    bottom: 0;
    right: auto;
    top: auto;
    border-top: 6px solid var(--vp-c-divider);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: none;
  }

  .dp-connector-line.filled + .dp-connector-arrow {
    border-top-color: var(--color-success);
    border-left-color: transparent;
  }

  .dp-spinner-wrap {
    position: static;
  }

  .dp-check,
  .dp-cross {
    position: static;
  }

  .dp-result {
    padding: var(--spacing-md);
    gap: var(--spacing-sm);
  }

  .dp-result-icon {
    font-size: 22px;
  }

  .dp-result-title {
    font-size: 14px;
  }

  .dp-result-desc {
    font-size: 12px;
  }
}
</style>
