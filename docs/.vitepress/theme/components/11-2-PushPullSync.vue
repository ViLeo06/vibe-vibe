<script setup lang="ts">
import { ref } from 'vue'
import { useAnimation } from '../composables/useAnimation'

interface Actor {
  id: string
  name: string
  icon: string
  color: string
  x: number
  y: number
}

interface SyncAction {
  from: string
  to: string
  label: string
  desc: string
}

const actors: Actor[] = [
  { id: 'ming', name: '小明', icon: '👨‍💻', color: '#7c9299', x: 15, y: 50 },
  { id: 'github', name: 'GitHub', icon: '☁️', color: '#8b9d77', x: 50, y: 30 },
  { id: 'friend', name: '朋友', icon: '👩‍💻', color: '#b8927d', x: 85, y: 50 }
]

const syncActions: SyncAction[] = [
  { from: 'ming', to: 'github', label: 'git push', desc: '小明推送代码到 GitHub' },
  { from: 'github', to: 'friend', label: 'git pull', desc: '朋友拉取最新代码' },
  { from: 'friend', to: 'github', label: 'git push', desc: '朋友推送修改' },
  { from: 'github', to: 'ming', label: 'git pull', desc: '小明同步更新' }
]

const currentStep = ref(0)
const isPlaying = ref(false)
const { delay } = useAnimation()

async function playAnimation() {
  if (isPlaying.value) return
  isPlaying.value = true
  currentStep.value = 0

  for (let i = 0; i <= syncActions.length; i++) {
    currentStep.value = i
    await delay(1800)
  }

  isPlaying.value = false
}

function reset() {
  currentStep.value = 0
}

function getActor(id: string) {
  return actors.find(a => a.id === id)!
}
</script>

<template>
  <div class="sync-wrapper">
    <div class="sync-header">
      <h3 class="sync-title">Push & Pull 协作流程</h3>
      <div class="sync-controls">
        <button class="sync-btn" @click="playAnimation" :disabled="isPlaying">
          {{ isPlaying ? '⏸️ 播放中' : '▶️ 播放动画' }}
        </button>
        <button v-if="currentStep > 0" class="sync-btn sync-btn-reset" @click="reset">
          🔄 重置
        </button>
      </div>
    </div>

    <!-- 可视化画布 -->
    <div class="sync-canvas">
      <!-- 参与者节点 -->
      <div
        v-for="actor in actors"
        :key="actor.id"
        class="actor-node"
        :style="{ left: actor.x + '%', top: actor.y + '%' }"
      >
        <div class="actor-avatar" :style="{ borderColor: actor.color }">
          {{ actor.icon }}
        </div>
        <div class="actor-label">{{ actor.name }}</div>
      </div>

      <!-- SVG 连接线 -->
      <svg class="sync-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <marker
            v-for="actor in actors"
            :key="'arrow-' + actor.id"
            :id="'arrow-' + actor.id"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="2.5"
            orient="auto"
          >
            <polygon points="0 0, 8 2.5, 0 5" :fill="actor.color" />
          </marker>
        </defs>

        <!-- 绘制连接线 -->
        <g v-for="(action, idx) in syncActions.slice(0, currentStep)" :key="idx">
          <line
            :x1="getActor(action.from).x"
            :y1="getActor(action.from).y"
            :x2="getActor(action.to).x"
            :y2="getActor(action.to).y"
            :stroke="getActor(action.from).color"
            stroke-width="0.8"
            :marker-end="'url(#arrow-' + action.from + ')'"
            class="sync-line"
            :class="{ active: idx === currentStep - 1 }"
          />
        </g>
      </svg>

      <!-- 当前动作提示 -->
      <Transition name="fade">
        <div v-if="currentStep > 0 && currentStep <= syncActions.length" class="action-hint">
          <div class="hint-step">步骤 {{ currentStep }}/{{ syncActions.length }}</div>
          <code class="hint-command">{{ syncActions[currentStep - 1].label }}</code>
          <div class="hint-desc">{{ syncActions[currentStep - 1].desc }}</div>
        </div>
      </Transition>

      <!-- 完成提示 -->
      <Transition name="fade">
        <div v-if="currentStep > syncActions.length" class="complete-hint">
          <span class="complete-icon">✅</span>
          <span class="complete-text">两人代码保持同步</span>
        </div>
      </Transition>
    </div>

    <!-- 说明文字 -->
    <div class="sync-tips">
      <div class="tip-item">
        <span class="tip-icon">💡</span>
        <span class="tip-text">每完成一个阶段性工作就 push 一次，不要攒太久</span>
      </div>
      <div class="tip-item">
        <span class="tip-icon">🔄</span>
        <span class="tip-text">开始工作前先 pull，完成后再 push</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.sync-wrapper {
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-xl);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-xl);
}

/* 头部 */
.sync-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
}

.sync-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.sync-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.sync-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-full);
  background: var(--vp-c-brand);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
}

.sync-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.sync-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sync-btn-reset {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 2px solid var(--vp-c-divider);
}

.sync-btn-reset:hover {
  border-color: var(--vp-c-brand);
}

/* 画布 */
.sync-canvas {
  position: relative;
  height: 380px;
  background: linear-gradient(135deg, #9aab88 0%, #8b9a9f 50%, #c9a58a 100%);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--spacing-lg);
}

/* 参与者节点 */
.actor-node {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  z-index: 10;
}

.actor-avatar {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 4px solid;
  border-radius: 50%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.actor-label {
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  box-shadow: var(--shadow-sm);
}

/* SVG */
.sync-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.sync-line {
  opacity: 0.6;
  transition: opacity 0.3s;
}

.sync-line.active {
  opacity: 1;
  stroke-width: 1.2;
  animation: line-pulse 1.2s ease-in-out;
}

@keyframes line-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 动作提示 */
.action-hint {
  position: absolute;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-xl);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 20;
  min-width: 280px;
}

.hint-step {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hint-command {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-brand);
  padding: 4px 12px;
  background: var(--vp-c-bg-soft);
  border-radius: var(--radius-sm);
}

.hint-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
  text-align: center;
}

/* 完成提示 */
.complete-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-xl);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-xl);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  z-index: 20;
}

.complete-icon {
  font-size: 32px;
}

.complete-text {
  font-size: 18px;
  font-weight: 700;
  color: #8b9d77;
}

/* 提示 */
.sync-tips {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.tip-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-md);
}

.tip-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.tip-text {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px) translateX(-50%);
}

/* 响应式 */
@media (max-width: 768px) {
  .sync-wrapper {
    padding: var(--spacing-md);
  }

  .sync-header {
    flex-direction: column;
    align-items: stretch;
  }

  .sync-controls {
    width: 100%;
  }

  .sync-btn {
    flex: 1;
  }

  .sync-canvas {
    height: 300px;
  }

  .actor-avatar {
    width: 64px;
    height: 64px;
    font-size: 32px;
  }

  .action-hint {
    min-width: 240px;
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .hint-command {
    font-size: 14px;
  }

  .hint-desc {
    font-size: 13px;
  }
}
</style>
