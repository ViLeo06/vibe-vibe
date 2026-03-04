<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

interface PipelineStep {
  id: string
  label: string
  icon: string
  duration: number
}

const pipelineSteps: PipelineStep[] = [
  { id: 'push', label: 'git push', icon: '📤', duration: 500 },
  { id: 'trigger', label: 'Webhook 触发', icon: '🔔', duration: 500 },
  { id: 'install', label: '安装依赖', icon: '📦', duration: 800 },
  { id: 'lint', label: 'Lint 检查', icon: '🔍', duration: 600 },
  { id: 'build', label: '构建项目', icon: '🔨', duration: 800 },
  { id: 'test', label: '运行测试', icon: '✅', duration: 600 },
  { id: 'deploy', label: '自动部署', icon: '🚀', duration: 800 },
]

const currentStep = ref(-1)
const isPlaying = ref(false)
const timers = ref<number[]>([])

async function playPipeline() {
  if (isPlaying.value) return
  isPlaying.value = true
  currentStep.value = -1

  for (let i = 0; i < pipelineSteps.length; i++) {
    currentStep.value = i
    await new Promise<void>(resolve => {
      const id = window.setTimeout(resolve, pipelineSteps[i].duration)
      timers.value = [...timers.value, id]
    })
  }

  isPlaying.value = false
}

function resetPipeline() {
  currentStep.value = -1
  isPlaying.value = false
}

onUnmounted(() => {
  timers.value.forEach(id => clearTimeout(id))
})
</script>

<template>
  <div class="ci-root">
    <div class="ci-header">
      <h4 class="ci-title">CI/CD 自动化流水线</h4>
      <div class="ci-controls">
        <button class="ci-btn" @click="playPipeline" :disabled="isPlaying">
          {{ isPlaying ? '运行中...' : '模拟运行' }}
        </button>
        <button
          v-if="currentStep >= pipelineSteps.length - 1 && !isPlaying"
          class="ci-btn ci-btn-outline"
          @click="resetPipeline"
        >
          重置
        </button>
      </div>
    </div>

    <div class="ci-pipeline">
      <div
        v-for="(step, index) in pipelineSteps"
        :key="step.id"
        :class="[
          'ci-step',
          {
            pending: currentStep < index,
            active: currentStep === index,
            done: currentStep > index,
          },
        ]"
      >
        <div class="ci-step-icon">{{ step.icon }}</div>
        <div class="ci-step-label">{{ step.label }}</div>
        <div v-if="currentStep === index" class="ci-step-spinner">
          <div class="ci-spinner" />
        </div>
        <div v-if="currentStep > index" class="ci-step-check">✓</div>
      </div>
    </div>

    <div v-if="currentStep >= pipelineSteps.length - 1" class="ci-result">
      <div class="ci-result-icon">🎉</div>
      <div class="ci-result-content">
        <div class="ci-result-title">部署成功</div>
        <div class="ci-result-desc">用户现在可以看到最新版本</div>
      </div>
    </div>

    <div class="ci-info">
      <div class="ci-info-item">
        <span class="ci-info-icon">💡</span>
        <span class="ci-info-text">推送代码后，整个流程自动执行</span>
      </div>
      <div class="ci-info-item">
        <span class="ci-info-icon">⚡</span>
        <span class="ci-info-text">任何步骤失败，流水线会停止并通知你</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ci-root {
  margin: 24px 0;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.ci-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.ci-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.ci-controls {
  display: flex;
  gap: 8px;
}

.ci-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  background: #15a051;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.ci-btn:hover:not(:disabled) {
  background: #128a44;
}

.ci-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ci-btn-outline {
  background: transparent;
  border: 1.5px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.ci-btn-outline:hover:not(:disabled) {
  border-color: var(--vp-c-text-3);
}

.ci-pipeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.ci-step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  border: 1.5px solid var(--vp-c-divider);
  transition: all 0.3s;
}

.ci-step.pending {
  opacity: 0.5;
}

.ci-step.active {
  border-color: #2eb3df;
  background: rgba(46, 179, 223, 0.05);
  box-shadow: 0 0 0 3px rgba(46, 179, 223, 0.1);
}

.ci-step.done {
  border-color: #15a051;
  background: rgba(21, 160, 81, 0.05);
}

.ci-step-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.ci-step-label {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.ci-step-spinner {
  flex-shrink: 0;
}

.ci-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: #2eb3df;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.ci-step-check {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #15a051;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
}

.ci-result {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(21, 160, 81, 0.1), rgba(46, 179, 223, 0.1));
  border: 1.5px solid rgba(21, 160, 81, 0.3);
  margin-bottom: 20px;
}

.ci-result-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.ci-result-content {
  flex: 1;
}

.ci-result-title {
  font-size: 16px;
  font-weight: 700;
  color: #15a051;
  margin-bottom: 4px;
}

.ci-result-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.ci-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.ci-info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ci-info-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.ci-info-text {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

@media (max-width: 640px) {
  .ci-root {
    padding: 16px;
  }

  .ci-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .ci-title {
    font-size: 14px;
  }

  .ci-step {
    padding: 10px 12px;
    gap: 10px;
  }

  .ci-step-icon {
    font-size: 18px;
  }

  .ci-step-label {
    font-size: 12px;
  }

  .ci-result {
    padding: 12px 16px;
    gap: 12px;
  }

  .ci-result-icon {
    font-size: 24px;
  }

  .ci-result-title {
    font-size: 14px;
  }

  .ci-result-desc {
    font-size: 12px;
  }

  .ci-info-text {
    font-size: 11px;
  }
}
</style>
