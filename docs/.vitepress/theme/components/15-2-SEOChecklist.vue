<script setup lang="ts">
import { ref, computed } from 'vue'

interface CheckItem {
  id: string
  label: string
  checked: boolean
}

interface Category {
  id: string
  title: string
  icon: string
  items: CheckItem[]
}

const categories = ref<Category[]>([
  {
    id: 'infra',
    title: '基础设施 (入场券)',
    icon: '\uD83C\uDFD7\uFE0F',
    items: [
      { id: 'infra-1', label: '配置 title 和 description meta 标签', checked: false },
      { id: 'infra-2', label: '生成 sitemap.xml', checked: false },
      { id: 'infra-3', label: '配置 robots.txt', checked: false },
      { id: 'infra-4', label: '设置 canonical URL', checked: false },
    ],
  },
  {
    id: 'content',
    title: '内容优化',
    icon: '\uD83D\uDCDD',
    items: [
      { id: 'cnt-1', label: '页面有唯一的 H1 标题', checked: false },
      { id: 'cnt-2', label: '图片有 alt 属性', checked: false },
      { id: 'cnt-3', label: 'URL 结构清晰可读', checked: false },
      { id: 'cnt-4', label: '内链和外链合理', checked: false },
    ],
  },
  {
    id: 'tech',
    title: '技术优化',
    icon: '\u2699\uFE0F',
    items: [
      { id: 'tech-1', label: '页面加载速度 < 3 秒', checked: false },
      { id: 'tech-2', label: '移动端适配', checked: false },
      { id: 'tech-3', label: '配置 Open Graph 标签', checked: false },
      { id: 'tech-4', label: '配置 structured data (JSON-LD)', checked: false },
    ],
  },
])

const totalItems = computed(() =>
  categories.value.reduce((sum, cat) => sum + cat.items.length, 0)
)

const checkedItems = computed(() =>
  categories.value.reduce(
    (sum, cat) => sum + cat.items.filter(item => item.checked).length,
    0
  )
)

const progressPct = computed(() =>
  totalItems.value === 0 ? 0 : Math.round((checkedItems.value / totalItems.value) * 100)
)

const allDone = computed(() => checkedItems.value === totalItems.value && totalItems.value > 0)

function categoryCheckedCount(cat: Category): number {
  return cat.items.filter(item => item.checked).length
}

function isCategoryDone(cat: Category): boolean {
  return cat.items.length > 0 && cat.items.every(item => item.checked)
}

function toggleItem(catId: string, itemId: string) {
  categories.value = categories.value.map(c =>
    c.id === catId
      ? {
          ...c,
          items: c.items.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        }
      : c
  )
}

function resetAll() {
  categories.value = categories.value.map(c => ({
    ...c,
    items: c.items.map(item => ({ ...item, checked: false })),
  }))
}
</script>

<template>
  <div class="seo-root">
    <!-- Progress Header -->
    <div class="seo-header">
      <div class="seo-header-top">
        <h4 class="seo-title">SEO 优化清单</h4>
        <button v-if="checkedItems > 0" class="seo-reset-btn" @click="resetAll">重置</button>
      </div>
      <div class="seo-progress-info">
        <span class="seo-progress-text">
          SEO 检查进度：<strong>{{ checkedItems }}/{{ totalItems }}</strong> 项完成
        </span>
        <span class="seo-progress-pct">{{ progressPct }}%</span>
      </div>
      <div class="seo-progress-bar">
        <div
          class="seo-progress-fill"
          :class="{ 'seo-progress-done': allDone }"
          :style="{ width: progressPct + '%' }"
        />
      </div>
    </div>

    <!-- All Done Banner -->
    <Transition name="seo-fade">
      <div v-if="allDone" class="seo-complete">
        <span class="seo-complete-icon">&#x2705;</span>
        <span class="seo-complete-text">SEO 基础配置完成!</span>
      </div>
    </Transition>

    <!-- Categories -->
    <div class="seo-categories">
      <div v-for="cat in categories" :key="cat.id" class="seo-category">
        <div class="seo-cat-header">
          <div class="seo-cat-left">
            <span class="seo-cat-icon">{{ cat.icon }}</span>
            <span class="seo-cat-title">{{ cat.title }}</span>
          </div>
          <div class="seo-cat-right">
            <span v-if="isCategoryDone(cat)" class="seo-cat-badge">&#x2713;</span>
            <span
              class="seo-cat-count"
              :class="{ done: isCategoryDone(cat) }"
            >{{ categoryCheckedCount(cat) }}/{{ cat.items.length }}</span>
          </div>
        </div>

        <div class="seo-cat-items">
          <label
            v-for="item in cat.items"
            :key="item.id"
            class="seo-item"
            :class="{ checked: item.checked }"
          >
            <input
              type="checkbox"
              :checked="item.checked"
              class="seo-checkbox"
              @change="toggleItem(cat.id, item.id)"
            />
            <span class="seo-item-label" :class="{ 'seo-item-done': item.checked }">
              {{ item.label }}
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.seo-root {
  max-width: 688px;
  margin: 1.5rem auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  overflow: hidden;
}

/* Header */
.seo-header {
  padding: 20px 20px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.seo-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.seo-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.seo-reset-btn {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.seo-reset-btn:hover {
  border-color: var(--vp-c-text-3);
  color: var(--vp-c-text-1);
}

.seo-progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.seo-progress-text {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.seo-progress-text strong {
  color: var(--vp-c-text-1);
}

.seo-progress-pct {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.seo-progress-bar {
  height: 6px;
  background: var(--vp-c-divider);
  border-radius: 3px;
  overflow: hidden;
}

.seo-progress-fill {
  height: 100%;
  background: var(--vp-c-brand-1);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.seo-progress-done {
  background: var(--color-success);
}

/* Complete Banner */
.seo-complete {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  margin: 16px 20px 0;
  border-radius: 8px;
  background: rgba(21, 160, 81, 0.08);
  border: 1.5px solid rgba(21, 160, 81, 0.25);
}

.seo-complete-icon {
  font-size: 18px;
}

.seo-complete-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-success);
}

/* Categories */
.seo-categories {
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.seo-category {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.seo-cat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.seo-cat-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.seo-cat-icon {
  font-size: 16px;
}

.seo-cat-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.seo-cat-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.seo-cat-badge {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-success);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

.seo-cat-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.seo-cat-count.done {
  background: rgba(21, 160, 81, 0.12);
  color: var(--color-success);
}

/* Items */
.seo-cat-items {
  padding: 8px 14px 10px;
}

.seo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: 2px;
}

.seo-item:last-child {
  margin-bottom: 0;
}

.seo-item:hover {
  background: var(--vp-c-bg-soft);
}

.seo-item.checked {
  background: rgba(21, 160, 81, 0.06);
}

.seo-checkbox {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  accent-color: var(--color-success);
  cursor: pointer;
}

.seo-item-label {
  font-size: 13px;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}

.seo-item-done {
  color: var(--vp-c-text-3);
  text-decoration: line-through;
}

/* Transitions */
.seo-fade-enter-active,
.seo-fade-leave-active {
  transition: all 0.3s ease;
}

.seo-fade-enter-from,
.seo-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Dark Mode */
:global(html.dark) .seo-complete {
  background: rgba(21, 160, 81, 0.1);
  border-color: rgba(21, 160, 81, 0.3);
}

:global(html.dark) .seo-item.checked {
  background: rgba(21, 160, 81, 0.08);
}

:global(html.dark) .seo-cat-count {
  background: var(--vp-c-bg-soft);
}

:global(html.dark) .seo-cat-count.done {
  background: rgba(21, 160, 81, 0.15);
}

/* Responsive */
@media (max-width: 640px) {
  .seo-header {
    padding: 16px 14px 12px;
  }

  .seo-title {
    font-size: 14px;
  }

  .seo-progress-text {
    font-size: 12px;
  }

  .seo-categories {
    padding: 12px 14px 14px;
    gap: 10px;
  }

  .seo-cat-header {
    padding: 10px 12px;
  }

  .seo-cat-title {
    font-size: 13px;
  }

  .seo-cat-items {
    padding: 6px 12px 8px;
  }

  .seo-item {
    padding: 6px 8px;
  }

  .seo-item-label {
    font-size: 12px;
  }
}
</style>
