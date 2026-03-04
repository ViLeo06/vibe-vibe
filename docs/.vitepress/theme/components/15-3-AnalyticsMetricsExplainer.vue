<script setup lang="ts">
import { ref } from 'vue'

interface MetricDetail {
  definition: string
  calculation: string
  benchmark: string
  optimization: string
}

interface Metric {
  id: string
  name: string
  subtitle: string
  mockValue: string
  color: string
  colorBg: string
  detail: MetricDetail
}

const metrics: Metric[] = [
  {
    id: 'pv',
    name: 'PV',
    subtitle: '页面浏览量',
    mockValue: '12,847',
    color: '#007aff',
    colorBg: 'rgba(0, 122, 255, 0.1)',
    detail: {
      definition: '用户打开页面的次数，每次打开算一次',
      calculation: '刷新也算',
      benchmark: '看趋势比看绝对值重要',
      optimization: '优化 SEO 和内容质量',
    },
  },
  {
    id: 'uv',
    name: 'UV',
    subtitle: '独立访客数',
    mockValue: '3,562',
    color: '#15a051',
    colorBg: 'rgba(21, 160, 81, 0.1)',
    detail: {
      definition: '一天内有多少不同的人访问了你的网站',
      calculation: '同一人多次访问只算一次',
      benchmark: '持续增长',
      optimization: '拓展流量渠道',
    },
  },
  {
    id: 'bounce',
    name: '跳出率',
    subtitle: 'Bounce Rate',
    mockValue: '45.2%',
    color: '#D4952C',
    colorBg: 'rgba(212, 149, 44, 0.1)',
    detail: {
      definition: '只看了一个页面就离开的访客比例',
      calculation: '单页会话 / 总会话',
      benchmark: '< 70% 正常，< 50% 优秀',
      optimization: '优化页面加载速度和内容质量',
    },
  },
  {
    id: 'duration',
    name: '平均停留时间',
    subtitle: 'Avg. Duration',
    mockValue: '3m 24s',
    color: '#8b5cf6',
    colorBg: 'rgba(139, 92, 246, 0.1)',
    detail: {
      definition: '用户在你网站上花的平均时间',
      calculation: '总停留时间 / 会话数',
      benchmark: '> 2 分钟',
      optimization: '提供有价值的内容，改善阅读体验',
    },
  },
  {
    id: 'conversion',
    name: '转化率',
    subtitle: 'Conversion Rate',
    mockValue: '3.8%',
    color: '#ff3b30',
    colorBg: 'rgba(255, 59, 48, 0.1)',
    detail: {
      definition: '完成目标操作（注册、购买等）的用户比例',
      calculation: '转化数 / 总访客',
      benchmark: '2-5% 正常',
      optimization: '优化 CTA 和用户体验',
    },
  },
]

const selectedId = ref<string | null>(null)

function toggle(id: string) {
  selectedId.value = selectedId.value === id ? null : id
}

function getMetric(id: string): Metric {
  return metrics.find(m => m.id === id)!
}

const detailLabels: { key: keyof MetricDetail; label: string }[] = [
  { key: 'definition', label: '定义' },
  { key: 'calculation', label: '计算方式' },
  { key: 'benchmark', label: '好的标准' },
  { key: 'optimization', label: '优化建议' },
]
</script>

<template>
  <div class="am-root">
    <div class="am-grid">
      <div
        v-for="metric in metrics"
        :key="metric.id"
        class="am-card"
        :class="{ active: selectedId === metric.id }"
        :style="{
          '--card-color': metric.color,
          '--card-bg': metric.colorBg,
        }"
        @click="toggle(metric.id)"
      >
        <div class="am-card-value">{{ metric.mockValue }}</div>
        <div class="am-card-name">{{ metric.name }}</div>
        <div class="am-card-subtitle">{{ metric.subtitle }}</div>
      </div>
    </div>

    <Transition name="am-slide">
      <div
        v-if="selectedId"
        class="am-detail"
        :style="{ borderColor: getMetric(selectedId).color }"
      >
        <div class="am-detail-header" :style="{ color: getMetric(selectedId).color }">
          {{ getMetric(selectedId).name }} - {{ getMetric(selectedId).subtitle }}
        </div>
        <div class="am-detail-grid">
          <div
            v-for="item in detailLabels"
            :key="item.key"
            class="am-detail-item"
          >
            <div class="am-detail-label">{{ item.label }}</div>
            <div class="am-detail-value">{{ getMetric(selectedId!).detail[item.key] }}</div>
          </div>
        </div>
      </div>
    </Transition>

    <p class="am-hint">点击指标卡片查看详情</p>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.am-root {
  margin: 1.5rem auto;
  max-width: 688px;
}

.am-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
}

.am-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md) var(--spacing-sm);
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  background: var(--card-bg);
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: center;
}

.am-card:hover {
  border-color: var(--card-color);
  transform: translateY(-2px);
}

.am-card.active {
  border-color: var(--card-color);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--card-color) 20%, transparent);
}

.am-card-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--card-color);
  font-family: var(--font-mono);
  line-height: 1.2;
}

.am-card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-top: 6px;
}

.am-card-subtitle {
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin-top: 2px;
}

/* Detail panel */
.am-detail {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 2px solid;
  background: var(--vp-c-bg-soft);
}

.am-detail-header {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
}

.am-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.am-detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.am-detail-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.am-detail-value {
  font-size: 14px;
  color: var(--vp-c-text-1);
  line-height: 1.6;
}

.am-hint {
  text-align: center;
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: 12px;
}

/* Transition */
.am-slide-enter-active,
.am-slide-leave-active {
  transition: all 0.3s ease;
}

.am-slide-enter-from,
.am-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Responsive */
@media (max-width: 640px) {
  .am-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .am-card-value {
    font-size: 18px;
  }

  .am-card-name {
    font-size: 12px;
  }

  .am-detail-grid {
    grid-template-columns: 1fr;
  }

  .am-detail {
    padding: var(--spacing-md);
  }
}
</style>
