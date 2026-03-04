<script setup lang="ts">
import { ref } from 'vue'
import { useAnimation } from '../composables/useAnimation'

const { delay } = useAnimation()

interface SEOStep {
  id: string
  number: number
  title: string
  icon: string
  color: string
  description: string
  actions: {
    name: string
    icon: string
    details: string
  }[]
  tips: string[]
}

const steps: SEOStep[] = [
  {
    id: 'metadata',
    number: 1,
    title: '元数据优化',
    icon: '📝',
    color: '#007aff',
    description: '设置页面的基础 SEO 信息，让搜索引擎理解页面内容',
    actions: [
      {
        name: 'Title 标签',
        icon: '🏷️',
        details: '简洁描述页面主题，50-60 字符'
      },
      {
        name: 'Description',
        icon: '📄',
        details: '吸引用户点击，150-160 字符'
      },
      {
        name: 'Keywords',
        icon: '🔑',
        details: '相关关键词，用逗号分隔'
      },
      {
        name: 'OG 标签',
        icon: '🖼️',
        details: '社交媒体分享预览'
      }
    ],
    tips: [
      '每个页面使用独特的 title',
      'Description 包含目标关键词',
      '使用 OG 标签优化社交分享'
    ]
  },
  {
    id: 'content',
    number: 2,
    title: '内容优化',
    icon: '✍️',
    color: '#34c759',
    description: '创建高质量、结构化的内容，提升用户体验和搜索排名',
    actions: [
      {
        name: '标题层级',
        icon: '📊',
        details: 'H1-H6 合理使用，清晰结构'
      },
      {
        name: '关键词密度',
        icon: '🎯',
        details: '自然融入，避免堆砌'
      },
      {
        name: '内部链接',
        icon: '🔗',
        details: '相关页面互相链接'
      },
      {
        name: '图片优化',
        icon: '🖼️',
        details: 'Alt 文本、压缩、WebP'
      }
    ],
    tips: [
      '内容原创且有价值',
      '定期更新保持新鲜度',
      '使用语义化 HTML 标签'
    ]
  },
  {
    id: 'technical',
    number: 3,
    title: '技术优化',
    icon: '⚙️',
    color: '#ff9500',
    description: '提升网站性能和可访问性，改善搜索引擎抓取效率',
    actions: [
      {
        name: '页面速度',
        icon: '⚡',
        details: 'Core Web Vitals 优化'
      },
      {
        name: 'Sitemap',
        icon: '🗺️',
        details: 'XML sitemap 提交'
      },
      {
        name: 'Robots.txt',
        icon: '🤖',
        details: '控制爬虫访问'
      },
      {
        name: '移动适配',
        icon: '📱',
        details: '响应式设计'
      }
    ],
    tips: [
      '使用 HTTPS 加密',
      '优化 LCP、FID、CLS',
      '确保移动端友好'
    ]
  }
]

const currentStep = ref(0)
const isPlaying = ref(false)
const selectedStep = ref<string | null>(null)
const expandedAction = ref<string | null>(null)

async function playProcess() {
  if (isPlaying.value) return
  isPlaying.value = true
  currentStep.value = 0

  for (let i = 0; i <= steps.length; i++) {
    currentStep.value = i
    await delay(1200)
  }

  isPlaying.value = false
  currentStep.value = 0
}

function selectStep(id: string) {
  selectedStep.value = selectedStep.value === id ? null : id
  expandedAction.value = null
}

function toggleAction(actionName: string) {
  expandedAction.value = expandedAction.value === actionName ? null : actionName
}

function getStepStatus(index: number) {
  if (!isPlaying.value) return 'idle'
  if (currentStep.value > index) return 'completed'
  if (currentStep.value === index) return 'active'
  return 'idle'
}
</script>

<template>
  <div class="seo-container">
    <div class="seo-header">
      <h3 class="seo-title">🚀 SEO 优化三步流程</h3>
      <button
        class="play-btn"
        :class="{ playing: isPlaying }"
        @click="playProcess"
        :disabled="isPlaying"
      >
        {{ isPlaying ? '播放中...' : '▶️ 播放流程' }}
      </button>
    </div>

    <div class="process-flow">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="flow-item"
      >
        <div
          class="step-card"
          :class="[
            getStepStatus(index),
            { selected: selectedStep === step.id }
          ]"
          :style="{ '--step-color': step.color }"
          @click="selectStep(step.id)"
        >
          <div class="step-header">
            <div class="step-number">{{ step.number }}</div>
            <div class="step-icon">{{ step.icon }}</div>
            <div class="step-info">
              <div class="step-title">{{ step.title }}</div>
              <div class="step-desc">{{ step.description }}</div>
            </div>
          </div>

          <div v-if="selectedStep === step.id" class="step-content">
            <div class="actions-section">
              <div class="section-title">🎯 关键操作</div>
              <div class="actions-list">
                <div
                  v-for="action in step.actions"
                  :key="action.name"
                  class="action-item"
                  :class="{ expanded: expandedAction === action.name }"
                  @click.stop="toggleAction(action.name)"
                >
                  <div class="action-header">
                    <span class="action-icon">{{ action.icon }}</span>
                    <span class="action-name">{{ action.name }}</span>
                    <span class="expand-icon">{{ expandedAction === action.name ? '−' : '+' }}</span>
                  </div>
                  <div v-if="expandedAction === action.name" class="action-details">
                    {{ action.details }}
                  </div>
                </div>
              </div>
            </div>

            <div class="tips-section">
              <div class="section-title">💡 优化建议</div>
              <ul class="tips-list">
                <li v-for="tip in step.tips" :key="tip">{{ tip }}</li>
              </ul>
            </div>
          </div>

          <div v-if="getStepStatus(index) === 'active'" class="progress-bar">
            <div class="progress-fill"></div>
          </div>

          <div v-if="getStepStatus(index) === 'completed'" class="completed-badge">
            <span class="badge-icon">✓</span>
            <span class="badge-text">已完成</span>
          </div>
        </div>

        <div v-if="index < steps.length - 1" class="flow-arrow">
          <div class="arrow-line" :class="{ active: currentStep > index }"></div>
          <div class="arrow-head" :class="{ active: currentStep > index }"></div>
        </div>
      </div>
    </div>

    <div class="seo-summary">
      <div class="summary-card">
        <div class="summary-icon">🎯</div>
        <div class="summary-content">
          <div class="summary-title">循序渐进</div>
          <div class="summary-text">
            按照三个步骤依次优化，从基础到进阶
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon">📈</div>
        <div class="summary-content">
          <div class="summary-title">持续优化</div>
          <div class="summary-text">
            SEO 是长期工作，需要定期检查和调整
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon">🔍</div>
        <div class="summary-content">
          <div class="summary-title">数据驱动</div>
          <div class="summary-text">
            使用 Google Search Console 监控效果
          </div>
        </div>
      </div>
    </div>

    <div class="tools-section">
      <div class="tools-title">🛠️ 推荐工具</div>
      <div class="tools-grid">
        <div class="tool-card">
          <div class="tool-icon">🔍</div>
          <div class="tool-name">Google Search Console</div>
          <div class="tool-desc">监控搜索表现</div>
        </div>

        <div class="tool-card">
          <div class="tool-icon">📊</div>
          <div class="tool-name">Google Analytics</div>
          <div class="tool-desc">分析用户行为</div>
        </div>

        <div class="tool-card">
          <div class="tool-icon">⚡</div>
          <div class="tool-name">PageSpeed Insights</div>
          <div class="tool-desc">性能测试</div>
        </div>

        <div class="tool-card">
          <div class="tool-icon">🤖</div>
          <div class="tool-name">Screaming Frog</div>
          <div class="tool-desc">网站爬虫分析</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.seo-container {
  background: var(--vp-c-bg-soft);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.seo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.seo-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
}

.play-btn {
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

.play-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.play-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.play-btn.playing {
  animation: pulse 1s infinite;
}

.process-flow {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.flow-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-card {
  width: 100%;
  background: var(--component-bg);
  border: 2px solid var(--component-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.step-card:hover {
  border-color: var(--step-color);
  transform: translateY(-2px);
}

.step-card.selected {
  border-color: var(--step-color);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.step-card.active {
  border-color: var(--step-color);
  background: color-mix(in srgb, var(--step-color) 5%, var(--component-bg));
}

.step-card.completed {
  border-color: var(--color-success);
  background: rgba(21, 160, 81, 0.05);
}

.step-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--step-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.step-info {
  flex: 1;
  min-width: 0;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.step-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.step-content {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--component-border);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  animation: fadeIn 0.3s ease;
}

.actions-section,
.tips-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.action-item {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.action-item:hover {
  border-color: var(--step-color);
}

.action-item.expanded {
  border-color: var(--step-color);
}

.action-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.action-icon {
  font-size: 16px;
}

.action-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.expand-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--component-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-2);
}

.action-details {
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--component-border);
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  animation: fadeIn 0.3s ease;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.tips-list li {
  margin-bottom: 4px;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--component-border);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--step-color);
  animation: progress 1.2s ease-in-out;
}

@keyframes progress {
  from { width: 0%; }
  to { width: 100%; }
}

.completed-badge {
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

.badge-icon {
  font-size: 14px;
}

.flow-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-sm) 0;
}

.arrow-line {
  width: 2px;
  height: 30px;
  background: var(--component-border);
  transition: all var(--transition-base);
}

.arrow-line.active {
  background: var(--vp-c-brand);
}

.arrow-head {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid var(--component-border);
  transition: all var(--transition-base);
}

.arrow-head.active {
  border-top-color: var(--vp-c-brand);
}

.seo-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.summary-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--component-bg);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
}

.summary-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.summary-content {
  flex: 1;
  min-width: 0;
}

.summary-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.summary-text {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.tools-section {
  background: var(--component-bg);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.tools-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: var(--spacing-md);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.tool-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  text-align: center;
  transition: all var(--transition-base);
}

.tool-card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
}

.tool-icon {
  font-size: 28px;
}

.tool-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.tool-desc {
  font-size: 11px;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .seo-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .play-btn {
    width: 100%;
  }

  .step-header {
    flex-wrap: wrap;
  }

  .step-number {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .step-icon {
    font-size: 28px;
  }

  .step-title {
    font-size: 14px;
  }

  .step-desc {
    font-size: 12px;
  }

  .seo-summary {
    grid-template-columns: 1fr;
  }

  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
