<script setup lang="ts">
import { ref, computed } from 'vue'

interface Question {
  id: string
  bad: string
  good: string
  category: 'future' | 'opinion' | 'vague' | 'leading'
  reason: string
  example: string
}

const questions: Question[] = [
  {
    id: 'q1',
    bad: '你会用这个功能吗？',
    good: '你上次怎么解决类似问题的？',
    category: 'future',
    reason: '未来意愿不可靠，大部分人会出于礼貌说"会"',
    example: '问过去的真实行为，而不是未来的假设意愿'
  },
  {
    id: 'q2',
    bad: '这个功能重要吗？',
    good: '你什么时候需要用到这个？',
    category: 'opinion',
    reason: '你会得到礼貌性的肯定，但不知道真实需求',
    example: '如果用户说不出具体场景，说明其实没那么需要'
  },
  {
    id: 'q3',
    bad: '你觉得这个设计怎么样？',
    good: '这个设计让你哪里困惑？',
    category: 'vague',
    reason: '笼统的问题只能得到笼统的回答（"还行"）',
    example: '直接问困惑点，从细节中发现真实问题'
  },
  {
    id: 'q4',
    bad: '你想要什么功能？',
    good: '你最近遇到什么困难？',
    category: 'vague',
    reason: '用户不是产品经理，他们不知道什么功能是可行的',
    example: '从困难出发，你来想解决方案'
  },
  {
    id: 'q5',
    bad: '你是不是觉得这个按钮太小了？',
    good: '你在使用时遇到了什么问题？',
    category: 'leading',
    reason: '引导性问题会让用户附和你的观点',
    example: '让用户自由表达，不要暗示答案'
  },
  {
    id: 'q6',
    bad: '你喜欢这个功能吗？',
    good: '你上次用这个功能是什么时候？当时顺利吗？',
    category: 'opinion',
    reason: '"喜欢"是主观感受，不能指导改进',
    example: '问具体的使用场景和遇到的问题'
  },
  {
    id: 'q7',
    bad: '如果我们加这个功能，你会付费吗？',
    good: '你现在用什么工具解决这个问题？花了多少钱？',
    category: 'future',
    reason: '假设性的付费意愿不可靠',
    example: '问现在的解决方案和实际支出'
  },
  {
    id: 'q8',
    bad: '你觉得我们的产品和竞品比怎么样？',
    good: '你为什么选择我们的产品而不是竞品？',
    category: 'vague',
    reason: '笼统对比得不到有用信息',
    example: '问具体的选择原因和决策过程'
  },
  {
    id: 'q9',
    bad: '你希望我们改进什么？',
    good: '你上次使用时，哪个步骤让你感到困惑或沮丧？',
    category: 'vague',
    reason: '用户可能说不出来，或者说的是表面问题',
    example: '从具体的使用体验中挖掘真实痛点'
  },
  {
    id: 'q10',
    bad: '这个价格你能接受吗？',
    good: '你现在的解决方案花了多少钱？效果如何？',
    category: 'leading',
    reason: '直接问价格会得到礼貌性回答',
    example: '了解现有方案的成本和效果，间接判断价格敏感度'
  }
]

const categories = {
  future: { label: '谈论未来', color: '#D4952C', icon: '🔮' },
  opinion: { label: '征求意见', color: '#2eb3df', icon: '💭' },
  vague: { label: '笼统提问', color: '#9ca3af', icon: '🌫️' },
  leading: { label: '引导答案', color: '#ff3b30', icon: '🎯' }
}

const selectedCategory = ref<'all' | keyof typeof categories>('all')
const selectedQuestion = ref<Question | null>(null)

const filteredQuestions = computed(() => {
  if (selectedCategory.value === 'all') {
    return questions
  }
  return questions.filter(q => q.category === selectedCategory.value)
})

function selectCategory(category: typeof selectedCategory.value) {
  selectedCategory.value = category
  selectedQuestion.value = null
}

function selectQuestion(question: Question) {
  selectedQuestion.value = selectedQuestion.value?.id === question.id ? null : question
}

function getCategoryInfo(category: keyof typeof categories) {
  return categories[category]
}
</script>

<template>
  <div class="component-wrapper">
    <div class="component-header">
      <h3 class="component-title">访谈问题对比库</h3>
      <div class="category-filter">
        <button
          class="filter-btn"
          :class="{ active: selectedCategory === 'all' }"
          @click="selectCategory('all')"
        >
          全部
        </button>
        <button
          v-for="(info, key) in categories"
          :key="key"
          class="filter-btn"
          :class="{ active: selectedCategory === key }"
          :style="{ '--category-color': info.color }"
          @click="selectCategory(key as any)"
        >
          {{ info.icon }} {{ info.label }}
        </button>
      </div>
    </div>

    <div class="component-body">
      <!-- 问题列表 -->
      <div class="questions-list">
        <div
          v-for="question in filteredQuestions"
          :key="question.id"
          class="question-item"
          :class="{ expanded: selectedQuestion?.id === question.id }"
          @click="selectQuestion(question)"
        >
          <div class="question-header">
            <div class="question-category">
              <span class="category-icon">
                {{ getCategoryInfo(question.category).icon }}
              </span>
              <span
                class="category-label"
                :style="{ color: getCategoryInfo(question.category).color }"
              >
                {{ getCategoryInfo(question.category).label }}
              </span>
            </div>
            <div class="expand-icon">
              {{ selectedQuestion?.id === question.id ? '▼' : '▶' }}
            </div>
          </div>

          <div class="question-comparison">
            <div class="question-bad">
              <div class="question-label">❌ 坏问题</div>
              <div class="question-text">{{ question.bad }}</div>
            </div>

            <div class="question-arrow">→</div>

            <div class="question-good">
              <div class="question-label">✅ 好问题</div>
              <div class="question-text">{{ question.good }}</div>
            </div>
          </div>

          <!-- 展开的详细信息 -->
          <div v-if="selectedQuestion?.id === question.id" class="question-details">
            <div class="detail-section">
              <div class="detail-label">💡 为什么不好</div>
              <div class="detail-content">{{ question.reason }}</div>
            </div>

            <div class="detail-section">
              <div class="detail-label">✨ 改进要点</div>
              <div class="detail-content">{{ question.example }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- The Mom Test 核心原则 -->
      <div class="principles-box">
        <div class="principles-title">📖 The Mom Test 核心原则</div>
        <div class="principles-grid">
          <div class="principle-card">
            <div class="principle-icon">⏮️</div>
            <div class="principle-name">谈论过去而非未来</div>
            <div class="principle-desc">
              过去的行为是真实的，"你上次怎么做的"比"你以后会不会用"可靠一万倍
            </div>
          </div>

          <div class="principle-card">
            <div class="principle-icon">🔍</div>
            <div class="principle-name">谈论具体而非笼统</div>
            <div class="principle-desc">
              "你上次遇到什么困难"比"你觉得怎么样"有价值得多，细节能揭示真实问题
            </div>
          </div>

          <div class="principle-card">
            <div class="principle-icon">👂</div>
            <div class="principle-name">少问多听</div>
            <div class="principle-desc">
              让用户多说，你少说，从细节中发现真实需求。沉默是最强的追问技巧
            </div>
          </div>
        </div>
      </div>

      <!-- 访谈技巧 -->
      <div class="knowledge-box">
        <div class="knowledge-title">💡 访谈实操技巧</div>
        <ul class="knowledge-list">
          <li><strong>开放式问题</strong>：用"能说说…""怎么…""为什么…"打开话题</li>
          <li><strong>追问细节</strong>："能具体说说吗？""能举个例子吗？"</li>
          <li><strong>观察操作</strong>：让用户演示操作过程，观察犹豫、停顿、皱眉</li>
          <li><strong>保持中立</strong>：不要推销产品，不要解释功能，不要引导答案</li>
          <li><strong>记录原话</strong>：不要只记总结，原话可能包含关键信息</li>
          <li><strong>5-10 次够了</strong>：从第 4 次开始会反复听到同样的问题</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.category-filter {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.filter-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  background: var(--component-bg);
  color: var(--component-text);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-base);
}

.filter-btn:hover {
  border-color: var(--vp-c-brand);
  background: var(--component-hover-bg);
}

.filter-btn.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.filter-btn.active[style*="--category-color"] {
  background: var(--category-color);
  border-color: var(--category-color);
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.question-item {
  padding: var(--spacing-md);
  border: 2px solid var(--component-border);
  border-radius: var(--radius-md);
  background: var(--component-bg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.question-item:hover {
  border-color: var(--vp-c-brand);
  box-shadow: var(--shadow-md);
}

.question-item.expanded {
  border-color: var(--vp-c-brand);
  background: rgba(21, 160, 81, 0.02);
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.question-category {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.category-icon {
  font-size: 16px;
}

.category-label {
  font-size: 13px;
  font-weight: 600;
}

.expand-icon {
  font-size: 12px;
  color: var(--component-text-secondary);
}

.question-comparison {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--spacing-md);
  align-items: center;
}

.question-bad,
.question-good {
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
}

.question-bad {
  background: rgba(255, 59, 48, 0.05);
  border-left: 3px solid var(--color-error);
}

.question-good {
  background: rgba(21, 160, 81, 0.05);
  border-left: 3px solid var(--color-success);
}

.question-label {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
}

.question-bad .question-label {
  color: var(--color-error);
}

.question-good .question-label {
  color: var(--color-success);
}

.question-text {
  font-size: 14px;
  color: var(--component-text);
  line-height: 1.5;
}

.question-arrow {
  font-size: 20px;
  color: var(--vp-c-brand);
  font-weight: bold;
}

.question-details {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--component-border);
  animation: fadeIn 0.3s ease;
}

.detail-section {
  margin-bottom: var(--spacing-sm);
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--component-text);
  margin-bottom: 4px;
}

.detail-content {
  font-size: 14px;
  color: var(--component-text-secondary);
  line-height: 1.6;
  padding-left: var(--spacing-md);
}

.principles-box {
  padding: var(--spacing-lg);
  border: 2px solid var(--vp-c-brand);
  border-radius: var(--radius-lg);
  background: rgba(21, 160, 81, 0.02);
  margin-bottom: var(--spacing-lg);
}

.principles-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--component-text);
  margin-bottom: var(--spacing-md);
}

.principles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.principle-card {
  padding: var(--spacing-md);
  background: var(--component-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--component-border);
}

.principle-icon {
  font-size: 32px;
  margin-bottom: var(--spacing-sm);
}

.principle-name {
  font-weight: 600;
  color: var(--component-text);
  margin-bottom: var(--spacing-sm);
  font-size: 15px;
}

.principle-desc {
  font-size: 13px;
  color: var(--component-text-secondary);
  line-height: 1.6;
}

.knowledge-box {
  padding: var(--spacing-md);
  border-left: 3px solid var(--vp-c-brand);
  background: var(--component-hover-bg);
  border-radius: var(--radius-sm);
}

.knowledge-title {
  font-weight: 600;
  color: var(--component-text);
  margin-bottom: var(--spacing-sm);
}

.knowledge-list {
  margin: 0;
  padding-left: var(--spacing-lg);
  color: var(--component-text-secondary);
  font-size: 14px;
  line-height: 1.8;
}

.knowledge-list strong {
  color: var(--component-text);
}

@media (max-width: 640px) {
  .category-filter {
    flex-direction: column;
  }

  .filter-btn {
    width: 100%;
  }

  .question-comparison {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .question-arrow {
    transform: rotate(90deg);
    justify-self: center;
  }

  .principles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
