<script setup lang="ts">
interface GitZone {
  id: string
  icon: string
  nameCn: string
  nameEn: string
  description: string
  color: string
}

interface GitArrow {
  command: string
  description: string
}

const zones: GitZone[] = [
  {
    id: 'working',
    icon: '📝',
    nameCn: '工作区',
    nameEn: 'Working Directory',
    description: '你正在编辑的项目文件',
    color: '#2eb3df'
  },
  {
    id: 'staging',
    icon: '📦',
    nameCn: '暂存区',
    nameEn: 'Staging Area',
    description: '已标记、准备提交的修改',
    color: '#D4952C'
  },
  {
    id: 'repository',
    icon: '🗄️',
    nameCn: '本地仓库',
    nameEn: 'Local Repository',
    description: '永久保存的版本历史记录',
    color: '#15a051'
  }
]

const arrows: GitArrow[] = [
  {
    command: 'git add',
    description: '暂存修改'
  },
  {
    command: 'git commit',
    description: '提交到仓库'
  }
]
</script>

<template>
  <div class="git-flow-wrapper">
    <div class="flow-container">
      <template v-for="(zone, index) in zones" :key="zone.id">
        <div class="zone-card" :style="{ borderColor: zone.color }">
          <div class="zone-icon-wrap" :style="{ backgroundColor: zone.color }">
            <span class="zone-icon">{{ zone.icon }}</span>
          </div>
          <div class="zone-info">
            <h4 class="zone-name" :style="{ color: zone.color }">{{ zone.nameCn }}</h4>
            <span class="zone-name-en">{{ zone.nameEn }}</span>
            <p class="zone-desc">{{ zone.description }}</p>
          </div>
        </div>

        <div v-if="index < zones.length - 1" class="arrow-connector">
          <div class="arrow-line">
            <svg class="arrow-svg" viewBox="0 0 60 24" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="12" x2="48" y2="12" stroke="var(--vp-c-text-3)" stroke-width="2" />
              <polygon points="48,6 60,12 48,18" fill="var(--vp-c-text-3)" />
            </svg>
          </div>
          <code class="arrow-command">{{ arrows[index].command }}</code>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.git-flow-wrapper {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.flow-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.zone-card {
  flex: 1;
  background: var(--component-bg);
  border: 2px solid;
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-sm);
}

.zone-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.zone-icon {
  font-size: 24px;
  line-height: 1;
}

.zone-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.zone-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
}

.zone-name-en {
  font-size: 12px;
  color: var(--component-text-secondary);
  font-family: var(--font-mono);
}

.zone-desc {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.arrow-connector {
  flex: 0 0 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.arrow-line {
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-svg {
  width: 60px;
  height: 24px;
}

.arrow-command {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  padding: 2px var(--spacing-sm);
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .git-flow-wrapper {
    padding: var(--spacing-md);
  }

  .flow-container {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .zone-card {
    width: 100%;
    flex-direction: row;
    text-align: left;
    align-items: center;
  }

  .zone-info {
    align-items: flex-start;
  }

  .arrow-connector {
    flex: 0 0 auto;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    gap: var(--spacing-sm);
  }

  .arrow-svg {
    width: 40px;
    height: 24px;
    transform: rotate(90deg);
  }
}
</style>
