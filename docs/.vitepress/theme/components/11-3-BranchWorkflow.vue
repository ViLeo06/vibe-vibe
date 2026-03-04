<script setup lang="ts">
import { ref, computed } from 'vue'

interface WorkflowStep {
  id: string
  title: string
  description: string
  icon: string
  color: string
  position: { x: number; y: number }
}

const steps: WorkflowStep[] = [
  { id: 'start', title: '从 main 开始', description: '稳定的主分支', icon: '🌳', color: '#8b9d77', position: { x: 10, y: 30 } },
  { id: 'branch', title: '创建功能分支', description: 'feature/recommend', icon: '🌿', color: '#7c9299', position: { x: 20, y: 60 } },
  { id: 'commit1', title: '第一次提交', description: '添加推荐算法数据模型', icon: '📝', color: '#b8927d', position: { x: 30, y: 60 } },
  { id: 'commit2', title: '第二次提交', description: '实现基于评分的推荐逻辑', icon: '📝', color: '#b8927d', position: { x: 45, y: 60 } },
  { id: 'commit3', title: '第三次提交', description: '前端展示推荐结果', icon: '📝', color: '#b8927d', position: { x: 60, y: 60 } },
  { id: 'push', title: '推送到 GitHub', description: '云端备份', icon: '☁️', color: '#7c9299', position: { x: 70, y: 55 } },
  { id: 'pr', title: '创建 Pull Request', description: '请求代码审查', icon: '🔀', color: '#8b9d77', position: { x: 78, y: 48 } },
  { id: 'review', title: 'Code Review', description: '朋友审查代码', icon: '👀', color: '#b8927d', position: { x: 78, y: 38 } },
  { id: 'merge', title: '合并到 main', description: '功能上线', icon: '✅', color: '#8b9d77', position: { x: 85, y: 30 } },
  { id: 'complete', title: '删除功能分支', description: '保持整洁', icon: '🗑️', color: '#7c9299', position: { x: 90, y: 30 } }
]

const currentStep = ref(0)

const currentStepData = computed(() => steps[currentStep.value])

function selectStep(index: number) {
  currentStep.value = index
}

function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}
</script>

<template>
  <div class="workflow-wrapper">
    <div class="workflow-header">
      <h3 class="workflow-title">GitHub Flow 完整流程</h3>
      <div class="workflow-controls">
        <button class="workflow-btn" @click="prevStep" :disabled="currentStep === 0">
          ← 上一步
        </button>
        <button class="workflow-btn" @click="nextStep" :disabled="currentStep === steps.length - 1">
          下一步 →
        </button>
      </div>
    </div>

    <!-- 静态分支图 -->
    <div class="workflow-stage">
      <svg class="branch-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <!-- Main 分支线 -->
        <line x1="10" y1="30" x2="90" y2="30"
              stroke="#8b9d77"
              stroke-width="2"
              class="branch-line" />

        <!-- Main 起点 -->
        <circle cx="10" cy="30" r="3"
                fill="#8b9d77"
                class="commit-dot" />

        <!-- Feature 分支起点连接线 -->
        <line x1="10" y1="30" x2="20" y2="60"
              stroke="#7c9299"
              stroke-width="2"
              class="branch-line" />

        <!-- Feature 分支线 -->
        <line x1="20" y1="60" x2="70" y2="60"
              stroke="#7c9299"
              stroke-width="2"
              class="branch-line" />

        <!-- Feature 分支提交点 -->
        <circle cx="30" cy="60" r="2.5" fill="#b8927d" class="commit-dot" />
        <circle cx="45" cy="60" r="2.5" fill="#b8927d" class="commit-dot" />
        <circle cx="60" cy="60" r="2.5" fill="#b8927d" class="commit-dot" />

        <!-- Merge 箭头 -->
        <path d="M 70 60 Q 80 45, 85 30"
              stroke="#8b9d77"
              stroke-width="2"
              fill="none"
              class="merge-line" />

        <!-- Main 终点 -->
        <circle cx="90" cy="30" r="3.5" fill="#8b9d77" class="commit-dot" />

        <!-- 分支标签 -->
        <text x="10" y="22" font-size="4" fill="#8b9d77" font-weight="600" text-anchor="middle">main</text>
        <text x="20" y="72" font-size="3.5" fill="#7c9299" font-weight="600" text-anchor="middle">feature/recommend</text>

        <!-- 引导线指向当前步骤 -->
        <g class="guide-pointer">
          <line
            :x1="currentStepData.position.x"
            :y1="currentStepData.position.y - 8"
            :x2="currentStepData.position.x"
            :y2="currentStepData.position.y - 3"
            :stroke="currentStepData.color"
            stroke-width="1.5"
            class="pointer-line"
          />
          <polygon
            :points="`${currentStepData.position.x},${currentStepData.position.y - 3} ${currentStepData.position.x - 2},${currentStepData.position.y - 6} ${currentStepData.position.x + 2},${currentStepData.position.y - 6}`"
            :fill="currentStepData.color"
            class="pointer-arrow"
          />
        </g>

        <!-- 当前步骤高亮圆圈 -->
        <circle
          :cx="currentStepData.position.x"
          :cy="currentStepData.position.y"
          r="5"
          fill="none"
          :stroke="currentStepData.color"
          stroke-width="1.5"
          class="highlight-circle"
        />
      </svg>

      <!-- 当前步骤信息卡片 -->
      <Transition name="slide-up" mode="out-in">
        <div :key="currentStep" class="step-card">
          <div class="step-icon" :style="{ backgroundColor: currentStepData.color + '20', color: currentStepData.color }">
            {{ currentStepData.icon }}
          </div>
          <div class="step-info">
            <div class="step-number">步骤 {{ currentStep + 1 }}/{{ steps.length }}</div>
            <h4 class="step-title">{{ currentStepData.title }}</h4>
            <p class="step-desc">{{ currentStepData.description }}</p>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 步骤时间线 -->
    <div class="timeline">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="timeline-item"
        :class="{
          active: currentStep === index,
          completed: currentStep > index
        }"
        @click="selectStep(index)"
      >
        <div class="timeline-dot" :style="{ backgroundColor: step.color }"></div>
        <div class="timeline-label">{{ step.title }}</div>
      </div>
    </div>

    <!-- 关键提示 -->
    <div class="workflow-tips">
      <div class="tip-item">
        <span class="tip-icon">🌿</span>
        <span class="tip-text">分支让你安全地实验，改坏了切回 main 就行</span>
      </div>
      <div class="tip-item">
        <span class="tip-icon">👀</span>
        <span class="tip-text">PR 让朋友帮你发现问题，两双眼睛总比一双好</span>
      </div>
      <div class="tip-item">
        <span class="tip-icon">🗑️</span>
        <span class="tip-text">合并后删除分支，保持仓库整洁</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.workflow-wrapper {
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-xl);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-xl);
}

/* 头部 */
.workflow-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
}

.workflow-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.workflow-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.workflow-btn {
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

.workflow-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.workflow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* 可视化舞台 */
.workflow-stage {
  position: relative;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-xl);
  background: #ffffff;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-xl);
  min-height: 350px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* SVG 分支图 */
.branch-svg {
  width: 100%;
  height: 180px;
}

.branch-line {
  opacity: 0.8;
}

.commit-dot {
  opacity: 0.9;
}

.merge-line {
  opacity: 0.8;
}

/* 引导线和高亮 */
.guide-pointer {
  animation: bounce 1.5s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.pointer-line {
  stroke-linecap: round;
}

.highlight-circle {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
}

/* 步骤卡片 */
.step-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  max-width: 600px;
  margin: 0 auto;
}

.step-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}

.step-info {
  flex: 1;
}

.step-number {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.step-title {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.step-desc {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* 过渡动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

/* 时间线 */
.timeline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding: 0 var(--spacing-md);
  position: relative;
  overflow-x: auto;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 12px;
  left: var(--spacing-md);
  right: var(--spacing-md);
  height: 2px;
  background: var(--vp-c-divider);
  z-index: 0;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  position: relative;
  z-index: 1;
  cursor: pointer;
  transition: all var(--transition-base);
  min-width: 70px;
}

.timeline-item:hover .timeline-dot {
  transform: scale(1.2);
}

.timeline-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--vp-c-divider);
  border: 3px solid var(--vp-c-bg-soft);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.timeline-item.active .timeline-dot {
  transform: scale(1.3);
  box-shadow: 0 0 0 4px rgba(139, 157, 119, 0.2), var(--shadow-md);
}

.timeline-item.completed .timeline-dot {
  opacity: 0.5;
}

.timeline-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-align: center;
  max-width: 70px;
  line-height: 1.3;
}

.timeline-item.active .timeline-label {
  color: var(--vp-c-text-1);
}

/* 提示 */
.workflow-tips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.tip-item {
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

/* 响应式 */
@media (max-width: 768px) {
  .workflow-wrapper {
    padding: var(--spacing-md);
  }

  .workflow-header {
    flex-direction: column;
    align-items: stretch;
  }

  .workflow-controls {
    width: 100%;
  }

  .workflow-btn {
    flex: 1;
  }

  .workflow-stage {
    min-height: 300px;
    padding: var(--spacing-lg);
  }

  .branch-svg {
    height: 140px;
  }

  .step-card {
    flex-direction: column;
    text-align: center;
  }

  .step-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .timeline {
    gap: var(--spacing-sm);
  }

  .timeline-item {
    min-width: 50px;
  }

  .timeline-label {
    font-size: 9px;
    max-width: 50px;
  }

  .workflow-tips {
    grid-template-columns: 1fr;
  }
}
</style>
