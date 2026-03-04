<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnimation } from '../composables/useAnimation'

interface Scenario {
  id: string
  name: string
  emoji: string
  color: string
  bgGradient: string
  title: string
  subtitle: string
  scene: {
    elements: Array<{
      type: 'device' | 'cloud' | 'router' | 'user'
      icon: string
      label: string
      x: number
      y: number
      scale?: number
    }>
    connections: Array<{
      from: number
      to: number
      style: 'solid' | 'dashed' | 'dotted'
      animated: boolean
    }>
  }
  stats: {
    speed: number
    stability: number
    range: number
  }
  tips: string[]
}

const scenarios: Scenario[] = [
  {
    id: 'lan',
    name: '局域网直连',
    emoji: '🏠',
    color: '#7c9299',
    bgGradient: 'linear-gradient(135deg, #8b9a9f 0%, #6b7c82 100%)',
    title: '同一屋檐下',
    subtitle: '手机和电脑在同一个 WiFi',
    scene: {
      elements: [
        { type: 'router', icon: '📶', label: 'WiFi', x: 50, y: 25, scale: 1.2 },
        { type: 'device', icon: '💻', label: '你的电脑', x: 30, y: 60 },
        { type: 'device', icon: '📱', label: '你的手机', x: 70, y: 60 }
      ],
      connections: [
        { from: 0, to: 1, style: 'solid', animated: true },
        { from: 0, to: 2, style: 'solid', animated: true }
      ]
    },
    stats: { speed: 95, stability: 85, range: 20 },
    tips: ['最快速', '最简单', '只能同一 WiFi']
  },
  {
    id: 'tunnel',
    name: '内网穿透',
    emoji: '🌉',
    color: '#b8927d',
    bgGradient: 'linear-gradient(135deg, #c9a58a 0%, #a67c6d 100%)',
    title: '搭个临时桥',
    subtitle: '通过隧道服务器中转',
    scene: {
      elements: [
        { type: 'device', icon: '💻', label: '你的电脑', x: 15, y: 50 },
        { type: 'cloud', icon: '🌐', label: '隧道服务', x: 50, y: 30, scale: 1.3 },
        { type: 'user', icon: '👤', label: '远方朋友', x: 85, y: 50 }
      ],
      connections: [
        { from: 0, to: 1, style: 'dashed', animated: true },
        { from: 1, to: 2, style: 'dashed', animated: true }
      ]
    },
    stats: { speed: 60, stability: 50, range: 70 },
    tips: ['临时方案', '电脑要开着', '链接会变']
  },
  {
    id: 'deploy',
    name: '正式部署',
    emoji: '🚀',
    color: '#8b9d77',
    bgGradient: 'linear-gradient(135deg, #9aab88 0%, #7a8a6e 100%)',
    title: '上云端',
    subtitle: '部署到服务器，全球访问',
    scene: {
      elements: [
        { type: 'cloud', icon: '☁️', label: '云服务器', x: 50, y: 25, scale: 1.4 },
        { type: 'user', icon: '🌍', label: '北京用户', x: 25, y: 70 },
        { type: 'user', icon: '🌏', label: '上海用户', x: 50, y: 75 },
        { type: 'user', icon: '🌎', label: '纽约用户', x: 75, y: 70 }
      ],
      connections: [
        { from: 0, to: 1, style: 'solid', animated: true },
        { from: 0, to: 2, style: 'solid', animated: true },
        { from: 0, to: 3, style: 'solid', animated: true }
      ]
    },
    stats: { speed: 85, stability: 98, range: 100 },
    tips: ['最稳定', '永久访问', '需要学习']
  }
]

const activeScenario = ref(0)
const isPlaying = ref(false)
const { delay } = useAnimation()

const current = computed(() => scenarios[activeScenario.value])

function selectScenario(index: number) {
  if (isPlaying.value) return
  activeScenario.value = index
}

async function autoPlay() {
  if (isPlaying.value) return
  isPlaying.value = true

  for (let i = 0; i < scenarios.length; i++) {
    activeScenario.value = i
    await delay(3000)
  }

  isPlaying.value = false
}
</script>

<template>
  <div class="scenario-wrapper">
    <!-- 场景选择器 -->
    <div class="scenario-selector">
      <button
        v-for="(scenario, index) in scenarios"
        :key="scenario.id"
        class="scenario-btn"
        :class="{ active: activeScenario === index }"
        :style="{ '--btn-color': scenario.color }"
        @click="selectScenario(index)"
      >
        <span class="scenario-emoji">{{ scenario.emoji }}</span>
        <span class="scenario-name">{{ scenario.name }}</span>
      </button>
      <button class="play-btn" @click="autoPlay" :disabled="isPlaying">
        {{ isPlaying ? '⏸️' : '▶️' }}
      </button>
    </div>

    <!-- 主场景展示 -->
    <Transition name="scene-fade" mode="out-in">
      <div
        :key="activeScenario"
        class="scene-stage"
        :style="{ background: current.bgGradient }"
      >
        <!-- 场景标题 -->
        <div class="scene-header">
          <div class="scene-emoji">{{ current.emoji }}</div>
          <div class="scene-text">
            <h3 class="scene-title">{{ current.title }}</h3>
            <p class="scene-subtitle">{{ current.subtitle }}</p>
          </div>
        </div>

        <!-- SVG 连接线 -->
        <svg class="scene-connections" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:rgba(255,255,255,0.3)" />
              <stop offset="50%" style="stop-color:rgba(255,255,255,0.8)" />
              <stop offset="100%" style="stop-color:rgba(255,255,255,0.3)" />
            </linearGradient>
          </defs>
          <g v-for="(conn, idx) in current.scene.connections" :key="idx">
            <line
              :x1="current.scene.elements[conn.from].x"
              :y1="current.scene.elements[conn.from].y"
              :x2="current.scene.elements[conn.to].x"
              :y2="current.scene.elements[conn.to].y"
              stroke="url(#lineGradient)"
              stroke-width="0.8"
              :stroke-dasharray="conn.style === 'dashed' ? '4,4' : conn.style === 'dotted' ? '2,2' : 'none'"
              class="connection-line"
              :class="{ animated: conn.animated }"
            />
          </g>
        </svg>

        <!-- 场景元素 -->
        <div
          v-for="(element, idx) in current.scene.elements"
          :key="idx"
          class="scene-element"
          :style="{
            left: element.x + '%',
            top: element.y + '%',
            animationDelay: `${idx * 0.1}s`
          }"
        >
          <div
            class="element-icon"
            :style="{ transform: `scale(${element.scale || 1})` }"
          >
            {{ element.icon }}
          </div>
          <div class="element-label">{{ element.label }}</div>

          <!-- 数据包动画 -->
          <div v-if="idx === 0" class="data-packet" />
        </div>
      </div>
    </Transition>

    <!-- 特性对比 -->
    <div class="stats-panel">
      <div class="stat-item">
        <div class="stat-icon">⚡</div>
        <div class="stat-info">
          <div class="stat-label">便利性</div>
          <div class="stat-bar">
            <div
              class="stat-fill"
              :style="{
                width: current.stats.speed + '%',
                backgroundColor: current.color
              }"
            />
          </div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">🛡️</div>
        <div class="stat-info">
          <div class="stat-label">稳定性</div>
          <div class="stat-bar">
            <div
              class="stat-fill"
              :style="{
                width: current.stats.stability + '%',
                backgroundColor: current.color
              }"
            />
          </div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">🌐</div>
        <div class="stat-info">
          <div class="stat-label">覆盖范围</div>
          <div class="stat-bar">
            <div
              class="stat-fill"
              :style="{
                width: current.stats.range + '%',
                backgroundColor: current.color
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 提示标签 -->
    <div class="tips-panel">
      <span
        v-for="(tip, idx) in current.tips"
        :key="idx"
        class="tip-tag"
        :style="{
          backgroundColor: current.color + '20',
          color: current.color,
          animationDelay: `${idx * 0.1}s`
        }"
      >
        {{ tip }}
      </span>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.scenario-wrapper {
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-xl);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-xl);
}

/* 场景选择器 */
.scenario-selector {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-sm);
  background: var(--vp-c-bg);
  border-radius: var(--radius-lg);
}

.scenario-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.scenario-btn:hover {
  background: var(--vp-c-bg-soft);
  transform: translateY(-2px);
}

.scenario-btn.active {
  background: var(--vp-c-bg-soft);
  border-color: var(--btn-color);
  color: var(--vp-c-text-1);
  box-shadow: var(--shadow-md);
}

.scenario-emoji {
  font-size: 24px;
}

.play-btn {
  padding: var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  background: var(--vp-c-brand);
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all var(--transition-base);
}

.play-btn:hover:not(:disabled) {
  transform: scale(1.1);
}

.play-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 场景舞台 */
.scene-stage {
  position: relative;
  height: 400px;
  margin-bottom: var(--spacing-lg);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.scene-header {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  z-index: 10;
}

.scene-emoji {
  font-size: 28px;
  animation: scene-bounce 2s ease-in-out infinite;
}

@keyframes scene-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.scene-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.scene-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.scene-subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

/* SVG 连接线 */
.scene-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.connection-line.animated {
  stroke-dashoffset: 100;
  animation: line-flow 3s linear infinite;
}

@keyframes line-flow {
  to { stroke-dashoffset: 0; }
}

/* 场景元素 */
.scene-element {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  z-index: 5;
  animation: element-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) backwards;
}

@keyframes element-pop {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.element-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: element-float 3s ease-in-out infinite;
}

@keyframes element-float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

.element-label {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  box-shadow: var(--shadow-sm);
}

/* 数据包动画 */
.data-packet {
  position: absolute;
  width: 16px;
  height: 16px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  animation: packet-fly 4s ease-in-out infinite;
}

@keyframes packet-fly {
  0%, 100% {
    transform: translate(0, 0);
    opacity: 1;
  }
  25% {
    transform: translate(150px, -80px);
    opacity: 0.6;
  }
  50% {
    transform: translate(300px, 0);
    opacity: 0.3;
  }
  75% {
    transform: translate(150px, 80px);
    opacity: 0.6;
  }
}

/* 特性面板 */
.stats-panel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--vp-c-bg);
  border-radius: var(--radius-lg);
}

.stat-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.stat-bar {
  height: 8px;
  background: var(--vp-c-divider);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 提示标签 */
.tips-panel {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.tip-tag {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
  animation: tip-appear 0.5s ease-out backwards;
}

@keyframes tip-appear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 场景切换动画 */
.scene-fade-enter-active,
.scene-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.scene-fade-enter-from {
  opacity: 0;
  transform: scale(0.9) rotateY(-10deg);
}

.scene-fade-leave-to {
  opacity: 0;
  transform: scale(1.1) rotateY(10deg);
}

/* 响应式 */
@media (max-width: 768px) {
  .scenario-wrapper {
    padding: var(--spacing-md);
  }

  .scenario-selector {
    flex-direction: column;
  }

  .scenario-btn {
    width: 100%;
  }

  .scene-stage {
    height: 320px;
  }

  .element-icon {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }

  .stats-panel {
    grid-template-columns: 1fr;
  }
}
</style>
