<script setup lang="ts">
import { ref } from 'vue'

interface Zone {
  id: string
  name: string
  description: string
  color: string
  icon: string
  examples: string[]
}

const zones: Zone[] = [
  {
    id: 'working',
    name: '工作区',
    description: '你正在编辑的文件',
    color: '#2eb3df',
    icon: '📝',
    examples: ['修改 index.tsx', '新建 utils.ts', '删除 old.css']
  },
  {
    id: 'staging',
    name: '暂存区',
    description: '准备提交的修改',
    color: '#D4952C',
    icon: '📦',
    examples: ['git add index.tsx', 'git add utils.ts']
  },
  {
    id: 'repository',
    name: '本地仓库',
    description: '已保存的版本历史',
    color: '#15a051',
    icon: '🗄️',
    examples: ['git commit -m "添加工具函数"']
  }
]

const activeZone = ref<string | null>(null)
const filePosition = ref<string>('working')

function handleZoneClick(zoneId: string) {
  activeZone.value = activeZone.value === zoneId ? null : zoneId
}

function moveFile(direction: 'add' | 'commit' | 'reset') {
  if (direction === 'add' && filePosition.value === 'working') {
    filePosition.value = 'staging'
  } else if (direction === 'commit' && filePosition.value === 'staging') {
    filePosition.value = 'repository'
  } else if (direction === 'reset') {
    filePosition.value = 'working'
  }
}

function getZoneData(id: string) {
  return zones.find(z => z.id === id)
}
</script>

<template>
  <div class="three-zone-wrapper">
    <div class="zones-flow">
      <div
        v-for="(zone, index) in zones"
        :key="zone.id"
        class="zone-group"
      >
        <div
          class="zone-card"
          :class="{ active: activeZone === zone.id, 'has-file': filePosition === zone.id }"
          :style="{ borderColor: zone.color }"
          @click="handleZoneClick(zone.id)"
        >
          <div class="zone-header">
            <span class="zone-icon">{{ zone.icon }}</span>
            <h4 class="zone-name" :style="{ color: zone.color }">{{ zone.name }}</h4>
          </div>

          <p class="zone-description">{{ zone.description }}</p>

          <Transition name="fade">
            <div v-if="activeZone === zone.id" class="zone-examples">
              <div class="examples-label">操作示例：</div>
              <ul>
                <li v-for="(example, idx) in zone.examples" :key="idx">
                  <code>{{ example }}</code>
                </li>
              </ul>
            </div>
          </Transition>

          <Transition name="file-move">
            <div v-if="filePosition === zone.id" class="file-indicator">
              <span class="file-icon">📄</span>
              <span class="file-label">index.tsx</span>
            </div>
          </Transition>
        </div>

        <div v-if="index < zones.length - 1" class="zone-arrow">
          <button
            v-if="index === 0"
            class="arrow-btn"
            :disabled="filePosition !== 'working'"
            @click="moveFile('add')"
          >
            <span class="arrow-icon">→</span>
            <span class="arrow-label">git add</span>
          </button>
          <button
            v-else
            class="arrow-btn"
            :disabled="filePosition !== 'staging'"
            @click="moveFile('commit')"
          >
            <span class="arrow-icon">→</span>
            <span class="arrow-label">git commit</span>
          </button>
        </div>
      </div>
    </div>

    <div class="control-panel">
      <button class="reset-btn" @click="moveFile('reset')">
        <span>🔄</span>
        <span>重置演示</span>
      </button>
      <div class="hint-text">
        点击卡片查看详情，点击箭头按钮模拟文件流转
      </div>
    </div>

    <div class="status-info">
      <h4 class="status-title">git status 会显示什么？</h4>
      <div class="status-content">
        <div v-if="filePosition === 'working'" class="status-item">
          <span class="status-label">未暂存的修改：</span>
          <code class="status-file">modified: index.tsx</code>
        </div>
        <div v-else-if="filePosition === 'staging'" class="status-item">
          <span class="status-label">已暂存的修改：</span>
          <code class="status-file">modified: index.tsx</code>
        </div>
        <div v-else class="status-item">
          <span class="status-label">工作区干净：</span>
          <span class="status-clean">nothing to commit, working tree clean</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.three-zone-wrapper {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.zones-flow {
  display: flex;
  align-items: stretch;
  gap: 0;
  margin-bottom: var(--spacing-xl);
}

.zone-group {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0;
}

.zone-card {
  flex: 1;
  background: var(--component-bg);
  border: 2px solid;
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  min-height: 180px;
  display: flex;
  flex-direction: column;
}

.zone-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.zone-card.active {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.zone-card.has-file {
  background: var(--vp-c-bg-soft);
}

.zone-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.zone-icon {
  font-size: 24px;
}

.zone-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.zone-description {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 14px;
  color: var(--component-text-secondary);
  line-height: 1.5;
}

.zone-examples {
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--component-border);
}

.examples-label {
  font-size: 12px;
  color: var(--component-text-secondary);
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.zone-examples ul {
  margin: 0;
  padding-left: var(--spacing-md);
  list-style: none;
}

.zone-examples li {
  font-size: 13px;
  margin-bottom: var(--spacing-xs);
}

.zone-examples code {
  font-family: var(--font-mono);
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--vp-c-brand);
}

.file-indicator {
  position: absolute;
  bottom: var(--spacing-sm);
  right: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--vp-c-brand);
  color: white;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
}

.file-icon {
  font-size: 14px;
}

.zone-arrow {
  flex: 0 0 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--spacing-sm);
}

.arrow-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background: var(--component-bg);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.arrow-btn:hover:not(:disabled) {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
  transform: scale(1.05);
}

.arrow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.arrow-icon {
  font-size: 20px;
}

.arrow-label {
  font-family: var(--font-mono);
  font-weight: 500;
}

.control-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--component-bg);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-base);
}

.reset-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.hint-text {
  font-size: 13px;
  color: var(--component-text-secondary);
}

.status-info {
  background: var(--component-bg);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.status-title {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.status-content {
  font-size: 14px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.status-label {
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.status-file {
  font-family: var(--font-mono);
  background: var(--vp-c-bg-soft);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-warning);
  display: inline-block;
}

.status-clean {
  font-family: var(--font-mono);
  color: var(--color-success);
  font-size: 13px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all var(--transition-base);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.file-move-enter-active,
.file-move-leave-active {
  transition: all 0.4s ease;
}

.file-move-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.file-move-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 640px) {
  .three-zone-wrapper {
    padding: var(--spacing-md);
  }

  .zones-flow {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .zone-group {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .zone-card {
    min-height: 140px;
  }

  .zone-arrow {
    flex: 0 0 auto;
    width: 100%;
    padding: 0;
  }

  .arrow-btn {
    flex-direction: row;
    width: 100%;
  }

  .arrow-icon {
    transform: rotate(90deg);
  }

  .control-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .hint-text {
    text-align: center;
  }
}
</style>
