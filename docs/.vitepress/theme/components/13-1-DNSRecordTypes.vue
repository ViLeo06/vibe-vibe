<script setup lang="ts">
import { ref } from 'vue'

type TabId = 'a' | 'cname'

const activeTab = ref<TabId>('a')

const tabs: { id: TabId; label: string; color: string }[] = [
  { id: 'a', label: 'A 记录', color: '#2eb3df' },
  { id: 'cname', label: 'CNAME 记录', color: '#15a051' },
]

interface RecordInfo {
  example: { from: string; arrow: string; to: string; extra?: string }
  traits: string[]
}

const records: Record<TabId, RecordInfo> = {
  a: {
    example: { from: 'myapp.com', arrow: '直接映射', to: '1.2.3.4' },
    traits: [
      '直接指向 IP 地址',
      '服务器换 IP 需要手动更新',
      '适合根域名',
    ],
  },
  cname: {
    example: {
      from: 'www.myapp.com',
      arrow: '间接映射',
      to: 'cname.vercel-dns.com',
      extra: '自动解析',
    },
    traits: [
      '指向另一个域名',
      '平台换 IP 自动跟随',
      '适合子域名',
    ],
  },
}

const comparisonRows = [
  { aspect: '指向', a: 'IP 地址', cname: '域名' },
  { aspect: '更新', a: '手动', cname: '自动跟随' },
  { aspect: '根域名', a: '支持', cname: '不支持' },
  { aspect: '典型用途', a: 'VPS 部署', cname: 'Vercel / 平台部署' },
]

function tabColor(id: TabId): string {
  return tabs.find(t => t.id === id)?.color ?? '#888'
}
</script>

<template>
  <div class="dr-root">
    <!-- Tabs -->
    <div class="dr-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['dr-tab', { active: activeTab === tab.id }]"
        :style="{
          '--tab-color': tab.color,
        }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Visual mapping -->
    <Transition name="dr-fade" mode="out-in">
      <div
        :key="activeTab"
        class="dr-visual"
        :style="{ borderColor: tabColor(activeTab) }"
      >
        <div class="dr-visual-title" :style="{ color: tabColor(activeTab) }">
          {{ activeTab === 'a' ? 'A 记录' : 'CNAME 记录' }} - {{ records[activeTab].example.arrow }}
        </div>

        <div class="dr-mapping">
          <div class="dr-mapping-node dr-mapping-from">
            <code>{{ records[activeTab].example.from }}</code>
          </div>

          <div class="dr-mapping-arrow">
            <div class="dr-mapping-line" :style="{ background: tabColor(activeTab) }" />
            <div
              class="dr-mapping-head"
              :style="{ borderLeftColor: tabColor(activeTab) }"
            />
          </div>

          <div class="dr-mapping-node dr-mapping-to">
            <code>{{ records[activeTab].example.to }}</code>
          </div>

          <template v-if="records[activeTab].example.extra">
            <div class="dr-mapping-arrow">
              <div class="dr-mapping-line" :style="{ background: tabColor(activeTab) }" />
              <div
                class="dr-mapping-head"
                :style="{ borderLeftColor: tabColor(activeTab) }"
              />
            </div>
            <div class="dr-mapping-node dr-mapping-extra">
              <span>{{ records[activeTab].example.extra }}</span>
            </div>
          </template>
        </div>

        <!-- Traits -->
        <div class="dr-traits">
          <div
            v-for="(trait, i) in records[activeTab].traits"
            :key="i"
            class="dr-trait"
          >
            <span class="dr-trait-dot" :style="{ background: tabColor(activeTab) }" />
            <span class="dr-trait-text">{{ trait }}</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Comparison table -->
    <div class="dr-table-wrap">
      <div class="dr-table-title">对比</div>
      <table class="dr-table">
        <thead>
          <tr>
            <th class="dr-table-th"></th>
            <th class="dr-table-th" :style="{ color: tabColor('a') }">A 记录</th>
            <th class="dr-table-th" :style="{ color: tabColor('cname') }">CNAME</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in comparisonRows" :key="row.aspect">
            <td class="dr-table-aspect">{{ row.aspect }}</td>
            <td class="dr-table-cell">{{ row.a }}</td>
            <td class="dr-table-cell">{{ row.cname }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.dr-root {
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-lg);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
}

/* Tabs */
.dr-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.dr-tab {
  flex: 1;
  padding: 10px var(--spacing-md);
  border: 2px solid var(--vp-c-divider);
  border-radius: var(--radius-md);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
}

.dr-tab:hover {
  border-color: var(--tab-color);
  color: var(--tab-color);
}

.dr-tab.active {
  border-color: var(--tab-color);
  color: var(--tab-color);
  background: var(--vp-c-bg);
  box-shadow: var(--shadow-md);
}

/* Visual panel */
.dr-visual {
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 2px solid;
  background: var(--vp-c-bg-soft);
  margin-bottom: var(--spacing-lg);
}

.dr-visual-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
}

/* Mapping diagram */
.dr-mapping {
  display: flex;
  align-items: center;
  gap: 0;
  padding: var(--spacing-md) 0;
  overflow-x: auto;
}

.dr-mapping-node {
  flex-shrink: 0;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--vp-c-bg);
  border: 1.5px solid var(--vp-c-divider);
}

.dr-mapping-node code {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background: none;
  padding: 0;
}

.dr-mapping-extra {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  border-style: dashed;
}

.dr-mapping-arrow {
  display: flex;
  align-items: center;
  width: 36px;
  flex-shrink: 0;
  position: relative;
}

.dr-mapping-line {
  width: 100%;
  height: 2px;
}

.dr-mapping-head {
  position: absolute;
  right: 0;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 7px solid;
}

/* Traits */
.dr-traits {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.dr-trait {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.dr-trait-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dr-trait-text {
  font-size: 14px;
  color: var(--vp-c-text-1);
  line-height: 1.5;
}

/* Comparison table */
.dr-table-wrap {
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.dr-table-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: var(--spacing-md);
}

.dr-table {
  width: 100%;
  border-collapse: collapse;
}

.dr-table-th {
  text-align: left;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 13px;
  font-weight: 700;
  border-bottom: 2px solid var(--vp-c-divider);
}

.dr-table-aspect {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-divider);
  white-space: nowrap;
}

.dr-table-cell {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 13px;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-divider);
}

tr:last-child .dr-table-cell,
tr:last-child .dr-table-aspect {
  border-bottom: none;
}

/* Transitions */
.dr-fade-enter-active,
.dr-fade-leave-active {
  transition: all 0.25s ease;
}

.dr-fade-enter-from,
.dr-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Responsive */
@media (max-width: 640px) {
  .dr-visual {
    padding: var(--spacing-md);
  }

  .dr-mapping {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }

  .dr-mapping-node {
    text-align: center;
  }

  .dr-mapping-arrow {
    width: auto;
    height: 20px;
    justify-content: center;
    align-self: center;
  }

  .dr-mapping-line {
    width: 2px;
    height: 100%;
  }

  .dr-mapping-head {
    bottom: 0;
    right: auto;
    top: auto;
    border-top: 7px solid;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: none;
  }

  .dr-table-wrap {
    padding: var(--spacing-md);
  }

  .dr-table-th,
  .dr-table-aspect,
  .dr-table-cell {
    padding: 6px 8px;
    font-size: 12px;
  }
}
</style>
