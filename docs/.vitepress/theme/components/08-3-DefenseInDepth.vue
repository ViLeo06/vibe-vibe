<script setup lang="ts">
import { ref } from 'vue'
import { useAnimation } from '../composables/useAnimation'

const { delay } = useAnimation()

interface DefenseLayer {
  id: string
  name: string
  icon: string
  color: string
  description: string
  measures: string[]
  threats: string[]
}

const layers: DefenseLayer[] = [
  {
    id: 'perimeter',
    name: '边界防护',
    icon: '🛡️',
    color: '#ff3b30',
    description: '第一道防线，阻挡外部攻击',
    measures: ['防火墙', 'DDoS 防护', 'WAF', 'IP 黑名单'],
    threats: ['暴力破解', 'DDoS 攻击', 'SQL 注入']
  },
  {
    id: 'network',
    name: '网络层',
    icon: '🌐',
    color: '#ff9500',
    description: '控制网络访问和流量',
    measures: ['VPN', 'SSL/TLS', '网络隔离', '流量监控'],
    threats: ['中间人攻击', '数据窃听', '网络嗅探']
  },
  {
    id: 'application',
    name: '应用层',
    icon: '🔐',
    color: '#ffcc00',
    description: '保护应用程序安全',
    measures: ['身份认证', '权限控制', '输入验证', 'CSRF 防护'],
    threats: ['XSS 攻击', 'CSRF 攻击', '权限提升']
  },
  {
    id: 'data',
    name: '数据层',
    icon: '💾',
    color: '#34c759',
    description: '保护数据安全',
    measures: ['数据加密', '访问审计', '备份恢复', 'RLS'],
    threats: ['数据泄露', '数据篡改', '数据丢失']
  },
  {
    id: 'monitoring',
    name: '监控层',
    icon: '👁️',
    color: '#007aff',
    description: '实时监控和响应',
    measures: ['日志审计', '异常检测', '告警通知', '事件响应'],
    threats: ['未知威胁', '内部威胁', '零日漏洞']
  }
]

const selectedLayer = ref<string | null>(null)
const attackStep = ref(0)
const isAttacking = ref(false)

function selectLayer(id: string) {
  selectedLayer.value = selectedLayer.value === id ? null : id
}

async function simulateAttack() {
  if (isAttacking.value) return
  isAttacking.value = true
  attackStep.value = 0

  for (let i = 0; i <= layers.length; i++) {
    attackStep.value = i
    await delay(800)
  }

  await delay(1000)
  isAttacking.value = false
  attackStep.value = 0
}

function getLayerStatus(index: number) {
  if (!isAttacking.value) return 'idle'
  if (attackStep.value > index) return 'blocked'
  if (attackStep.value === index) return 'defending'
  return 'idle'
}
</script>

<template>
  <div class="defense-container">
    <div class="defense-header">
      <h3 class="defense-title">🛡️ 纵深防御架构</h3>
      <button
        class="attack-btn"
        :class="{ attacking: isAttacking }"
        @click="simulateAttack"
        :disabled="isAttacking"
      >
        {{ isAttacking ? '攻击进行中...' : '🎯 模拟攻击' }}
      </button>
    </div>

    <div class="defense-layers">
      <div
        v-for="(layer, index) in layers"
        :key="layer.id"
        class="defense-layer"
        :class="[
          getLayerStatus(index),
          { selected: selectedLayer === layer.id }
        ]"
        :style="{ '--layer-color': layer.color }"
        @click="selectLayer(layer.id)"
      >
        <div class="layer-main">
          <div class="layer-icon">{{ layer.icon }}</div>
          <div class="layer-info">
            <div class="layer-name">{{ layer.name }}</div>
            <div class="layer-desc">{{ layer.description }}</div>
          </div>
          <div class="layer-number">{{ index + 1 }}</div>
        </div>

        <div v-if="selectedLayer === layer.id" class="layer-details">
          <div class="detail-section">
            <div class="section-title">✅ 防护措施</div>
            <div class="measures-grid">
              <span
                v-for="measure in layer.measures"
                :key="measure"
                class="measure-tag"
              >
                {{ measure }}
              </span>
            </div>
          </div>

          <div class="detail-section">
            <div class="section-title">⚠️ 防御威胁</div>
            <div class="threats-list">
              <span
                v-for="threat in layer.threats"
                :key="threat"
                class="threat-tag"
              >
                {{ threat }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="getLayerStatus(index) === 'defending'" class="attack-indicator">
          <div class="attack-wave"></div>
          <span class="attack-text">正在防御...</span>
        </div>

        <div v-if="getLayerStatus(index) === 'blocked'" class="blocked-indicator">
          <span class="blocked-icon">✓</span>
          <span class="blocked-text">已拦截</span>
        </div>
      </div>
    </div>

    <div class="defense-info">
      <div class="info-card">
        <div class="info-icon">🎯</div>
        <div class="info-content">
          <div class="info-title">纵深防御原则</div>
          <div class="info-text">
            多层防护，即使某一层被突破，其他层仍能提供保护
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-icon">🔄</div>
        <div class="info-content">
          <div class="info-title">层层递进</div>
          <div class="info-text">
            从外到内，每一层都有独立的防护机制和监控
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-icon">👁️</div>
        <div class="info-content">
          <div class="info-title">全面监控</div>
          <div class="info-text">
            实时监控所有层级，快速发现和响应安全威胁
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.defense-container {
  background: var(--vp-c-bg-soft);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.defense-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.defense-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
}

.attack-btn {
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

.attack-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.attack-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.attack-btn.attacking {
  animation: pulse 1s infinite;
}

.defense-layers {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.defense-layer {
  background: var(--component-bg);
  border: 2px solid var(--component-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.defense-layer:hover {
  border-color: var(--layer-color);
  transform: translateX(4px);
}

.defense-layer.selected {
  border-color: var(--layer-color);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.defense-layer.defending {
  border-color: var(--color-warning);
  background: rgba(212, 149, 44, 0.05);
}

.defense-layer.blocked {
  border-color: var(--color-success);
  background: rgba(21, 160, 81, 0.05);
}

.layer-main {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.layer-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--layer-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.layer-info {
  flex: 1;
  min-width: 0;
}

.layer-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.layer-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.layer-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  flex-shrink: 0;
}

.layer-details {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--component-border);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  animation: fadeIn 0.3s ease;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.measures-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.measure-tag {
  padding: 4px 12px;
  background: rgba(21, 160, 81, 0.1);
  color: var(--color-success);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
}

.threats-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.threat-tag {
  padding: 4px 12px;
  background: rgba(255, 59, 48, 0.1);
  color: var(--color-error);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
}

.attack-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 149, 44, 0.1);
  pointer-events: none;
}

.attack-wave {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--color-warning);
  animation: wave 1s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

.attack-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-warning);
  z-index: 1;
}

.blocked-indicator {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: var(--color-success);
  color: white;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  animation: fadeIn 0.3s ease;
}

.blocked-icon {
  font-size: 14px;
}

.defense-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--component-bg);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
}

.info-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
  min-width: 0;
}

.info-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.info-text {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

@media (max-width: 640px) {
  .defense-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .attack-btn {
    width: 100%;
  }

  .layer-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .layer-name {
    font-size: 14px;
  }

  .layer-desc {
    font-size: 12px;
  }

  .defense-info {
    grid-template-columns: 1fr;
  }
}
</style>
