<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnimation } from '../composables/useAnimation'

interface Layer {
  id: string
  name: string
  range: string
  color: string
  icon: string
  description: string
  devices: string[]
}

const layers: Layer[] = [
  {
    id: 'localhost',
    name: 'Localhost',
    range: '127.0.0.1',
    color: '#15a051',
    icon: '💻',
    description: '只有本机能访问，数据包不经过网络',
    devices: ['你的电脑']
  },
  {
    id: 'lan',
    name: '局域网 (LAN)',
    range: '192.168.x.x',
    color: '#2eb3df',
    icon: '📱',
    description: '同一 WiFi 下的设备互通',
    devices: ['你的手机', '室友的电脑', '智能电视']
  },
  {
    id: 'wan',
    name: '互联网 (WAN)',
    range: '公网 IP',
    color: '#D4952C',
    icon: '🌐',
    description: '全球任何人都能访问',
    devices: ['北京的朋友', '上海的用户', '全世界']
  }
]

const activeLayer = ref<string>('localhost')
const isAnimating = ref(false)
const { delay } = useAnimation()

const activeLayerData = computed(() =>
  layers.find(l => l.id === activeLayer.value)
)

const layerIndex = computed(() =>
  layers.findIndex(l => l.id === activeLayer.value)
)

async function selectLayer(id: string) {
  if (isAnimating.value || id === activeLayer.value) return
  isAnimating.value = true
  activeLayer.value = id
  await delay(300)
  isAnimating.value = false
}

async function playAnimation() {
  if (isAnimating.value) return
  isAnimating.value = true

  for (let i = 0; i < layers.length; i++) {
    activeLayer.value = layers[i].id
    await delay(1500)
  }

  isAnimating.value = false
}
</script>

<template>
  <div class="nl-wrapper">
    <!-- 控制按钮 -->
    <div class="nl-controls">
      <button
        v-for="layer in layers"
        :key="layer.id"
        class="nl-btn"
        :class="{ active: activeLayer === layer.id }"
        :style="{
          '--btn-color': layer.color,
          borderColor: activeLayer === layer.id ? layer.color : 'transparent'
        }"
        @click="selectLayer(layer.id)"
      >
        <span class="nl-btn-icon">{{ layer.icon }}</span>
        <span class="nl-btn-text">{{ layer.name }}</span>
      </button>
      <button class="nl-btn nl-btn-play" @click="playAnimation" :disabled="isAnimating">
        <span class="nl-btn-icon">▶️</span>
        <span class="nl-btn-text">播放动画</span>
      </button>
    </div>

    <!-- 同心圆可视化 -->
    <div class="nl-circles">
      <!-- 三层圆圈 -->
      <div
        v-for="(layer, index) in layers"
        :key="layer.id"
        class="nl-circle"
        :class="{
          active: layerIndex >= index,
          pulse: activeLayer === layer.id
        }"
        :style="{
          '--circle-size': `${140 + index * 80}px`,
          '--circle-color': layer.color,
          zIndex: layers.length - index
        }"
      >
        <div class="nl-circle-label" v-if="activeLayer === layer.id">
          {{ layer.name }}
        </div>
      </div>

      <!-- 中心设备图标 -->
      <div class="nl-center-device">
        <div class="nl-device-icon">{{ activeLayerData?.icon }}</div>
      </div>

      <!-- 数据包动画 -->
      <div
        v-if="activeLayer !== 'localhost'"
        class="nl-packet"
        :style="{ '--packet-color': activeLayerData?.color }"
      />
    </div>

    <!-- 信息面板 -->
    <Transition name="nl-fade" mode="out-in">
      <div
        v-if="activeLayerData"
        :key="activeLayer"
        class="nl-info"
        :style="{ borderColor: activeLayerData.color }"
      >
        <div class="nl-info-header">
          <span class="nl-info-icon">{{ activeLayerData.icon }}</span>
          <h3 class="nl-info-title" :style="{ color: activeLayerData.color }">
            {{ activeLayerData.name }}
          </h3>
        </div>

        <div class="nl-info-row">
          <span class="nl-info-label">IP 范围</span>
          <code class="nl-info-value">{{ activeLayerData.range }}</code>
        </div>

        <div class="nl-info-row">
          <span class="nl-info-label">说明</span>
          <span class="nl-info-value">{{ activeLayerData.description }}</span>
        </div>

        <div class="nl-info-devices">
          <span class="nl-info-label">可访问设备</span>
          <div class="nl-device-tags">
            <span
              v-for="device in activeLayerData.devices"
              :key="device"
              class="nl-device-tag"
              :style="{ backgroundColor: activeLayerData.color + '20', color: activeLayerData.color }"
            >
              {{ device }}
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.nl-wrapper {
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-xl);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
}

/* 控制按钮 */
.nl-controls {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
}

.nl-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.nl-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.nl-btn.active {
  border-color: var(--btn-color);
  background: var(--vp-c-bg-soft);
}

.nl-btn-play {
  margin-left: auto;
  background: var(--vp-c-brand);
  color: white;
}

.nl-btn-play:hover:not(:disabled) {
  opacity: 0.9;
}

.nl-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nl-btn-icon {
  font-size: 18px;
}

/* 同心圆容器 */
.nl-circles {
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}

/* 圆圈 */
.nl-circle {
  position: absolute;
  width: var(--circle-size);
  height: var(--circle-size);
  border: 3px solid var(--circle-color);
  border-radius: 50%;
  opacity: 0.3;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nl-circle.active {
  opacity: 1;
  border-width: 4px;
}

.nl-circle.pulse {
  animation: nl-pulse 2s ease-in-out infinite;
}

@keyframes nl-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.nl-circle-label {
  position: absolute;
  top: -30px;
  font-size: 13px;
  font-weight: 600;
  color: var(--circle-color);
  background: var(--vp-c-bg);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  box-shadow: var(--shadow-sm);
}

/* 中心设备 */
.nl-center-device {
  position: relative;
  z-index: 100;
  width: 80px;
  height: 80px;
  background: var(--vp-c-bg);
  border: 3px solid var(--vp-c-brand);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
}

.nl-device-icon {
  font-size: 36px;
  animation: nl-bounce 2s ease-in-out infinite;
}

@keyframes nl-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 数据包动画 */
.nl-packet {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--packet-color);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--packet-color);
  animation: nl-packet-move 3s linear infinite;
}

@keyframes nl-packet-move {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(100px, -50px) scale(1.5);
    opacity: 0.6;
  }
  100% {
    transform: translate(150px, 0) scale(0.5);
    opacity: 0;
  }
}

/* 信息面板 */
.nl-info {
  background: var(--vp-c-bg);
  border: 2px solid;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.nl-info-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.nl-info-icon {
  font-size: 28px;
}

.nl-info-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.nl-info-row {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  font-size: 14px;
  line-height: 1.6;
}

.nl-info-label {
  flex-shrink: 0;
  font-weight: 600;
  color: var(--vp-c-text-2);
  min-width: 80px;
}

.nl-info-value {
  color: var(--vp-c-text-1);
}

code.nl-info-value {
  background: var(--vp-c-bg-soft);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 13px;
}

.nl-info-devices {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--vp-c-divider);
}

.nl-device-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
}

.nl-device-tag {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
}

/* 过渡动画 */
.nl-fade-enter-active,
.nl-fade-leave-active {
  transition: all 0.3s ease;
}

.nl-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.nl-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式 */
@media (max-width: 640px) {
  .nl-wrapper {
    padding: var(--spacing-md);
  }

  .nl-controls {
    flex-direction: column;
  }

  .nl-btn {
    width: 100%;
    justify-content: center;
  }

  .nl-btn-play {
    margin-left: 0;
  }

  .nl-circles {
    height: 300px;
  }

  .nl-circle {
    --circle-size: calc(var(--circle-size) * 0.7) !important;
  }

  .nl-center-device {
    width: 60px;
    height: 60px;
  }

  .nl-device-icon {
    font-size: 28px;
  }

  .nl-info-row {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .nl-info-label {
    min-width: auto;
  }
}
</style>
