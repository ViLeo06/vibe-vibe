<script setup lang="ts">
import { ref } from 'vue'

interface Platform {
  name: string
  icon: string
  color: string
  speed: string
  cost: string
  difficulty: string
  suitable: string
  note: string
}

const platforms: Platform[] = [
  {
    name: '腾讯云 EdgeOne Pages',
    icon: '🌐',
    color: '#7c9299',
    speed: '国内快',
    cost: '免费额度慷慨',
    difficulty: '简单',
    suitable: '国内用户为主',
    note: '基于腾讯全球边缘网络，对 Next.js 支持好'
  },
  {
    name: '阿里云 ESA',
    icon: '☁️',
    color: '#8b9d77',
    speed: '国内快',
    cost: '免费额度充足',
    difficulty: '简单',
    suitable: '国内项目',
    note: '深度集成 Git 工作流，国内访问速度快'
  },
  {
    name: 'Vercel',
    icon: '▲',
    color: '#b8927d',
    speed: '国外快',
    cost: '免费版有限制',
    difficulty: '极简',
    suitable: '海外用户或有域名',
    note: 'Next.js 官方平台，体验最佳但国内慢'
  },
  {
    name: 'Cloudflare Pages',
    icon: '🔶',
    color: '#7c9299',
    speed: '全球均衡',
    cost: '免费额度大',
    difficulty: '简单',
    suitable: '全球用户',
    note: '全球 CDN 加速，支持边缘函数'
  },
  {
    name: 'GitHub Pages',
    icon: '📄',
    color: '#8b9d77',
    speed: '国外快',
    cost: '完全免费',
    difficulty: '最简',
    suitable: '纯静态网站',
    note: '只能托管静态文件，无服务端功能'
  }
]

const selectedPlatform = ref<string | null>(null)

function selectPlatform(name: string) {
  selectedPlatform.value = selectedPlatform.value === name ? null : name
}
</script>

<template>
  <div class="deploy-comparison">
    <div class="comparison-header">
      <h3 class="comparison-title">部署平台对比</h3>
      <p class="comparison-desc">选择适合你的部署平台</p>
    </div>

    <div class="platforms-table">
      <div class="table-header">
        <div class="header-cell platform-col">平台</div>
        <div class="header-cell">访问速度</div>
        <div class="header-cell">成本</div>
        <div class="header-cell">难度</div>
        <div class="header-cell">适合场景</div>
      </div>

      <div
        v-for="platform in platforms"
        :key="platform.name"
        class="table-row"
        :class="{ selected: selectedPlatform === platform.name }"
        @click="selectPlatform(platform.name)"
      >
        <div class="row-cell platform-col">
          <span class="platform-icon" :style="{ color: platform.color }">{{ platform.icon }}</span>
          <span class="platform-name">{{ platform.name }}</span>
        </div>
        <div class="row-cell">{{ platform.speed }}</div>
        <div class="row-cell">{{ platform.cost }}</div>
        <div class="row-cell">
          <span class="difficulty-badge">{{ platform.difficulty }}</span>
        </div>
        <div class="row-cell">{{ platform.suitable }}</div>
      </div>
    </div>

    <!-- 选中平台的详细说明 -->
    <Transition name="fade">
      <div v-if="selectedPlatform" class="platform-detail">
        <div class="detail-icon" :style="{ color: platforms.find(p => p.name === selectedPlatform)?.color }">
          {{ platforms.find(p => p.name === selectedPlatform)?.icon }}
        </div>
        <div class="detail-content">
          <h4 class="detail-title">{{ selectedPlatform }}</h4>
          <p class="detail-note">{{ platforms.find(p => p.name === selectedPlatform)?.note }}</p>
        </div>
      </div>
    </Transition>

    <div class="comparison-tip">
      <span class="tip-icon">💡</span>
      <span class="tip-text">点击表格行查看详细说明。推荐国内项目优先选择 EdgeOne 或 ESA</span>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.deploy-comparison {
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-xl);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-xl);
}

/* 头部 */
.comparison-header {
  margin-bottom: var(--spacing-lg);
}

.comparison-title {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.comparison-desc {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

/* 表格 */
.platforms-table {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--spacing-lg);
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1.2fr 0.8fr 1.2fr;
  background: var(--vp-c-bg-soft);
  border-bottom: 2px solid var(--vp-c-divider);
}

.header-cell {
  padding: var(--spacing-md);
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-align: left;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1.2fr 0.8fr 1.2fr;
  border-bottom: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all var(--transition-base);
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: var(--vp-c-bg-soft);
}

.table-row.selected {
  background: rgba(124, 146, 153, 0.1);
  border-left: 3px solid #7c9299;
}

.row-cell {
  padding: var(--spacing-md);
  font-size: 13px;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
}

.platform-col {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.platform-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.platform-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.difficulty-badge {
  padding: 2px var(--spacing-sm);
  background: rgba(139, 157, 119, 0.15);
  color: #8b9d77;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
}

/* 详细说明 */
.platform-detail {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
}

.detail-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.detail-content {
  flex: 1;
}

.detail-title {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.detail-note {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* 提示 */
.comparison-tip {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
}

.tip-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.tip-text {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式 */
@media (max-width: 768px) {
  .deploy-comparison {
    padding: var(--spacing-md);
  }

  .platforms-table {
    overflow-x: auto;
  }

  .table-header,
  .table-row {
    grid-template-columns: 180px 80px 100px 70px 100px;
    min-width: 530px;
  }

  .header-cell,
  .row-cell {
    padding: var(--spacing-sm);
    font-size: 12px;
  }

  .platform-icon {
    font-size: 18px;
  }

  .platform-name {
    font-size: 12px;
  }

  .platform-detail {
    flex-direction: column;
    text-align: center;
  }

  .detail-icon {
    font-size: 32px;
  }

  .detail-title {
    font-size: 14px;
  }

  .detail-note {
    font-size: 13px;
  }
}
</style>
