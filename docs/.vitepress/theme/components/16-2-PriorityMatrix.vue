<script setup lang="ts">
import { ref } from 'vue'

interface FeedbackItem {
  id: string
  title: string
  impact: 'high' | 'medium' | 'low'
  reach: 'high' | 'medium' | 'low'
  priority: 'P0' | 'P1' | 'P2' | 'P3'
}

const feedbackItems = ref<FeedbackItem[]>([
  { id: '1', title: '登录崩溃', impact: 'high', reach: 'high', priority: 'P0' },
  { id: '2', title: '支付失败', impact: 'high', reach: 'high', priority: 'P0' },
  { id: '3', title: '加载太慢', impact: 'high', reach: 'medium', priority: 'P1' },
  { id: '4', title: '手机按钮太小', impact: 'medium', reach: 'high', priority: 'P1' },
  { id: '5', title: '某浏览器显示异常', impact: 'medium', reach: 'medium', priority: 'P2' },
  { id: '6', title: '导出功能', impact: 'medium', reach: 'low', priority: 'P2' },
  { id: '7', title: '深色模式', impact: 'low', reach: 'medium', priority: 'P3' },
  { id: '8', title: '颜色太丑', impact: 'low', reach: 'low', priority: 'P3' }
])

const draggedItem = ref<FeedbackItem | null>(null)

function onDragStart(item: FeedbackItem) {
  draggedItem.value = item
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
}

function onDrop(impact: 'high' | 'medium' | 'low', reach: 'high' | 'medium' | 'low') {
  if (!draggedItem.value) return

  const item = feedbackItems.value.find(i => i.id === draggedItem.value!.id)
  if (item) {
    item.impact = impact
    item.reach = reach
    item.priority = calculatePriority(impact, reach)
  }

  draggedItem.value = null
}

function calculatePriority(impact: string, reach: string): 'P0' | 'P1' | 'P2' | 'P3' {
  if (impact === 'high' && reach === 'high') return 'P0'
  if (impact === 'high' || reach === 'high') return 'P1'
  if (impact === 'medium' || reach === 'medium') return 'P2'
  return 'P3'
}

function getItemsInCell(impact: string, reach: string) {
  return feedbackItems.value.filter(item => item.impact === impact && item.reach === reach)
}

function getPriorityColor(priority: string) {
  const colors = {
    P0: '#ff3b30',
    P1: '#D4952C',
    P2: '#2eb3df',
    P3: '#9ca3af'
  }
  return colors[priority as keyof typeof colors]
}

function getPriorityLabel(priority: string) {
  const labels = {
    P0: '紧急修复',
    P1: '高优先级',
    P2: '中优先级',
    P3: '低优先级'
  }
  return labels[priority as keyof typeof labels]
}
</script>

<template>
  <div class="component-wrapper">
    <div class="component-header">
      <h3 class="component-title">优先级矩阵（可拖拽）</h3>
    </div>

    <div class="component-body">
      <p class="hint">💡 拖动反馈卡片到不同的矩阵格子中，查看优先级变化</p>

      <div class="matrix-container">
        <!-- Y 轴标签 -->
        <div class="y-axis">
          <div class="axis-label">严重程度</div>
          <div class="axis-values">
            <div class="axis-value">高</div>
            <div class="axis-value">中</div>
            <div class="axis-value">低</div>
          </div>
        </div>

        <!-- 矩阵网格 -->
        <div class="matrix-grid">
          <!-- 高严重程度行 -->
          <div
            class="matrix-cell high-impact high-reach"
            @dragover="onDragOver"
            @drop="onDrop('high', 'high')"
          >
            <div class="cell-label">P0 - 紧急修复</div>
            <div class="cell-items">
              <div
                v-for="item in getItemsInCell('high', 'high')"
                :key="item.id"
                class="feedback-card"
                :style="{ borderColor: getPriorityColor(item.priority) }"
                draggable="true"
                @dragstart="onDragStart(item)"
              >
                <span class="card-title">{{ item.title }}</span>
                <span class="card-priority" :style="{ background: getPriorityColor(item.priority) }">
                  {{ item.priority }}
                </span>
              </div>
            </div>
          </div>

          <div
            class="matrix-cell high-impact medium-reach"
            @dragover="onDragOver"
            @drop="onDrop('high', 'medium')"
          >
            <div class="cell-label">P1 - 高优先级</div>
            <div class="cell-items">
              <div
                v-for="item in getItemsInCell('high', 'medium')"
                :key="item.id"
                class="feedback-card"
                :style="{ borderColor: getPriorityColor(item.priority) }"
                draggable="true"
                @dragstart="onDragStart(item)"
              >
                <span class="card-title">{{ item.title }}</span>
                <span class="card-priority" :style="{ background: getPriorityColor(item.priority) }">
                  {{ item.priority }}
                </span>
              </div>
            </div>
          </div>

          <div
            class="matrix-cell high-impact low-reach"
            @dragover="onDragOver"
            @drop="onDrop('high', 'low')"
          >
            <div class="cell-label">P1 - 高优先级</div>
            <div class="cell-items">
              <div
                v-for="item in getItemsInCell('high', 'low')"
                :key="item.id"
                class="feedback-card"
                :style="{ borderColor: getPriorityColor(item.priority) }"
                draggable="true"
                @dragstart="onDragStart(item)"
              >
                <span class="card-title">{{ item.title }}</span>
                <span class="card-priority" :style="{ background: getPriorityColor(item.priority) }">
                  {{ item.priority }}
                </span>
              </div>
            </div>
          </div>

          <!-- 中严重程度行 -->
          <div
            class="matrix-cell medium-impact high-reach"
            @dragover="onDragOver"
            @drop="onDrop('medium', 'high')"
          >
            <div class="cell-label">P1 - 高优先级</div>
            <div class="cell-items">
              <div
                v-for="item in getItemsInCell('medium', 'high')"
                :key="item.id"
                class="feedback-card"
                :style="{ borderColor: getPriorityColor(item.priority) }"
                draggable="true"
                @dragstart="onDragStart(item)"
              >
                <span class="card-title">{{ item.title }}</span>
                <span class="card-priority" :style="{ background: getPriorityColor(item.priority) }">
                  {{ item.priority }}
                </span>
              </div>
            </div>
          </div>

          <div
            class="matrix-cell medium-impact medium-reach"
            @dragover="onDragOver"
            @drop="onDrop('medium', 'medium')"
          >
            <div class="cell-label">P2 - 中优先级</div>
            <div class="cell-items">
              <div
                v-for="item in getItemsInCell('medium', 'medium')"
                :key="item.id"
                class="feedback-card"
                :style="{ borderColor: getPriorityColor(item.priority) }"
                draggable="true"
                @dragstart="onDragStart(item)"
              >
                <span class="card-title">{{ item.title }}</span>
                <span class="card-priority" :style="{ background: getPriorityColor(item.priority) }">
                  {{ item.priority }}
                </span>
              </div>
            </div>
          </div>

          <div
            class="matrix-cell medium-impact low-reach"
            @dragover="onDragOver"
            @drop="onDrop('medium', 'low')"
          >
            <div class="cell-label">P2 - 中优先级</div>
            <div class="cell-items">
              <div
                v-for="item in getItemsInCell('medium', 'low')"
                :key="item.id"
                class="feedback-card"
                :style="{ borderColor: getPriorityColor(item.priority) }"
                draggable="true"
                @dragstart="onDragStart(item)"
              >
                <span class="card-title">{{ item.title }}</span>
                <span class="card-priority" :style="{ background: getPriorityColor(item.priority) }">
                  {{ item.priority }}
                </span>
              </div>
            </div>
          </div>

          <!-- 低严重程度行 -->
          <div
            class="matrix-cell low-impact high-reach"
            @dragover="onDragOver"
            @drop="onDrop('low', 'high')"
          >
            <div class="cell-label">P3 - 低优先级</div>
            <div class="cell-items">
              <div
                v-for="item in getItemsInCell('low', 'high')"
                :key="item.id"
                class="feedback-card"
                :style="{ borderColor: getPriorityColor(item.priority) }"
                draggable="true"
                @dragstart="onDragStart(item)"
              >
                <span class="card-title">{{ item.title }}</span>
                <span class="card-priority" :style="{ background: getPriorityColor(item.priority) }">
                  {{ item.priority }}
                </span>
              </div>
            </div>
          </div>

          <div
            class="matrix-cell low-impact medium-reach"
            @dragover="onDragOver"
            @drop="onDrop('low', 'medium')"
          >
            <div class="cell-label">P3 - 低优先级</div>
            <div class="cell-items">
              <div
                v-for="item in getItemsInCell('low', 'medium')"
                :key="item.id"
                class="feedback-card"
                :style="{ borderColor: getPriorityColor(item.priority) }"
                draggable="true"
                @dragstart="onDragStart(item)"
              >
                <span class="card-title">{{ item.title }}</span>
                <span class="card-priority" :style="{ background: getPriorityColor(item.priority) }">
                  {{ item.priority }}
                </span>
              </div>
            </div>
          </div>

          <div
            class="matrix-cell low-impact low-reach"
            @dragover="onDragOver"
            @drop="onDrop('low', 'low')"
          >
            <div class="cell-label">P3 - 低优先级</div>
            <div class="cell-items">
              <div
                v-for="item in getItemsInCell('low', 'low')"
                :key="item.id"
                class="feedback-card"
                :style="{ borderColor: getPriorityColor(item.priority) }"
                draggable="true"
                @dragstart="onDragStart(item)"
              >
                <span class="card-title">{{ item.title }}</span>
                <span class="card-priority" :style="{ background: getPriorityColor(item.priority) }">
                  {{ item.priority }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- X 轴标签 -->
        <div class="x-axis">
          <div class="axis-label">影响范围</div>
          <div class="axis-values">
            <div class="axis-value">大</div>
            <div class="axis-value">中</div>
            <div class="axis-value">小</div>
          </div>
        </div>
      </div>

      <!-- 图例 -->
      <div class="legend">
        <div class="legend-item" v-for="p in ['P0', 'P1', 'P2', 'P3']" :key="p">
          <span class="legend-color" :style="{ background: getPriorityColor(p) }"></span>
          <span class="legend-label">{{ p }} - {{ getPriorityLabel(p) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.hint {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-bottom: var(--spacing-md);
}

.matrix-container {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr auto;
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.y-axis {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.axis-label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.axis-values {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
  gap: var(--spacing-sm);
}

.axis-value {
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.matrix-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: var(--spacing-sm);
  min-height: 400px;
}

.matrix-cell {
  border: 2px dashed var(--vp-c-divider);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  background: var(--vp-c-bg-soft);
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.matrix-cell:hover {
  border-color: var(--vp-c-brand);
  background: var(--component-hover-bg);
}

.cell-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-align: center;
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--vp-c-divider);
}

.cell-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
}

.feedback-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--component-bg);
  border: 2px solid var(--vp-c-divider);
  border-radius: var(--radius-sm);
  cursor: move;
  transition: all var(--transition-base);
  font-size: 13px;
}

.feedback-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.card-title {
  flex: 1;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.card-priority {
  padding: 2px 6px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  color: white;
}

.x-axis {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.x-axis .axis-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-align: center;
}

.x-axis .axis-values {
  display: flex;
  justify-content: space-around;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--vp-c-bg-soft);
  border-radius: var(--radius-md);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-sm);
}

.legend-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .matrix-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    min-height: auto;
  }

  .matrix-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .y-axis {
    flex-direction: row;
  }

  .axis-label {
    writing-mode: horizontal-tb;
    transform: none;
  }

  .axis-values {
    flex-direction: row;
  }

  .legend {
    flex-direction: column;
  }
}
</style>
