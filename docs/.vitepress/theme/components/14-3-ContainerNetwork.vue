<script setup lang="ts">
import { ref } from 'vue'
import { useAnimation } from '../composables/useAnimation'

const { delay } = useAnimation()

interface Container {
  id: string
  name: string
  icon: string
  color: string
  ip: string
  port: string
  status: 'running' | 'stopped'
}

interface NetworkMode {
  id: string
  name: string
  icon: string
  description: string
  containers: Container[]
  features: string[]
}

const networkModes: NetworkMode[] = [
  {
    id: 'bridge',
    name: 'Bridge 网络',
    icon: '🌉',
    description: '默认网络模式，容器间可通信',
    features: ['容器间互通', '端口映射', '网络隔离', 'NAT 转换'],
    containers: [
      { id: 'web', name: 'Web 服务', icon: '🌐', color: '#007aff', ip: '172.17.0.2', port: '3000', status: 'running' },
      { id: 'api', name: 'API 服务', icon: '⚙️', color: '#5856d6', ip: '172.17.0.3', port: '8080', status: 'running' },
      { id: 'db', name: '数据库', icon: '💾', color: '#34c759', ip: '172.17.0.4', port: '5432', status: 'running' }
    ]
  },
  {
    id: 'host',
    name: 'Host 网络',
    icon: '🖥️',
    description: '直接使用宿主机网络',
    features: ['性能最优', '无端口映射', '共享网络栈', '无网络隔离'],
    containers: [
      { id: 'monitor', name: '监控服务', icon: '📊', color: '#ff9500', ip: 'host', port: '9090', status: 'running' },
      { id: 'proxy', name: '代理服务', icon: '🔀', color: '#ff3b30', ip: 'host', port: '80', status: 'running' }
    ]
  },
  {
    id: 'none',
    name: 'None 网络',
    icon: '🚫',
    description: '完全隔离，无网络访问',
    features: ['完全隔离', '无网络访问', '最高安全', '适合批处理'],
    containers: [
      { id: 'batch', name: '批处理任务', icon: '📦', color: '#8e8e93', ip: 'none', port: '-', status: 'running' }
    ]
  }
]

const selectedMode = ref<string>('bridge')
const selectedContainer = ref<string | null>(null)
const isConnecting = ref(false)
const connectionPath = ref<string[]>([])

const currentMode = () => networkModes.find(m => m.id === selectedMode.value)

function selectMode(id: string) {
  selectedMode.value = id
  selectedContainer.value = null
  connectionPath.value = []
}

function selectContainer(id: string) {
  selectedContainer.value = selectedContainer.value === id ? null : id
}

async function simulateConnection() {
  if (isConnecting.value || selectedMode.value !== 'bridge') return
  isConnecting.value = true
  connectionPath.value = []

  const containers = currentMode()?.containers || []
  for (let i = 0; i < containers.length; i++) {
    connectionPath.value.push(containers[i].id)
    await delay(600)
  }

  await delay(1000)
  isConnecting.value = false
  connectionPath.value = []
}

function isInPath(containerId: string) {
  return connectionPath.value.includes(containerId)
}

function getConnectionIndex(containerId: string) {
  return connectionPath.value.indexOf(containerId)
}
</script>

<template>
  <div class="network-container">
    <div class="network-header">
      <h3 class="network-title">🐳 容器网络架构</h3>
      <button
        v-if="selectedMode === 'bridge'"
        class="connect-btn"
        :class="{ connecting: isConnecting }"
        @click="simulateConnection"
        :disabled="isConnecting"
      >
        {{ isConnecting ? '连接中...' : '🔗 模拟通信' }}
      </button>
    </div>

    <div class="mode-selector">
      <button
        v-for="mode in networkModes"
        :key="mode.id"
        class="mode-btn"
        :class="{ active: selectedMode === mode.id }"
        @click="selectMode(mode.id)"
      >
        <span class="mode-icon">{{ mode.icon }}</span>
        <span class="mode-name">{{ mode.name }}</span>
      </button>
    </div>

    <div v-if="currentMode()" class="network-content">
      <div class="mode-info">
        <div class="mode-header">
          <span class="mode-icon-large">{{ currentMode()!.icon }}</span>
          <div class="mode-details">
            <div class="mode-title">{{ currentMode()!.name }}</div>
            <div class="mode-desc">{{ currentMode()!.description }}</div>
          </div>
        </div>

        <div class="features-list">
          <div class="features-title">✨ 特性</div>
          <div class="features-grid">
            <span
              v-for="feature in currentMode()!.features"
              :key="feature"
              class="feature-tag"
            >
              {{ feature }}
            </span>
          </div>
        </div>
      </div>

      <div class="containers-section">
        <div class="section-title">📦 容器列表</div>
        <div class="containers-grid">
          <div
            v-for="(container, index) in currentMode()!.containers"
            :key="container.id"
            class="container-card"
            :class="{
              selected: selectedContainer === container.id,
              connecting: isInPath(container.id)
            }"
            :style="{ '--container-color': container.color }"
            @click="selectContainer(container.id)"
          >
            <div class="container-header">
              <div class="container-icon" :style="{ background: container.color }">
                {{ container.icon }}
              </div>
              <div class="container-info">
                <div class="container-name">{{ container.name }}</div>
                <div class="container-status">
                  <span class="status-dot" :class="container.status"></span>
                  {{ container.status === 'running' ? '运行中' : '已停止' }}
                </div>
              </div>
            </div>

            <div class="container-details">
              <div class="detail-row">
                <span class="detail-label">IP 地址</span>
                <span class="detail-value">{{ container.ip }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">端口</span>
                <span class="detail-value">{{ container.port }}</span>
              </div>
            </div>

            <div v-if="isInPath(container.id)" class="connection-indicator">
              <div class="connection-pulse"></div>
              <span class="connection-order">{{ getConnectionIndex(container.id) + 1 }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedMode === 'bridge'" class="network-diagram">
        <div class="diagram-title">🌉 Bridge 网络拓扑</div>
        <div class="diagram-content">
          <div class="host-box">
            <div class="host-label">宿主机</div>
            <div class="host-ip">192.168.1.100</div>
          </div>

          <div class="bridge-line">
            <div class="bridge-label">docker0 网桥</div>
            <div class="bridge-ip">172.17.0.1</div>
          </div>

          <div class="containers-row">
            <div
              v-for="container in currentMode()!.containers"
              :key="container.id"
              class="diagram-container"
              :class="{ active: isInPath(container.id) }"
              :style="{ '--container-color': container.color }"
            >
              <div class="diagram-icon">{{ container.icon }}</div>
              <div class="diagram-name">{{ container.name }}</div>
              <div class="diagram-ip">{{ container.ip }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.network-container {
  background: var(--vp-c-bg-soft);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.network-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.network-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
}

.connect-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.connect-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.connect-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.connect-btn.connecting {
  animation: pulse 1s infinite;
}

.mode-selector {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--component-bg);
  border: 2px solid var(--component-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
  color: var(--vp-c-text-1);
}

.mode-btn:hover {
  border-color: var(--vp-c-brand);
}

.mode-btn.active {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-dimm);
  color: var(--vp-c-brand);
}

.mode-icon {
  font-size: 18px;
}

.network-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.mode-info {
  background: var(--component-bg);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.mode-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.mode-icon-large {
  font-size: 40px;
  flex-shrink: 0;
}

.mode-details {
  flex: 1;
}

.mode-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.mode-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.features-list {
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--component-border);
}

.features-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: var(--spacing-sm);
}

.features-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.feature-tag {
  padding: 4px 12px;
  background: rgba(0, 122, 255, 0.1);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
}

.containers-section {
  background: var(--component-bg);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: var(--spacing-md);
}

.containers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.container-card {
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--component-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.container-card:hover {
  border-color: var(--container-color);
  transform: translateY(-2px);
}

.container-card.selected {
  border-color: var(--container-color);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.container-card.connecting {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-dimm);
}

.container-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.container-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.container-info {
  flex: 1;
  min-width: 0;
}

.container-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 2px;
}

.container-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success);
}

.status-dot.stopped {
  background: var(--vp-c-text-3);
}

.container-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.detail-label {
  color: var(--vp-c-text-2);
}

.detail-value {
  font-family: var(--font-mono);
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.connection-indicator {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: 4px;
}

.connection-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  animation: pulse 1s infinite;
}

.connection-order {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}

.network-diagram {
  background: var(--component-bg);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.diagram-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: var(--spacing-md);
}

.diagram-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.host-box {
  padding: var(--spacing-md);
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--component-border);
  border-radius: var(--radius-md);
  text-align: center;
  min-width: 200px;
}

.host-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.host-ip {
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--vp-c-text-2);
}

.bridge-line {
  width: 2px;
  height: 40px;
  background: var(--component-border);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bridge-line::before {
  content: '';
  position: absolute;
  width: 100px;
  height: 2px;
  background: var(--component-border);
  left: 50%;
  transform: translateX(-50%);
}

.bridge-label {
  position: absolute;
  left: 120%;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background: var(--component-bg);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.bridge-ip {
  position: absolute;
  left: 120%;
  top: 20px;
  white-space: nowrap;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--vp-c-text-2);
  background: var(--component-bg);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.containers-row {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  justify-content: center;
}

.diagram-container {
  padding: var(--spacing-md);
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--component-border);
  border-radius: var(--radius-md);
  text-align: center;
  min-width: 120px;
  transition: all var(--transition-base);
}

.diagram-container.active {
  border-color: var(--container-color);
  background: var(--vp-c-brand-dimm);
}

.diagram-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.diagram-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 2px;
}

.diagram-ip {
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .network-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .connect-btn {
    width: 100%;
  }

  .mode-selector {
    flex-direction: column;
  }

  .mode-btn {
    width: 100%;
  }

  .containers-grid {
    grid-template-columns: 1fr;
  }

  .bridge-label,
  .bridge-ip {
    left: 50%;
    transform: translateX(-50%);
    top: auto;
  }

  .bridge-label {
    bottom: 100%;
    margin-bottom: 4px;
  }

  .bridge-ip {
    top: 100%;
    margin-top: 4px;
  }
}
</style>
