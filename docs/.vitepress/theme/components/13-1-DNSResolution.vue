<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnimation } from '../composables/useAnimation'

const { delay, typeText } = useAnimation()

const currentStep = ref(0)
const isPlaying = ref(false)
const typedDomain = ref('')
const resolvedIP = ref('')

const steps = [
  { id: 1, label: '用户输入域名', icon: '⌨️', description: '在浏览器地址栏输入 myapp.com' },
  { id: 2, label: '查询本地缓存', icon: '💾', description: '检查浏览器和系统 DNS 缓存' },
  { id: 3, label: '请求 DNS 服务器', icon: '🔍', description: '向 ISP 的 DNS 服务器发起查询' },
  { id: 4, label: '递归查询', icon: '🔄', description: 'DNS 服务器查询根服务器、TLD 服务器' },
  { id: 5, label: '返回 IP 地址', icon: '📍', description: '获得服务器 IP: 1.2.3.4' },
  { id: 6, label: '建立连接', icon: '🔗', description: '浏览器连接到服务器 IP' },
  { id: 7, label: '加载网页', icon: '✅', description: '网页内容加载完成' },
]

const dnsServers = [
  { name: '浏览器缓存', active: false, found: false },
  { name: '系统缓存', active: false, found: false },
  { name: 'ISP DNS', active: false, found: false },
  { name: '根服务器', active: false, found: false },
  { name: 'TLD 服务器', active: false, found: false },
  { name: '权威服务器', active: false, found: true },
]

const activeDNS = ref<number[]>([])

const isAnimating = computed(() => isPlaying.value)

async function startAnimation() {
  if (isPlaying.value) return
  isPlaying.value = true
  currentStep.value = 0
  typedDomain.value = ''
  resolvedIP.value = ''
  activeDNS.value = []

  // 步骤 1: 输入域名
  currentStep.value = 0
  await typeText('myapp.com', 100, (text) => {
    typedDomain.value = text
  })
  await delay(600)

  // 步骤 2: 查询本地缓存
  currentStep.value = 1
  activeDNS.value = [0, 1]
  await delay(800)

  // 步骤 3: 请求 DNS 服务器
  currentStep.value = 2
  activeDNS.value = [2]
  await delay(800)

  // 步骤 4: 递归查询
  currentStep.value = 3
  activeDNS.value = [3]
  await delay(600)
  activeDNS.value = [4]
  await delay(600)
  activeDNS.value = [5]
  await delay(800)

  // 步骤 5: 返回 IP
  currentStep.value = 4
  await typeText('1.2.3.4', 100, (text) => {
    resolvedIP.value = text
  })
  await delay(800)

  // 步骤 6: 建立连接
  currentStep.value = 5
  activeDNS.value = []
  await delay(800)

  // 步骤 7: 完成
  currentStep.value = 6
  await delay(800)

  isPlaying.value = false
}

function reset() {
  currentStep.value = 0
  typedDomain.value = ''
  resolvedIP.value = ''
  activeDNS.value = []
  isPlaying.value = false
}
</script>

<template>
  <div class="dns-wrapper">
    <div class="dns-header">
      <h3 class="dns-title">DNS 解析过程</h3>
      <div class="dns-controls">
        <button class="dns-btn dns-btn-primary" @click="startAnimation" :disabled="isAnimating">
          {{ isAnimating ? '播放中...' : '播放动画' }}
        </button>
        <button class="dns-btn" @click="reset" :disabled="isAnimating">
          重置
        </button>
      </div>
    </div>

    <div class="dns-body">
      <!-- 浏览器地址栏 -->
      <div class="dns-browser" :class="{ active: currentStep === 0 }">
        <div class="dns-browser-bar">
          <div class="dns-browser-icon">🌐</div>
          <div class="dns-browser-input">
            <span class="dns-browser-protocol">https://</span>
            <span class="dns-browser-domain">{{ typedDomain }}</span>
            <span class="dns-browser-cursor" v-if="currentStep === 0 && isPlaying">|</span>
          </div>
        </div>
      </div>

      <!-- DNS 查询流程 -->
      <div class="dns-flow">
        <div
          v-for="(server, index) in dnsServers"
          :key="index"
          class="dns-server"
          :class="{
            active: activeDNS.includes(index),
            found: server.found && activeDNS.includes(index)
          }"
        >
          <div class="dns-server-icon">
            {{ index < 2 ? '💾' : index < 3 ? '🔍' : '🌐' }}
          </div>
          <div class="dns-server-name">{{ server.name }}</div>
          <div class="dns-server-status" v-if="activeDNS.includes(index)">
            {{ server.found ? '✅ 找到' : '❌ 未找到' }}
          </div>
        </div>
      </div>

      <!-- IP 地址显示 -->
      <div class="dns-result" v-if="resolvedIP" :class="{ active: currentStep >= 4 }">
        <div class="dns-result-label">解析结果</div>
        <div class="dns-result-ip">
          <span class="dns-result-icon">📍</span>
          <code>{{ resolvedIP }}</code>
        </div>
      </div>

      <!-- 步骤说明 -->
      <div class="dns-steps">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="dns-step"
          :class="{ active: currentStep === index, completed: currentStep > index }"
        >
          <div class="dns-step-number">{{ step.id }}</div>
          <div class="dns-step-content">
            <div class="dns-step-label">{{ step.icon }} {{ step.label }}</div>
            <div class="dns-step-desc">{{ step.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.dns-wrapper {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.dns-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.dns-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.dns-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.dns-btn {
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

.dns-btn:hover:not(:disabled) {
  border-color: var(--vp-c-text-3);
}

.dns-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dns-btn-primary {
  background: var(--color-success);
  color: #fff;
  border-color: var(--color-success);
}

.dns-btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.dns-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* 浏览器地址栏 */
.dns-browser {
  padding: var(--spacing-md);
  background: var(--component-bg);
  border: 2px solid var(--component-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.dns-browser.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.dns-browser-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--vp-c-bg-soft);
  border-radius: var(--radius-md);
}

.dns-browser-icon {
  font-size: 20px;
}

.dns-browser-input {
  flex: 1;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.dns-browser-protocol {
  color: var(--vp-c-text-3);
}

.dns-browser-domain {
  color: var(--color-primary);
  font-weight: 600;
}

.dns-browser-cursor {
  animation: blink 1s infinite;
  color: var(--vp-c-text-1);
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* DNS 查询流程 */
.dns-flow {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--spacing-md);
}

.dns-server {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: var(--component-bg);
  border: 2px solid var(--component-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  opacity: 0.4;
}

.dns-server.active {
  opacity: 1;
  border-color: var(--color-info);
  background: rgba(46, 179, 223, 0.05);
  box-shadow: 0 0 0 3px rgba(46, 179, 223, 0.1);
}

.dns-server.found {
  border-color: var(--color-success);
  background: rgba(21, 160, 81, 0.05);
  box-shadow: 0 0 0 3px rgba(21, 160, 81, 0.1);
}

.dns-server-icon {
  font-size: 28px;
}

.dns-server-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-align: center;
}

.dns-server-status {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--vp-c-bg-soft);
}

/* IP 地址显示 */
.dns-result {
  padding: var(--spacing-md);
  background: var(--component-bg);
  border: 2px solid var(--component-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  opacity: 0;
}

.dns-result.active {
  opacity: 1;
  border-color: var(--color-success);
  background: rgba(21, 160, 81, 0.05);
}

.dns-result-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: var(--spacing-xs);
}

.dns-result-ip {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-success);
}

.dns-result-icon {
  font-size: 24px;
}

.dns-result-ip code {
  font-family: var(--font-mono);
  background: var(--vp-c-bg-soft);
  padding: 4px 12px;
  border-radius: var(--radius-md);
}

/* 步骤说明 */
.dns-steps {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.dns-step {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.dns-step.active {
  background: rgba(0, 122, 255, 0.08);
}

.dns-step.completed {
  opacity: 0.5;
}

.dns-step-number {
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

.dns-step.active .dns-step-number {
  background: var(--color-primary);
  color: white;
}

.dns-step.completed .dns-step-number {
  background: var(--color-success);
  color: white;
}

.dns-step-content {
  flex: 1;
}

.dns-step-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 2px;
}

.dns-step-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

/* 响应式 */
@media (max-width: 640px) {
  .dns-flow {
    grid-template-columns: repeat(2, 1fr);
  }

  .dns-server {
    padding: var(--spacing-sm);
  }

  .dns-server-icon {
    font-size: 20px;
  }

  .dns-result-ip {
    font-size: 14px;
  }
}
</style>
