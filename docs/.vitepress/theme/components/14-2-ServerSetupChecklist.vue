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
  expanded: boolean
}

const categories = ref<Category[]>([
  {
    id: 'firewall',
    title: '防火墙配置',
    icon: '\uD83D\uDEE1\uFE0F',
    expanded: true,
    items: [
      { id: 'fw-1', label: '启用 1Panel 防火墙', checked: false },
      { id: 'fw-2', label: '只开放必要端口（22, 80, 443）', checked: false },
      { id: 'fw-3', label: '关闭未使用端口', checked: false },
    ],
  },
  {
    id: 'ssh',
    title: 'SSH 安全',
    icon: '\uD83D\uDD10',
    expanded: false,
    items: [
      { id: 'ssh-1', label: '禁用 root 远程登录', checked: false },
      { id: 'ssh-2', label: '使用 SSH 密钥认证', checked: false },
      { id: 'ssh-3', label: '更改默认 SSH 端口', checked: false },
    ],
  },
  {
    id: 'system',
    title: '系统更新',
    icon: '\uD83D\uDD04',
    expanded: false,
    items: [
      { id: 'sys-1', label: '系统软件已更新', checked: false },
      { id: 'sys-2', label: '启用自动安全更新', checked: false },
    ],
  },
  {
    id: 'app',
    title: '应用安全',
    icon: '\uD83D\uDD12',
    expanded: false,
    items: [
      { id: 'app-1', label: '配置 HTTPS (SSL)', checked: false },
      { id: 'app-2', label: '设置 fail2ban 或类似工具', checked: false },
      { id: 'app-3', label: '定期备份', checked: false },
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

const allDone = computed(() => checkedItems.value === totalItems.value)

function categoryChecked(cat: Category): number {
  return cat.items.filter(item => item.checked).length
}

function toggleExpand(cat: Category) {
  categories.value = categories.value.map(c => ({
    ...c,
    expanded: c.id === cat.id ? !c.expanded : c.expanded,
  }))
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
  <div class="sc-root">
    <!-- Progress Header -->
    <div class="sc-header">
      <div class="sc-header-top">
        <h4 class="sc-title">服务器安全加固清单</h4>
        <button v-if="checkedItems > 0" class="sc-reset-btn" @click="resetAll">重置</button>
      </div>
      <div class="sc-progress-info">
        <span class="sc-progress-text">
          已完成 <strong>{{ checkedItems }}/{{ totalItems }}</strong> 项
        </span>
        <span class="sc-progress-pct">{{ progressPct }}%</span>
      </div>
      <div class="sc-progress-bar">
        <div
          class="sc-progress-fill"
          :class="{ 'sc-progress-done': allDone }"
          :style="{ width: progressPct + '%' }"
        />
      </div>
    </div>

    <!-- All Done Badge -->
    <Transition name="sc-fade">
      <div v-if="allDone" class="sc-complete-badge">
        <span class="sc-complete-icon">&#x2705;</span>
        <span class="sc-complete-text">安全加固完成</span>
      </div>
    </Transition>

    <!-- Categories -->
    <div class="sc-categories">
      <div v-for="cat in categories" :key="cat.id" class="sc-category">
        <button class="sc-cat-header" @click="toggleExpand(cat)">
          <div class="sc-cat-left">
            <span class="sc-cat-icon">{{ cat.icon }}</span>
            <span class="sc-cat-title">{{ cat.title }}</span>
          </div>
          <div class="sc-cat-right">
            <span
              class="sc-cat-count"
              :class="{ 'sc-cat-count-done': categoryChecked(cat) === cat.items.length }"
            >
              {{ categoryChecked(cat) }}/{{ cat.items.length }}
            </span>
            <span class="sc-cat-arrow" :class="{ expanded: cat.expanded }">&#x25B6;</span>
          </div>
        </button>

        <Transition name="sc-slide">
          <div v-if="cat.expanded" class="sc-cat-body">
            <label
              v-for="item in cat.items"
              :key="item.id"
              class="sc-item"
              :class="{ checked: item.checked }"
            >
              <input
                type="checkbox"
                :checked="item.checked"
                class="sc-checkbox"
                @change="toggleItem(cat.id, item.id)"
              />
              <span class="sc-item-label" :class="{ 'sc-item-done': item.checked }">
                {{ item.label }}
              </span>
            </label>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.sc-root {
  max-width: 688px;
  margin: 1.5rem auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  overflow: hidden;
}

.sc-header {
  padding: 20px 20px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.sc-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.sc-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.sc-reset-btn {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.sc-reset-btn:hover {
  border-color: var(--vp-c-text-3);
  color: var(--vp-c-text-1);
}

.sc-progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.sc-progress-text {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.sc-progress-text strong {
  color: var(--vp-c-text-1);
}

.sc-progress-pct {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.sc-progress-bar {
  height: 6px;
  background: var(--vp-c-divider);
  border-radius: 3px;
  overflow: hidden;
}

.sc-progress-fill {
  height: 100%;
  background: var(--vp-c-brand-1);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.sc-progress-done {
  background: var(--color-success);
}

/* Complete Badge */
.sc-complete-badge {
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

.sc-complete-icon {
  font-size: 18px;
}

.sc-complete-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-success);
}

/* Categories */
.sc-categories {
  padding: 12px 20px 20px;
}

.sc-category {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
}

.sc-category:last-child {
  margin-bottom: 0;
}

.sc-cat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 14px;
  border: none;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: background 0.2s;
}

.sc-cat-header:hover {
  background: var(--vp-c-bg-mute);
}

.sc-cat-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sc-cat-icon {
  font-size: 16px;
}

.sc-cat-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.sc-cat-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sc-cat-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.sc-cat-count-done {
  background: rgba(21, 160, 81, 0.12);
  color: var(--color-success);
}

.sc-cat-arrow {
  font-size: 10px;
  color: var(--vp-c-text-3);
  transition: transform 0.2s;
  display: inline-block;
}

.sc-cat-arrow.expanded {
  transform: rotate(90deg);
}

/* Items */
.sc-cat-body {
  padding: 6px 14px 10px;
}

.sc-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: 2px;
}

.sc-item:hover {
  background: var(--vp-c-bg-soft);
}

.sc-item.checked {
  background: rgba(21, 160, 81, 0.06);
}

.sc-checkbox {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  accent-color: var(--color-success);
  cursor: pointer;
}

.sc-item-label {
  font-size: 13px;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}

.sc-item-done {
  color: var(--vp-c-text-3);
  text-decoration: line-through;
}

/* Transitions */
.sc-fade-enter-active,
.sc-fade-leave-active {
  transition: all 0.3s ease;
}

.sc-fade-enter-from,
.sc-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.sc-slide-enter-active,
.sc-slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.sc-slide-enter-from,
.sc-slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

/* Dark Mode */
:global(html.dark) .sc-complete-badge {
  background: rgba(21, 160, 81, 0.1);
  border-color: rgba(21, 160, 81, 0.3);
}

:global(html.dark) .sc-item.checked {
  background: rgba(21, 160, 81, 0.08);
}

:global(html.dark) .sc-cat-count {
  background: var(--vp-c-bg-soft);
}

:global(html.dark) .sc-cat-count-done {
  background: rgba(21, 160, 81, 0.15);
}

/* Responsive */
@media (max-width: 640px) {
  .sc-header {
    padding: 16px 14px 12px;
  }

  .sc-title {
    font-size: 14px;
  }

  .sc-categories {
    padding: 10px 14px 14px;
  }

  .sc-cat-header {
    padding: 10px 12px;
  }

  .sc-cat-title {
    font-size: 13px;
  }

  .sc-item {
    padding: 6px 8px;
  }

  .sc-item-label {
    font-size: 12px;
  }
}
</style>
