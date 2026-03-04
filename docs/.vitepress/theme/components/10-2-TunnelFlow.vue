<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnimation } from '../composables/useAnimation'

const { delay, playSteps } = useAnimation()

const currentStep = ref(0)
const isPlaying = ref(false)
const packetPosition = ref(0)

const steps = [
  { id: 1, label: '朋友访问临时链接', icon: '🌐', description: 'https://random.trycloudflare.com' },
  { id: 2, label: '请求到达公网服务器', icon: '☁️', description: 'Cloudflare 服务器' },
  { id: 3, label: '通过隧道转发', icon: '🔄', description: '隧道连接' },
  { id: 4, label: '到达本地开发服务器', icon: '💻', description: 'localhost:3000' },
  { id: 5, label: '返回页面内容', icon: '📄', description: '响应数据' },
  { id: 6, label: '通过隧道回传', icon: '🔄', description: '隧道连接' },
  { id: 7, label: '朋友看到页面', icon: '✅', description: '页面渲染完成' },
]

const isAnimating = computed(() => isPlaying.value)

async function startAnimation() {
  if (isPlaying.value) return
  isPlaying.value = true
  currentStep.value = 0
  packetPosition.value = 0

  // 步骤 1: 朋友访问
  currentStep.value = 0
  await delay(800)

  // 步骤 2: 到达公网服务器
  currentStep.value = 1
  packetPosition.value = 25
  await delay(800)

  // 步骤 3: 通过隧道转发
  currentStep.value = 2
  packetPosition.value = 50
  await delay(800)

  // 步骤 4: 到达本地
  currentStep.value = 3
  packetPosition.value = 75
  await delay(800)

  // 步骤 5: 返回内容
  currentStep.value = 4
  packetPosition.value = 50
  await delay(800)

  // 步骤 6: 回传
  currentStep.value = 5
  packetPosition.value = 25
  await delay(800)

  // 步骤 7: 完成
  currentStep.value = 6
  packetPosition.value = 0
  await delay(800)

  isPlaying.value = false
}

function reset() {
  currentStep.value = 0
  packetPosition.value = 0
  isPlaying.value = false
}
</script>

<template>
  <div class="tunnel-wrapper">
    <div class="tunnel-header">
      <h3 class="tunnel-title">内网穿透原理</h3>
      <div class="tunnel-controls">
        <button class="tunnel-btn tunnel-btn-primary" @click="startAnimation" :disabled="isAnimating">
          {{ isAnimating ? '播放中...' : '播放动画' }}
        </button>
        <button class="tunnel-btn" @click="reset" :disabled="isAnimating">
          重置
        </button>
      </div>
    </div>

    <div class="tunnel-body">
      <!-- 流程图 -->
      <div class="tunnel-flow">
        <!-- 朋友的浏览器 -->
        <div class="tunnel-node" :class="{ active: currentStep === 0 || currentStep === 6 }">
          <div class="tunnel-node-icon">🌐</div>
          <div class="tunnel-node-label">朋友的浏览器</div>
        </div>

        <!-- 箭头向下 -->
        <div class="tunnel-arrow tunnel-arrow-down">
          <div class="tunnel-arrow-line"></div>
          <div class="tunnel-arrow-head"></div>
        </div>

        <!-- 公网服务器 -->
        <div class="tunnel-node tunnel-node-cloud" :class="{ active: currentStep === 1 || currentStep === 5 }">
          <div class="tunnel-node-icon">☁️</div>
          <div class="tunnel-node-label">公网服务器</div>
          <div class="tunnel-node-desc">Cloudflare / ngrok</div>
        </div>

        <!-- 隧道连接 -->
        <div class="tunnel-connection" :class="{ active: currentStep >= 2 && currentStep <= 5 }">
          <div class="tunnel-connection-line">
            <div class="tunnel-packet" :style="{ top: `${packetPosition}%` }"></div>
          </div>
          <div class="tunnel-connection-label">🔄 隧道连接</div>
        </div>

        <!-- 本地电脑 -->
        <div class="tunnel-node" :class="{ active: currentStep === 3 || currentStep === 4 }">
          <div class="tunnel-node-icon">💻</div>
          <div class="tunnel-node-label">你的电脑</div>
          <div class="tunnel-node-desc">localhost:3000</div>
        </div>
      </div>

      <!-- 步骤说明 -->
      <div class="tunnel-steps">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="tunnel-step"
          :class="{ active: currentStep === index, completed: currentStep > index }"
        >
          <div class="tunnel-step-number">{{ step.id }}</div>
          <div class="tunnel-step-content">
            <div class="tunnel-step-label">{{ step.icon }} {{ step.label }}</div>
            <div class="tunnel-step-desc">{{ step.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.tunnel-wrapper {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.tunnel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.tunnel-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.tunnel-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.tunnel-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 7px 18px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: var(--radius-md);
  background: var(--component-bg);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.tunnel-btn:hover:not(:disabled) {
  border-color: var(--vp-c-text-3);
}

.tunnel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tunnel-btn-primary {
  background: var(--color-success);
  color: #fff;
  border-color: var(--color-success);
}

.tunnel-btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.tunnel-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
}

/* 流程图 */
.tunnel-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--component-bg);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
}

.tunnel-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  border: 2px solid var(--vp-c-divider);
  border-radius: var(--radius-md);
  background: var(--vp-c-bg-soft);
  transition: all var(--transition-base);
  min-width: 180px;
}

.tunnel-node.active {
  border-color: var(--color-primary);
  background: rgba(0, 122, 255, 0.05);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.tunnel-node-cloud {
  border-color: var(--color-info);
}

.tunnel-node-cloud.active {
  border-color: var(--color-info);
  background: rgba(46, 179, 223, 0.05);
  box-shadow: 0 0 0 3px rgba(46, 179, 223, 0.1);
}

.tunnel-node-icon {
  font-size: 32px;
}

.tunnel-node-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.tunnel-node-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-family: var(--font-mono);
}

/* 箭头 */
.tunnel-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tunnel-arrow-down {
  flex-direction: column;
}

.tunnel-arrow-line {
  width: 2px;
  height: 24px;
  background: var(--vp-c-divider);
}

.tunnel-arrow-head {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid var(--vp-c-divider);
}

/* 隧道连接 */
.tunnel-connection {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) 0;
}

.tunnel-connection-line {
  position: relative;
  width: 4px;
  height: 80px;
  background: var(--vp-c-divider);
  border-radius: 2px;
  overflow: hidden;
}

.tunnel-connection.active .tunnel-connection-line {
  background: var(--color-info);
}

.tunnel-packet {
  position: absolute;
  left: 0;
  width: 4px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 2px;
  transition: top 0.6s ease;
}

.tunnel-connection-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.tunnel-connection.active .tunnel-connection-label {
  color: var(--color-info);
}

/* 步骤说明 */
.tunnel-steps {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.tunnel-step {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.tunnel-step.active {
  background: rgba(0, 122, 255, 0.08);
}

.tunnel-step.completed {
  opacity: 0.5;
}

.tunnel-step-number {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 600;
}

.tunnel-step.active .tunnel-step-number {
  background: var(--color-primary);
  color: white;
}

.tunnel-step.completed .tunnel-step-number {
  background: var(--color-success);
  color: white;
}

.tunnel-step-content {
  flex: 1;
}

.tunnel-step-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 2px;
}

.tunnel-step-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-family: var(--font-mono);
}

/* 响应式 */
@media (max-width: 640px) {
  .tunnel-body {
    grid-template-columns: 1fr;
  }

  .tunnel-node {
    min-width: 140px;
  }

  .tunnel-node-icon {
    font-size: 24px;
  }

  .tunnel-connection-line {
    height: 60px;
  }
}
</style>
