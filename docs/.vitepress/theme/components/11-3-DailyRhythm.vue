<script setup lang="ts">
import { ref } from 'vue'

interface RhythmStep {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

const steps: RhythmStep[] = [
  { id: 'pull', title: '拉取最新代码', description: 'git pull', icon: '⬇️', color: '#7c9299' },
  { id: 'branch', title: '创建功能分支', description: '隔离你的工作', icon: '🌿', color: '#8b9d77' },
  { id: 'develop', title: '开发 + 提交', description: '小步快跑', icon: '💻', color: '#b8927d' },
  { id: 'push', title: '推送到 GitHub', description: '备份 + 展示进展', icon: '☁️', color: '#7c9299' },
  { id: 'pr', title: '创建 PR', description: '请求审查', icon: '🔀', color: '#8b9d77' },
  { id: 'review', title: 'Review + 合并', description: '代码进入主分支', icon: '✅', color: '#b8927d' },
  { id: 'cleanup', title: '删除功能分支', description: '保持整洁', icon: '🗑️', color: '#7c9299' }
]

const currentStep = ref(0)
const isPlaying = ref(false)

async function playAnimation() {
  if (isPlaying.value) return
  isPlaying.value = true

  for (let i = 0; i < steps.length; i++) {
    currentStep.value = i
    await new Promise(resolve => setTimeout(resolve, 1500))
  }

  currentStep.value = 0
  isPlaying.value = false
}

function selectStep(index: number) {
  if (!isPlaying.value) {
    currentStep.value = index
  }
}
</script>

<template>
  <div class="rhythm-wrapper">
    <div class="rhythm-header">
      <h3 class="rhythm-title">日常开发节奏</h3>
      <button class="rhythm-btn" @click="playAnimation" :disabled="isPlaying">
        {{ isPlaying ? '⏸️ 播放中' : '▶️ 播放循环' }}
      </button>
    </div>

    <!-- 循环流程图 -->
    <div class="rhythm-circle">
      <div class="center-icon">🔄</div>

      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="step-node"
        :class="{ active: currentStep === index }"
        :style="{
          '--angle': `${(index * 360) / steps.length}deg`,
          '--color': step.color
        }"
        @click="selectStep(index)"
      >
        <div class="node-icon">{{ step.icon }}</div>
        <div class="node-label">{{ step.title }}</div>
      </div>

      <!-- 连接线 -->
      <svg class="connection-lines" viewBox="0 0 300 300">
        <circle
          cx="150"
          cy="150"
          r="120"
          fill="none"
          stroke="var(--vp-c-divider)"
          stroke-width="2"
          stroke-dasharray="5,5"
        />

        <!-- 当前步骤的高亮弧线 -->
        <circle
          cx="150"
          cy="150"
          r="120"
          fill="none"
          :stroke="steps[currentStep].color"
          stroke-width="3"
          stroke-dasharray="753"
          :stroke-dashoffset="753 - (753 / steps.length) * (currentStep + 1)"
          class="progress-arc"
        />
      </svg>
    </div>

    <!-- 当前步骤详情 -->
    <Transition name="fade" mode="out-in">
      <div :key="currentStep" class="step-detail">
        <div class="detail-icon" :style="{ backgroundColor: steps[currentStep].color + '20', color: steps[currentStep].color }">
          {{ steps[currentStep].icon }}
        </div>
        <div class="detail-info">
          <h4 class="detail-title">{{ steps[currentStep].title }}</h4>
          <p class="detail-desc">{{ steps[currentStep].description }}</p>
        </div>
      </div>
    </Transition>

    <!-- 提示 -->
    <div class="rhythm-tip">
      <span class="tip-icon">💡</span>
      <span class="tip-text">这个节奏不是死规矩，个人项目可以简化，但协作时能避免大部分"代码打架"的问题</span>
    </div>
  </div>
</template>
<style scoped>
@import '../styles/variables.css';

.rhythm-wrapper {
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-xl);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-xl);
}

/* 头部 */
.rhythm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xl);
  gap: var(--spacing-md);
}

.rhythm-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.rhythm-btn {
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

.rhythm-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.rhythm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 循环流程图 */
.rhythm-circle {
  position: relative;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1;
  margin: 0 auto var(--spacing-xl);
}

.center-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.connection-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.progress-arc {
  transform-origin: center;
  transform: rotate(-90deg);
  transition: stroke-dashoffset 0.5s ease, stroke 0.3s ease;
}

/* 步骤节点 */
.step-node {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-140px) rotate(calc(-1 * var(--angle)));
  transition: all var(--transition-base);
}

.step-node:hover {
  transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-140px) rotate(calc(-1 * var(--angle))) scale(1.1);
}

.step-node.active {
  transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-140px) rotate(calc(-1 * var(--angle))) scale(1.2);
}

.node-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: var(--vp-c-bg);
  border: 3px solid var(--vp-c-divider);
  border-radius: 50%;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.step-node.active .node-icon {
  border-color: var(--color);
  background: var(--vp-c-bg);
  box-shadow: 0 0 0 4px rgba(139, 157, 119, 0.2), var(--shadow-md);
}

.node-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-align: center;
  line-height: 1.3;
  max-width: 80px;
}

.step-node.active .node-label {
  color: var(--vp-c-text-1);
}

/* 步骤详情 */
.step-detail {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
}

.detail-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}

.detail-info {
  flex: 1;
}

.detail-title {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.detail-desc {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  font-family: var(--font-mono);
}

/* 提示 */
.rhythm-tip {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
}

.tip-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.tip-text {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式 */
@media (max-width: 768px) {
  .rhythm-wrapper {
    padding: var(--spacing-md);
  }

  .rhythm-header {
    flex-direction: column;
    align-items: stretch;
  }

  .rhythm-btn {
    width: 100%;
  }

  .rhythm-circle {
    max-width: 350px;
  }

  .center-icon {
    font-size: 36px;
  }

  .step-node {
    width: 60px;
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-110px) rotate(calc(-1 * var(--angle)));
  }

  .step-node:hover,
  .step-node.active {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-110px) rotate(calc(-1 * var(--angle))) scale(1.1);
  }

  .node-icon {
    width: 44px;
    height: 44px;
    font-size: 22px;
  }

  .node-label {
    font-size: 10px;
    max-width: 60px;
  }

  .step-detail {
    flex-direction: column;
    text-align: center;
  }

  .detail-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }
}
</style>
