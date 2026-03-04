<script setup lang="ts">
import { ref } from 'vue'
import { useAnimation } from '../composables/useAnimation'

interface ConflictStep {
  id: number
  title: string
  description: string
  code?: string
  highlight?: 'local' | 'remote' | 'resolved'
}

const steps: ConflictStep[] = [
  {
    id: 1,
    title: '冲突发生',
    description: '小明和朋友同时修改了同一行代码',
    code: `const MAX_SCORE = 5  // 原始代码`
  },
  {
    id: 2,
    title: 'Git 标记冲突',
    description: 'pull 时 Git 发现冲突，用标记符号告诉你',
    code: `<<<<<<< HEAD
const MAX_SCORE = 100  // 你的修改
=======
const MAX_SCORE = 10   // 远程的修改
>>>>>>> origin/main`,
    highlight: 'local'
  },
  {
    id: 3,
    title: 'Claude Code 帮你解决',
    description: '告诉 Claude Code 保留哪个版本，它会自动合并',
    code: `const MAX_SCORE = 10  // 合并后的代码`,
    highlight: 'resolved'
  }
]

const currentStep = ref(0)
const isPlaying = ref(false)
const { delay } = useAnimation()

async function playAnimation() {
  if (isPlaying.value) return
  isPlaying.value = true
  currentStep.value = 0

  for (let i = 0; i <= steps.length; i++) {
    currentStep.value = i
    await delay(2000)
  }

  isPlaying.value = false
}

function reset() {
  currentStep.value = 0
}

function selectStep(index: number) {
  if (!isPlaying.value) {
    currentStep.value = index
  }
}
</script>

<template>
  <div class="conflict-wrapper">
    <div class="conflict-header">
      <h3 class="conflict-title">冲突解决流程</h3>
      <div class="conflict-controls">
        <button class="conflict-btn" @click="playAnimation" :disabled="isPlaying">
          {{ isPlaying ? '⏸️ 播放中' : '▶️ 播放动画' }}
        </button>
        <button v-if="currentStep > 0" class="conflict-btn conflict-btn-reset" @click="reset">
          🔄 重置
        </button>
      </div>
    </div>

    <!-- 步骤指示器 -->
    <div class="step-indicators">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="step-indicator"
        :class="{ active: currentStep > index, current: currentStep === index + 1 }"
        @click="selectStep(index + 1)"
      >
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-label">{{ step.title }}</div>
      </div>
    </div>

    <!-- 可视化区域 -->
    <div class="conflict-stage">
      <Transition name="fade" mode="out-in">
        <div v-if="currentStep === 0" key="initial" class="stage-content">
          <div class="stage-icon">🤝</div>
          <div class="stage-text">
            <h4>协作中偶尔会遇到冲突</h4>
            <p>当两个人同时修改了同一行代码时，Git 需要你来决定保留哪个版本</p>
          </div>
        </div>

        <div v-else-if="currentStep <= steps.length" :key="currentStep" class="stage-content">
          <div class="step-info">
            <div class="step-icon">
              <span v-if="currentStep === 1">⚠️</span>
              <span v-else-if="currentStep === 2">🔍</span>
              <span v-else>✅</span>
            </div>
            <div class="step-details">
              <h4 class="step-title">{{ steps[currentStep - 1].title }}</h4>
              <p class="step-desc">{{ steps[currentStep - 1].description }}</p>
            </div>
          </div>

          <div class="code-display" v-if="steps[currentStep - 1].code">
            <pre class="code-block" :class="steps[currentStep - 1].highlight"><code>{{ steps[currentStep - 1].code }}</code></pre>
          </div>
        </div>

        <div v-else key="complete" class="stage-content">
          <div class="complete-state">
            <div class="complete-icon">🎉</div>
            <h4>冲突已解决</h4>
            <p>Claude Code 帮你合并好了，继续开发吧</p>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 提示卡片 -->
    <div class="conflict-tips">
      <div class="tip-card">
        <span class="tip-icon">💡</span>
        <div class="tip-content">
          <strong>实际上冲突很少见</strong>
          <p>大部分时候两个人改的是不同文件，Git 会自动合并</p>
        </div>
      </div>
      <div class="tip-card">
        <span class="tip-icon">🤖</span>
        <div class="tip-content">
          <strong>让 Claude Code 帮你</strong>
          <p>告诉它"帮我解决冲突，保留远程的版本"，它会自动处理</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.conflict-wrapper {
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-xl);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-xl);
}

/* 头部 */
.conflict-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
}

.conflict-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.conflict-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.conflict-btn {
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

.conflict-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.conflict-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.conflict-btn-reset {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 2px solid var(--vp-c-divider);
}

.conflict-btn-reset:hover {
  border-color: var(--vp-c-brand);
}

/* 步骤指示器 */
.step-indicators {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xl);
  gap: var(--spacing-md);
}

.step-indicator {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.step-indicator:hover {
  border-color: #b8927d;
  transform: translateY(-2px);
}

.step-indicator.active {
  border-color: #8b9d77;
  background: rgba(139, 157, 119, 0.1);
}

.step-indicator.current {
  border-color: #7c9299;
  background: rgba(124, 146, 153, 0.15);
  box-shadow: var(--shadow-md);
}

.step-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-divider);
  border-radius: 50%;
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  transition: all var(--transition-base);
}

.step-indicator.active .step-number,
.step-indicator.current .step-number {
  background: #8b9d77;
  color: white;
}

.step-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-align: center;
}

.step-indicator.active .step-label,
.step-indicator.current .step-label {
  color: var(--vp-c-text-1);
}

/* 舞台区域 */
.conflict-stage {
  min-height: 320px;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: linear-gradient(135deg, #9aab88 0%, #8b9a9f 50%, #c9a58a 100%);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stage-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.stage-icon {
  font-size: 64px;
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

.stage-text {
  text-align: center;
  color: white;
}

.stage-text h4 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 20px;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.stage-text p {
  margin: 0;
  font-size: 15px;
  opacity: 0.95;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

/* 步骤信息 */
.step-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 600px;
}

.step-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.step-details {
  flex: 1;
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

/* 代码显示 */
.code-display {
  width: 100%;
  max-width: 600px;
}

.code-block {
  margin: 0;
  padding: var(--spacing-lg);
  background: rgba(0, 0, 0, 0.85);
  border-radius: var(--radius-lg);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  color: #e0e0e0;
  overflow-x: auto;
  box-shadow: var(--shadow-lg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.code-block.local {
  border-color: #b8927d;
}

.code-block.resolved {
  border-color: #8b9d77;
}

.code-block code {
  font-family: inherit;
  white-space: pre;
}

/* 完成状态 */
.complete-state {
  text-align: center;
  color: white;
}

.complete-icon {
  font-size: 72px;
  margin-bottom: var(--spacing-md);
  animation: bounce 1s ease-in-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.complete-state h4 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 24px;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.complete-state p {
  margin: 0;
  font-size: 16px;
  opacity: 0.95;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

/* 提示卡片 */
.conflict-tips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.tip-card {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
}

.tip-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
}

.tip-content strong {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.tip-content p {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 响应式 */
@media (max-width: 768px) {
  .conflict-wrapper {
    padding: var(--spacing-md);
  }

  .conflict-header {
    flex-direction: column;
    align-items: stretch;
  }

  .conflict-controls {
    width: 100%;
  }

  .conflict-btn {
    flex: 1;
  }

  .step-indicators {
    flex-direction: column;
  }

  .conflict-stage {
    min-height: 280px;
    padding: var(--spacing-lg);
  }

  .step-info {
    flex-direction: column;
    text-align: center;
  }

  .stage-icon {
    font-size: 48px;
  }

  .stage-text h4 {
    font-size: 18px;
  }

  .stage-text p {
    font-size: 14px;
  }

  .code-block {
    font-size: 12px;
  }

  .conflict-tips {
    grid-template-columns: 1fr;
  }
}
</style>
