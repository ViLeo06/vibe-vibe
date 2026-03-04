<script setup lang="ts">
import { ref, computed } from 'vue'

interface CheckItem {
  label: string
  checked: boolean
}

interface Category {
  id: string
  title: string
  color: string
  items: CheckItem[]
}

const categories = ref<Category[]>([
  {
    id: 'sql', title: 'SQL 注入防护', color: '#ef4444',
    items: [
      { label: '使用 ORM（Drizzle/Prisma）', checked: false },
      { label: '无手写 SQL 拼接用户输入', checked: false },
    ],
  },
  {
    id: 'xss', title: 'XSS 防护', color: '#f59e0b',
    items: [
      { label: '未使用 dangerouslySetInnerHTML', checked: false },
      { label: '用户输入已转义', checked: false },
    ],
  },
  {
    id: 'csrf', title: 'CSRF 防护', color: '#8b5cf6',
    items: [
      { label: 'Server Action 自带 Token', checked: false },
      { label: 'Cookie 设置 SameSite', checked: false },
    ],
  },
  {
    id: 'deps', title: '依赖安全', color: '#2eb3df',
    items: [
      { label: '已运行 pnpm audit', checked: false },
      { label: '无高危漏洞', checked: false },
    ],
  },
  {
    id: 'ai', title: 'AI 安全', color: '#15a051',
    items: [
      { label: '提示注入防护', checked: false },
      { label: '速率限制已配置', checked: false },
      { label: '输出过滤', checked: false },
    ],
  },
])

const totalItems = computed(() =>
  categories.value.reduce((sum, c) => sum + c.items.length, 0)
)

const checkedCount = computed(() =>
  categories.value.reduce(
    (sum, c) => sum + c.items.filter(i => i.checked).length,
    0
  )
)

const progressPct = computed(() =>
  totalItems.value === 0 ? 0 : Math.round((checkedCount.value / totalItems.value) * 100)
)

const allPassed = computed(() => checkedCount.value === totalItems.value)

function toggleItem(catIndex: number, itemIndex: number) {
  const cat = categories.value[catIndex]
  const updatedItems = cat.items.map((item, i) =>
    i === itemIndex ? { ...item, checked: !item.checked } : item
  )
  categories.value = categories.value.map((c, i) =>
    i === catIndex ? { ...c, items: updatedItems } : c
  )
}

function categoryChecked(cat: Category): number {
  return cat.items.filter(i => i.checked).length
}
</script>

<template>
  <div class="sac-root">
    <!-- Progress header -->
    <div class="sac-header">
      <div class="sac-status">
        <span class="sac-count">
          已完成 <strong>{{ checkedCount }}/{{ totalItems }}</strong> 项
        </span>
        <span v-if="allPassed" class="sac-badge sac-badge-pass">通过</span>
      </div>
      <div class="sac-progress-bar">
        <div
          class="sac-progress-fill"
          :style="{ width: progressPct + '%' }"
          :class="{ 'sac-progress-done': allPassed }"
        />
      </div>
    </div>

    <!-- Categories -->
    <div class="sac-categories">
      <div
        v-for="(cat, ci) in categories"
        :key="cat.id"
        class="sac-category"
      >
        <div class="sac-cat-header">
          <span class="sac-cat-dot" :style="{ background: cat.color }" />
          <span class="sac-cat-title">{{ cat.title }}</span>
          <span class="sac-cat-count" :class="{ 'sac-cat-done': categoryChecked(cat) === cat.items.length }">
            {{ categoryChecked(cat) }}/{{ cat.items.length }}
          </span>
        </div>
        <div class="sac-items">
          <label
            v-for="(item, ii) in cat.items"
            :key="ii"
            class="sac-item"
            :class="{ 'sac-item-checked': item.checked }"
          >
            <input
              type="checkbox"
              :checked="item.checked"
              class="sac-checkbox"
              @change="toggleItem(ci, ii)"
            />
            <span class="sac-item-label" :class="{ 'sac-label-checked': item.checked }">
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

.sac-root {
  max-width: 688px;
  margin: 1.5rem auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.sac-header {
  padding: 16px 20px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.sac-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.sac-count {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.sac-count strong {
  color: var(--vp-c-text-1);
}

.sac-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}

.sac-badge-pass {
  background: rgba(21, 160, 81, 0.12);
  color: var(--color-success);
}

.sac-progress-bar {
  height: 6px;
  border-radius: 3px;
  background: var(--vp-c-divider);
  overflow: hidden;
}

.sac-progress-fill {
  height: 100%;
  border-radius: 3px;
  background: var(--vp-c-brand-1);
  transition: width 0.3s ease;
}

.sac-progress-done {
  background: var(--color-success);
}

.sac-categories {
  padding: 12px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sac-category {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sac-cat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 4px;
}

.sac-cat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sac-cat-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  flex: 1;
}

.sac-cat-count {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

.sac-cat-done {
  color: var(--color-success);
}

.sac-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 16px;
}

.sac-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.sac-item:hover {
  background: var(--vp-c-bg-soft);
}

.sac-item-checked {
  background: rgba(21, 160, 81, 0.05);
}

.sac-checkbox {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  accent-color: var(--color-success);
  cursor: pointer;
  flex-shrink: 0;
}

.sac-item-label {
  font-size: 13px;
  color: var(--vp-c-text-1);
  transition: color 0.15s;
}

.sac-label-checked {
  color: var(--vp-c-text-3);
  text-decoration: line-through;
}

/* Dark mode */
:global(html.dark) .sac-item-checked {
  background: rgba(21, 160, 81, 0.08);
}

:global(html.dark) .sac-badge-pass {
  background: rgba(21, 160, 81, 0.15);
}

/* Responsive */
@media (max-width: 640px) {
  .sac-header { padding: 12px 14px; }
  .sac-categories { padding: 10px 14px 14px; }
  .sac-items { padding-left: 8px; }
  .sac-item { padding: 5px 8px; }
  .sac-item-label { font-size: 12px; }
  .sac-cat-title { font-size: 13px; }
}
</style>
