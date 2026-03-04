<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnimation } from '../composables/useAnimation'

const { delay } = useAnimation()

interface CORSScenario {
  id: string
  name: string
  origin: string
  target: string
  hasCookie: boolean
  corsHeader: string | null
  result: 'allowed' | 'blocked'
  explanation: string
}

const scenarios: CORSScenario[] = [
  {
    id: 'same-origin',
    name: '同源请求',
    origin: 'https://example.com',
    target: 'https://example.com/api',
    hasCookie: true,
    corsHeader: null,
    result: 'allowed',
    explanation: '同源请求不受 CORS 限制，浏览器自动带上 Cookie'
  },
  {
    id: 'cross-origin-no-cors',
    name: '跨域请求（无 CORS 头）',
    origin: 'https://app.example.com',
    target: 'https://api.example.com',
    hasCookie: true,
    corsHeader: null,
    result: 'blocked',
    explanation: '跨域请求被阻止，因为目标服务器没有返回 CORS 头'
  },
  {
    id: 'cross-origin-with-cors',
    name: '跨域请求（有 CORS 头）',
    origin: 'https://app.example.com',
    target: 'https://api.example.com',
    hasCookie: true,
    corsHeader: 'Access-Control-Allow-Origin: https://app.example.com',
    result: 'allowed',
    explanation: '服务器明确允许该域名访问，请求通过'
  },
  {
    id: 'cross-origin-wildcard',
    name: '跨域请求（通配符）',
    origin: 'https://evil.com',
    target: 'https://api.example.com',
    hasCookie: false,
    corsHeader: 'Access-Control-Allow-Origin: *',
    result: 'allowed',
    explanation: '通配符允许所有域名访问，但不能携带 Cookie（不安全）'
  }
]

const selectedScenario = ref<CORSScenario>(scenarios[0])
const isAnimating = ref(false)
const animationStep = ref(0)

const isBlocked = computed(() => selectedScenario.value.result === 'blocked')

async function playAnimation() {
  if (isAnimating.value) return
  isAnimating.value = true
  animationStep.value = 0

  // Step 1: 浏览器发起请求
  await delay(800)
  animationStep.value = 1

  // Step 2: 服务器响应
  await delay(800)
  animationStep.value = 2

  // Step 3: 浏览器检查 CORS
  await delay(800)
  animationStep.value = 3

  // Step 4: 结果
  await delay(800)
  animationStep.value = 4

  isAnimating.value = false
}

function selectScenario(scenario: CORSScenario) {
  if (isAnimating.value) return
  selectedScenario.value = scenario
  animationStep.value = 0
}
</script>

<template>
  <div class="component-wrapper">
    <div class="component-header">
      <h3 class="component-title">CORS 跨域机制演示</h3>
      <button
        class="btn btn-primary"
        @click="playAnimation"
        :disabled="isAnimating"
      >
        {{ isAnimating ? '播放中...' : '播放动画' }}
      </button>
    </div>

    <div class="component-body">
      <!-- 场景选择 -->
      <div class="scenario-tabs">
        <button
          v-for="scenario in scenarios"
          :key="scenario.id"
          class="scenario-tab"
          :class="{ active: selectedScenario.id === scenario.id }"
          @click="selectScenario(scenario)"
          :disabled="isAnimating"
        >
          {{ scenario.name }}
        </button>
      </div>

      <!-- 动画区域 -->
      <div class="animation-area">
        <!-- 浏览器 -->
        <div class="entity browser" :class="{ active: animationStep >= 1 }">
          <div class="entity-icon">🌐</div>
          <div class="entity-label">浏览器</div>
          <div class="entity-info">{{ selectedScenario.origin }}</div>
        </div>

        <!-- 请求箭头 -->
        <div class="arrow-container">
          <div
            class="arrow request"
            :class="{ active: animationStep >= 1 && animationStep < 3 }"
          >
            <div class="arrow-label">
              <div>HTTP 请求</div>
              <div v-if="selectedScenario.hasCookie" class="cookie-badge">🍪 Cookie</div>
            </div>
          </div>

          <div
            class="arrow response"
            :class="{
              active: animationStep >= 2 && animationStep < 4,
              blocked: isBlocked && animationStep >= 3
            }"
          >
            <div class="arrow-label">
              <div>HTTP 响应</div>
              <div v-if="selectedScenario.corsHeader" class="cors-header">
                {{ selectedScenario.corsHeader }}
              </div>
            </div>
          </div>
        </div>

        <!-- 服务器 -->
        <div class="entity server" :class="{ active: animationStep >= 2 }">
          <div class="entity-icon">🖥️</div>
          <div class="entity-label">服务器</div>
          <div class="entity-info">{{ selectedScenario.target }}</div>
        </div>
      </div>

      <!-- CORS 检查 -->
      <div
        v-if="animationStep >= 3"
        class="cors-check"
        :class="{ blocked: isBlocked }"
      >
        <div class="check-icon">{{ isBlocked ? '🚫' : '✅' }}</div>
        <div class="check-text">
          <div class="check-title">
            {{ isBlocked ? 'CORS 检查失败' : 'CORS 检查通过' }}
          </div>
          <div class="check-desc">{{ selectedScenario.explanation }}</div>
        </div>
      </div>

      <!-- 结果说明 -->
      <div v-if="animationStep >= 4" class="result-panel">
        <div class="result-title">
          {{ isBlocked ? '❌ 请求被阻止' : '✅ 请求成功' }}
        </div>
        <div class="result-desc">
          {{ isBlocked
            ? '浏览器拦截了响应数据，JavaScript 无法访问'
            : '浏览器允许 JavaScript 访问响应数据'
          }}
        </div>
      </div>

      <!-- 知识点 -->
      <div class="knowledge-box">
        <div class="knowledge-title">💡 关键知识点</div>
        <ul class="knowledge-list">
          <li>CORS 是浏览器的安全机制，不是服务器的限制</li>
          <li>同源请求（协议、域名、端口都相同）不受 CORS 限制</li>
          <li>跨域请求需要服务器返回 <code>Access-Control-Allow-Origin</code> 头</li>
          <li>通配符 <code>*</code> 允许所有域名，但不能携带 Cookie（不安全）</li>
          <li>在浏览器地址栏直接访问不受 CORS 限制，只有 JavaScript 发起的请求才受限</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.scenario-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.scenario-tab {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  background: var(--component-bg);
  color: var(--component-text);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-base);
}

.scenario-tab:hover:not(:disabled) {
  border-color: var(--vp-c-brand);
  background: var(--component-hover-bg);
}

.scenario-tab.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.scenario-tab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.animation-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-xl) 0;
  margin: var(--spacing-lg) 0;
  position: relative;
}

.entity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border: 2px solid var(--component-border);
  border-radius: var(--radius-lg);
  background: var(--component-bg);
  opacity: 0.3;
  transition: all var(--transition-base);
  min-width: 150px;
}

.entity.active {
  opacity: 1;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 20px rgba(21, 160, 81, 0.2);
}

.entity-icon {
  font-size: 32px;
}

.entity-label {
  font-weight: 600;
  color: var(--component-text);
}

.entity-info {
  font-size: 12px;
  color: var(--component-text-secondary);
  text-align: center;
  word-break: break-all;
}

.arrow-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: 0 var(--spacing-lg);
}

.arrow {
  position: relative;
  height: 40px;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.arrow.active {
  opacity: 1;
}

.arrow::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--vp-c-brand);
}

.arrow.request::after {
  content: '→';
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: var(--vp-c-brand);
}

.arrow.response::before {
  background: var(--color-success);
}

.arrow.response::after {
  content: '←';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: var(--color-success);
}

.arrow.response.blocked::before {
  background: var(--color-error);
}

.arrow.response.blocked::after {
  color: var(--color-error);
}

.arrow-label {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: var(--component-text-secondary);
  white-space: nowrap;
  text-align: center;
}

.cookie-badge {
  margin-top: 4px;
  padding: 2px 8px;
  background: rgba(212, 149, 44, 0.1);
  color: var(--color-warning);
  border-radius: var(--radius-full);
  font-size: 11px;
}

.cors-header {
  margin-top: 4px;
  padding: 2px 8px;
  background: rgba(21, 160, 81, 0.1);
  color: var(--color-success);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 10px;
}

.cors-check {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 2px solid var(--color-success);
  border-radius: var(--radius-md);
  background: rgba(21, 160, 81, 0.05);
  margin: var(--spacing-lg) 0;
  animation: fadeIn 0.3s ease;
}

.cors-check.blocked {
  border-color: var(--color-error);
  background: rgba(255, 59, 48, 0.05);
}

.check-icon {
  font-size: 32px;
}

.check-text {
  flex: 1;
}

.check-title {
  font-weight: 600;
  color: var(--component-text);
  margin-bottom: 4px;
}

.check-desc {
  font-size: 14px;
  color: var(--component-text-secondary);
}

.result-panel {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--component-hover-bg);
  margin: var(--spacing-lg) 0;
  animation: fadeIn 0.3s ease;
}

.result-title {
  font-weight: 600;
  color: var(--component-text);
  margin-bottom: var(--spacing-sm);
}

.result-desc {
  font-size: 14px;
  color: var(--component-text-secondary);
}

.knowledge-box {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-md);
  border-left: 3px solid var(--vp-c-brand);
  background: var(--component-hover-bg);
  border-radius: var(--radius-sm);
}

.knowledge-title {
  font-weight: 600;
  color: var(--component-text);
  margin-bottom: var(--spacing-sm);
}

.knowledge-list {
  margin: 0;
  padding-left: var(--spacing-lg);
  color: var(--component-text-secondary);
  font-size: 14px;
  line-height: 1.8;
}

.knowledge-list code {
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 13px;
}

@media (max-width: 640px) {
  .animation-area {
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .arrow-container {
    width: 100%;
    padding: 0;
  }

  .arrow {
    transform: rotate(90deg);
  }

  .arrow-label {
    transform: translateX(-50%) rotate(-90deg);
  }

  .scenario-tabs {
    flex-direction: column;
  }

  .scenario-tab {
    width: 100%;
  }
}
</style>
