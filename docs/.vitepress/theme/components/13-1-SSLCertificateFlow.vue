<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnimation } from '../composables/useAnimation'

const { delay, clearAll } = useAnimation()

interface FlowStep {
  id: number
  label: string
  icon: string
  description: string
}

const steps: FlowStep[] = [
  { id: 1, label: '申请证书', icon: '📋', description: '你的服务器向 Let\'s Encrypt 发送请求' },
  { id: 2, label: '域名验证', icon: '🔍', description: 'Let\'s Encrypt 验证你拥有这个域名' },
  { id: 3, label: '颁发证书', icon: '📜', description: '验证通过，颁发免费 SSL 证书' },
  { id: 4, label: 'HTTPS 生效', icon: '🔒', description: '浏览器显示小锁图标' },
  { id: 5, label: '自动续期', icon: '🔄', description: '证书到期前自动续期（每 90 天）' },
]

const currentStep = ref(-1)
const isPlaying = ref(false)

const isAnimating = computed(() => isPlaying.value)

async function play() {
  if (isPlaying.value) return
  isPlaying.value = true
  currentStep.value = -1

  for (let i = 0; i < steps.length; i++) {
    currentStep.value = i
    await delay(1000)
  }

  isPlaying.value = false
}

function reset() {
  clearAll()
  currentStep.value = -1
  isPlaying.value = false
}

function stepStatus(index: number): 'pending' | 'active' | 'done' {
  if (currentStep.value === index && isPlaying.value) return 'active'
  if (currentStep.value > index) return 'done'
  if (currentStep.value === index && !isPlaying.value) return 'done'
  return 'pending'
}
</script>

<template>
  <div class="ssl-root">
    <div class="ssl-header">
      <h4 class="ssl-title">SSL 证书签发流程</h4>
      <div class="ssl-controls">
        <button class="ssl-btn ssl-btn-primary" @click="play" :disabled="isAnimating">
          {{ isAnimating ? '播放中...' : '播放' }}
        </button>
        <button
          v-if="currentStep >= 0 && !isPlaying"
          class="ssl-btn ssl-btn-outline"
          @click="reset"
        >
          重置
        </button>
      </div>
    </div>

    <!-- Vertical flow -->
    <div class="ssl-flow">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="ssl-step-wrapper"
      >
        <div :class="['ssl-step', stepStatus(index)]">
          <div class="ssl-step-indicator">
            <div class="ssl-step-number" v-if="stepStatus(index) !== 'done'">
              {{ step.id }}
            </div>
            <div class="ssl-step-check" v-else>&#10003;</div>
          </div>
          <div class="ssl-step-icon">{{ step.icon }}</div>
          <div class="ssl-step-content">
            <div class="ssl-step-label">{{ step.label }}</div>
            <div class="ssl-step-desc">{{ step.description }}</div>
          </div>
        </div>
        <!-- Connector line -->
        <div
          v-if="index < steps.length - 1"
          :class="['ssl-connector', { filled: currentStep > index }]"
        >
          <div class="ssl-connector-line" />
        </div>
      </div>
    </div>

    <!-- Note -->
    <div class="ssl-note">
      <span class="ssl-note-icon">💡</span>
      <span class="ssl-note-text">
        Vercel、Cloudflare 等平台会自动处理证书，你不需要手动配置
      </span>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.ssl-root {
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.ssl-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.ssl-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.ssl-controls {
  display: flex;
  gap: var(--spacing-sm);
}

/* Buttons */
.ssl-btn {
  padding: 7px 18px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.ssl-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ssl-btn-primary {
  background: var(--color-success);
  color: #fff;
}

.ssl-btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.ssl-btn-outline {
  background: transparent;
  border: 1.5px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.ssl-btn-outline:hover:not(:disabled) {
  border-color: var(--vp-c-text-3);
}

/* Vertical flow */
.ssl-flow {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-lg);
}

.ssl-step-wrapper {
  display: flex;
  flex-direction: column;
}

.ssl-step {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  transition: all 0.3s;
}

.ssl-step.pending {
  opacity: 0.4;
}

.ssl-step.active {
  opacity: 1;
  border-color: var(--vp-c-brand, var(--color-primary));
  background: rgba(0, 122, 255, 0.04);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.10);
}

.ssl-step.done {
  opacity: 1;
  border-color: var(--color-success);
  background: rgba(21, 160, 81, 0.04);
}

/* Indicator */
.ssl-step-indicator {
  flex-shrink: 0;
}

.ssl-step-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 700;
}

.ssl-step.active .ssl-step-number {
  background: var(--color-primary);
  color: #fff;
  animation: ssl-pulse 1.5s ease-in-out infinite;
}

@keyframes ssl-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.3); }
  50% { box-shadow: 0 0 0 6px rgba(0, 122, 255, 0); }
}

.ssl-step-check {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-success);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}

.ssl-step-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.ssl-step-content {
  flex: 1;
  min-width: 0;
}

.ssl-step-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 2px;
}

.ssl-step-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* Connector */
.ssl-connector {
  display: flex;
  justify-content: flex-start;
  padding-left: 28px;
  height: 20px;
}

.ssl-connector-line {
  width: 2px;
  height: 100%;
  background: var(--vp-c-divider);
  transition: background 0.3s;
}

.ssl-connector.filled .ssl-connector-line {
  background: var(--color-success);
}

/* Note */
.ssl-note {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.ssl-note-icon {
  font-size: 16px;
  flex-shrink: 0;
  line-height: 1.5;
}

.ssl-note-text {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 640px) {
  .ssl-root {
    padding: var(--spacing-md);
  }

  .ssl-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .ssl-step {
    padding: 10px var(--spacing-sm);
    gap: var(--spacing-sm);
  }

  .ssl-step-icon {
    font-size: 20px;
  }

  .ssl-step-label {
    font-size: 13px;
  }

  .ssl-step-desc {
    font-size: 11px;
  }

  .ssl-step-number,
  .ssl-step-check {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  .ssl-connector {
    padding-left: 23px;
    height: 14px;
  }
}
</style>
