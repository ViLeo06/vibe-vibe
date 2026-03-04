<script setup lang="ts">
import { ref, computed } from 'vue'

interface Feature {
  name: string
  reach: number
  impact: number
  confidence: number
  effort: number
}

const features = ref<Feature[]>([
  { name: '导出功能', reach: 100, impact: 3, confidence: 80, effort: 2 },
  { name: '深色模式', reach: 500, impact: 1, confidence: 100, effort: 3 },
  { name: '修复登录 Bug', reach: 1000, impact: 3, confidence: 100, effort: 1 }
])

const selectedFeature = ref(0)
const editingFeature = computed(() => features.value[selectedFeature.value])

const riceScores = computed(() => {
  return features.value.map(feature => {
    const score = (feature.reach * feature.impact * (feature.confidence / 100)) / feature.effort
    return {
      ...feature,
      rice: Math.round(score)
    }
  }).sort((a, b) => b.rice - a.rice)
})

function addFeature() {
  features.value.push({
    name: `新功能 ${features.value.length + 1}`,
    reach: 100,
    impact: 2,
    confidence: 80,
    effort: 1
  })
  selectedFeature.value = features.value.length - 1
}

function removeFeature(index: number) {
  if (features.value.length <= 1) return
  features.value.splice(index, 1)
  if (selectedFeature.value >= features.value.length) {
    selectedFeature.value = features.value.length - 1
  }
}

function getImpactLabel(impact: number) {
  const labels = {
    1: '小',
    2: '中',
    3: '大'
  }
  return labels[impact as keyof typeof labels] || '中'
}

function getRankColor(index: number) {
  if (index === 0) return '#15a051'
  if (index === 1) return '#2eb3df'
  if (index === 2) return '#D4952C'
  return '#9ca3af'
}
</script>

<template>
  <div class="component-wrapper">
    <div class="component-header">
      <h3 class="component-title">RICE 评分计算器</h3>
      <button class="btn btn-primary" @click="addFeature">
        ➕ 添加功能
      </button>
    </div>

    <div class="component-body">
      <div class="calculator-layout">
        <!-- 左侧：输入表单 -->
        <div class="input-panel">
          <h4>功能参数</h4>

          <div class="feature-tabs">
            <button
              v-for="(feature, index) in features"
              :key="index"
              class="feature-tab"
              :class="{ active: selectedFeature === index }"
              @click="selectedFeature = index"
            >
              {{ feature.name }}
              <span
                v-if="features.length > 1"
                class="remove-btn"
                @click.stop="removeFeature(index)"
              >
                ×
              </span>
            </button>
          </div>

          <div class="form-group">
            <label>功能名称</label>
            <input
              v-model="editingFeature.name"
              type="text"
              class="form-input"
              placeholder="输入功能名称"
            />
          </div>

          <div class="form-group">
            <label>
              Reach（触达）
              <span class="label-hint">每月受影响的用户数</span>
            </label>
            <input
              v-model.number="editingFeature.reach"
              type="number"
              class="form-input"
              min="1"
              step="10"
            />
            <div class="slider-container">
              <input
                v-model.number="editingFeature.reach"
                type="range"
                min="10"
                max="10000"
                step="10"
                class="slider"
              />
              <span class="slider-value">{{ editingFeature.reach }} 人/月</span>
            </div>
          </div>

          <div class="form-group">
            <label>
              Impact（影响）
              <span class="label-hint">对用户的影响程度</span>
            </label>
            <div class="radio-group">
              <label class="radio-label">
                <input v-model.number="editingFeature.impact" type="radio" :value="1" />
                <span>1 - 小</span>
              </label>
              <label class="radio-label">
                <input v-model.number="editingFeature.impact" type="radio" :value="2" />
                <span>2 - 中</span>
              </label>
              <label class="radio-label">
                <input v-model.number="editingFeature.impact" type="radio" :value="3" />
                <span>3 - 大</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>
              Confidence（信心）
              <span class="label-hint">对评估的把握程度</span>
            </label>
            <input
              v-model.number="editingFeature.confidence"
              type="number"
              class="form-input"
              min="0"
              max="100"
              step="5"
            />
            <div class="slider-container">
              <input
                v-model.number="editingFeature.confidence"
                type="range"
                min="0"
                max="100"
                step="5"
                class="slider"
              />
              <span class="slider-value">{{ editingFeature.confidence }}%</span>
            </div>
          </div>

          <div class="form-group">
            <label>
              Effort（工作量）
              <span class="label-hint">需要的人月数</span>
            </label>
            <input
              v-model.number="editingFeature.effort"
              type="number"
              class="form-input"
              min="0.1"
              step="0.1"
            />
            <div class="slider-container">
              <input
                v-model.number="editingFeature.effort"
                type="range"
                min="0.1"
                max="12"
                step="0.1"
                class="slider"
              />
              <span class="slider-value">{{ editingFeature.effort }} 人月</span>
            </div>
          </div>
        </div>

        <!-- 右侧：结果展示 -->
        <div class="result-panel">
          <h4>RICE 评分排名</h4>

          <div class="formula">
            <div class="formula-text">
              RICE = (Reach × Impact × Confidence) / Effort
            </div>
          </div>

          <div class="ranking-list">
            <div
              v-for="(item, index) in riceScores"
              :key="item.name"
              class="ranking-item"
              :class="{ highlighted: item.name === editingFeature.name }"
            >
              <div class="rank-badge" :style="{ background: getRankColor(index) }">
                #{{ index + 1 }}
              </div>
              <div class="rank-content">
                <div class="rank-name">{{ item.name }}</div>
                <div class="rank-details">
                  <span>触达: {{ item.reach }}</span>
                  <span>影响: {{ getImpactLabel(item.impact) }}</span>
                  <span>信心: {{ item.confidence }}%</span>
                  <span>工作量: {{ item.effort }}人月</span>
                </div>
              </div>
              <div class="rank-score">
                <div class="score-value">{{ item.rice }}</div>
                <div class="score-label">RICE</div>
              </div>
            </div>
          </div>

          <div class="insight">
            <h5>💡 洞察</h5>
            <p v-if="riceScores.length >= 2">
              <strong>{{ riceScores[0].name }}</strong> 的 RICE 分数是
              <strong>{{ riceScores[1].name }}</strong> 的
              <strong>{{ Math.round((riceScores[0].rice / riceScores[1].rice) * 10) / 10 }}</strong> 倍。
            </p>
            <p v-if="riceScores[0].rice > 1000" class="insight-tip">
              最高优先级的功能 RICE 分数超过 1000，建议立即开始实施。
            </p>
            <p v-else-if="riceScores[0].rice < 100" class="insight-tip">
              所有功能的 RICE 分数都较低，建议重新评估或寻找更高价值的功能。
            </p>
          </div>
        </div>
      </div>

      <div class="explanation">
        <h4>如何使用 RICE 框架</h4>
        <ul>
          <li><strong>Reach（触达）</strong>：估算每月有多少用户会受到这个功能的影响</li>
          <li><strong>Impact（影响）</strong>：评估对用户的影响程度（1=小，2=中，3=大）</li>
          <li><strong>Confidence（信心）</strong>：你对以上评估有多大把握（0-100%）</li>
          <li><strong>Effort（工作量）</strong>：需要投入多少人月来完成这个功能</li>
        </ul>
        <p class="explanation-note">
          RICE 分数越高，优先级越高。这个框架帮助你把主观判断转化为可量化的数据，让优先级决策更加客观。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.calculator-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.input-panel,
.result-panel {
  padding: var(--spacing-md);
  background: var(--vp-c-bg-soft);
  border-radius: var(--radius-md);
  border: 1px solid var(--vp-c-divider);
}

h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 var(--spacing-md) 0;
}

.feature-tabs {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.feature-tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-md);
  background: var(--component-bg);
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--transition-base);
}

.feature-tab:hover {
  border-color: var(--vp-c-brand);
}

.feature-tab.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.remove-btn {
  font-size: 18px;
  line-height: 1;
  opacity: 0.7;
  transition: opacity var(--transition-base);
}

.remove-btn:hover {
  opacity: 1;
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: var(--spacing-xs);
}

.label-hint {
  font-size: 12px;
  font-weight: 400;
  color: var(--vp-c-text-3);
  margin-left: var(--spacing-xs);
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-md);
  background: var(--component-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  transition: all var(--transition-base);
}

.form-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.slider-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
}

.slider {
  flex: 1;
  height: 4px;
  border-radius: var(--radius-full);
  background: var(--vp-c-divider);
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  cursor: pointer;
  border: none;
}

.slider-value {
  min-width: 80px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-align: right;
}

.radio-group {
  display: flex;
  gap: var(--spacing-md);
}

.radio-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.radio-label input[type="radio"] {
  cursor: pointer;
}

.formula {
  padding: var(--spacing-md);
  background: var(--component-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--vp-c-divider);
  margin-bottom: var(--spacing-md);
}

.formula-text {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--vp-c-text-1);
  text-align: center;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--component-bg);
  border-radius: var(--radius-md);
  border: 2px solid transparent;
  transition: all var(--transition-base);
}

.ranking-item.highlighted {
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px rgba(21, 160, 81, 0.1);
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.rank-content {
  flex: 1;
}

.rank-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.rank-details {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.rank-score {
  text-align: center;
}

.score-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-brand);
  line-height: 1;
}

.score-label {
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin-top: 2px;
}

.insight {
  padding: var(--spacing-md);
  background: rgba(21, 160, 81, 0.05);
  border-radius: var(--radius-md);
  border: 1px solid rgba(21, 160, 81, 0.2);
}

.insight h5 {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 var(--spacing-xs) 0;
}

.insight p {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: var(--spacing-xs) 0;
  line-height: 1.6;
}

.insight-tip {
  font-style: italic;
}

.explanation {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--vp-c-bg-soft);
  border-radius: var(--radius-md);
  border: 1px solid var(--vp-c-divider);
}

.explanation h4 {
  margin-bottom: var(--spacing-sm);
}

.explanation ul {
  margin: var(--spacing-sm) 0;
  padding-left: var(--spacing-lg);
}

.explanation li {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: var(--spacing-xs) 0;
  line-height: 1.6;
}

.explanation-note {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin-top: var(--spacing-sm);
  font-style: italic;
}

@media (max-width: 640px) {
  .calculator-layout {
    grid-template-columns: 1fr;
  }

  .rank-details {
    flex-direction: column;
    gap: 2px;
  }
}
</style>
