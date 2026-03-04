<script setup lang="ts">
import { ref, computed } from 'vue'

interface FlakyCase {
  id: string
  name: string
  icon: string
  problem: string
  symptom: string
  cause: string
  solution: string
  badCode: string
  goodCode: string
  category: 'timing' | 'data' | 'environment'
}

const flakyCases: FlakyCase[] = [
  {
    id: 'async-timing',
    name: '异步操作时序问题',
    icon: '⏱️',
    problem: '点击按钮后立刻检查结果，但请求还没返回',
    symptom: '本地通过，CI 偶尔失败；网络快时通过，慢时失败',
    cause: '测试脚本没有等待异步操作完成就开始断言',
    solution: '使用显式等待，等到目标元素出现或更新后再断言',
    badCode: `// ❌ 错误：立刻断言
await page.click('[data-testid="submit"]')
await expect(page.locator('.result')).toContainText('成功')`,
    goodCode: `// ✅ 正确：等待元素出现
await page.click('[data-testid="submit"]')
await page.waitForSelector('.result')
await expect(page.locator('.result')).toContainText('成功')`,
    category: 'timing'
  },
  {
    id: 'hard-sleep',
    name: '硬编码等待时间',
    icon: '😴',
    problem: '用固定的 sleep 时间等待操作完成',
    symptom: '本地 2 秒够用，CI 上 2 秒不够；数据量大时失败',
    cause: '不同环境性能差异，固定时间无法适应所有情况',
    solution: '用条件等待代替固定等待，等到条件满足立刻继续',
    badCode: `// ❌ 错误：固定等待 2 秒
await page.click('[data-testid="submit"]')
await page.waitForTimeout(2000)
await expect(page.locator('.result')).toBeVisible()`,
    goodCode: `// ✅ 正确：等到元素可见
await page.click('[data-testid="submit"]')
await expect(page.locator('.result')).toBeVisible()
// Playwright 会自动等待最多 5 秒`,
    category: 'timing'
  },
  {
    id: 'data-race',
    name: '测试间数据竞争',
    icon: '🏁',
    problem: '测试 A 修改了数据，影响了测试 B 的结果',
    symptom: '单独跑每个测试都通过，一起跑就失败；测试顺序影响结果',
    cause: '测试之间共享数据库状态，没有做数据隔离',
    solution: '每个测试独立准备数据，测试结束后清理干净',
    badCode: `// ❌ 错误：共享数据
test('测试 A', async () => {
  await createMovie({ id: 42, title: '星际穿越' })
  // ...
})

test('测试 B', async () => {
  const movie = await getMovie(42)
  expect(movie).toBeNull() // 失败！测试 A 留下的数据
})`,
    goodCode: `// ✅ 正确：数据隔离
test('测试 A', async () => {
  const movieId = await createMovie({ title: '星际穿越' })
  // 使用 movieId
  await cleanup(movieId) // 清理
})

test('测试 B', async () => {
  const movieId = await createMovie({ title: '盗梦空间' })
  // 使用自己的数据
  await cleanup(movieId)
})`,
    category: 'data'
  },
  {
    id: 'selector-fragile',
    name: '脆弱的选择器',
    icon: '🎯',
    problem: '用 CSS 类名或文本内容定位元素，UI 改动后失效',
    symptom: '改了按钮样式或文案，测试就挂了',
    cause: '选择器依赖容易变化的属性（class、文本）',
    solution: '使用稳定的 data-testid 属性定位元素',
    badCode: `// ❌ 错误：依赖 class 和文本
await page.click('.btn-primary')
await page.click('text=提交评分')`,
    goodCode: `// ✅ 正确：使用 data-testid
await page.click('[data-testid="submit-rating"]')
// 即使按钮改样式、改文案，测试依然有效`,
    category: 'environment'
  },
  {
    id: 'env-difference',
    name: '环境差异',
    icon: '🌍',
    problem: '本地开发机性能好，CI 环境性能差',
    symptom: '本地测试全过，推到 GitHub Actions 就失败',
    cause: 'CI 虚拟机性能较差、网络延迟高',
    solution: '给断言设置合理的超时时间，不假设操作瞬间完成',
    badCode: `// ❌ 错误：默认超时可能不够
await expect(page.locator('.result')).toBeVisible()
// 默认 5 秒，CI 上可能不够`,
    goodCode: `// ✅ 正确：增加超时时间
await expect(page.locator('.result')).toBeVisible({
  timeout: 10000 // 10 秒
})`,
    category: 'environment'
  },
  {
    id: 'parallel-conflict',
    name: '并行测试冲突',
    icon: '⚡',
    problem: '多个测试同时操作同一资源（端口、文件、数据库）',
    symptom: '单独跑通过，并行跑失败；失败的测试不固定',
    cause: '测试之间争抢共享资源',
    solution: '为每个测试分配独立资源，或禁用并行执行',
    badCode: `// ❌ 错误：所有测试用同一端口
test('测试 A', async () => {
  const server = await startServer(3000)
  // ...
})

test('测试 B', async () => {
  const server = await startServer(3000) // 端口冲突！
  // ...
})`,
    goodCode: `// ✅ 正确：动态分配端口
test('测试 A', async () => {
  const port = await getAvailablePort()
  const server = await startServer(port)
  // ...
})

test('测试 B', async () => {
  const port = await getAvailablePort()
  const server = await startServer(port)
  // ...
})`,
    category: 'environment'
  }
]

const selectedCase = ref<FlakyCase>(flakyCases[0])
const selectedCategory = ref<'all' | 'timing' | 'data' | 'environment'>('all')

const categoryLabels = {
  all: '全部',
  timing: '时序问题',
  data: '数据竞争',
  environment: '环境差异'
}

const filteredCases = computed(() => {
  if (selectedCategory.value === 'all') {
    return flakyCases
  }
  return flakyCases.filter(c => c.category === selectedCategory.value)
})

function selectCase(flakyCase: FlakyCase) {
  selectedCase.value = flakyCase
}

function selectCategory(category: typeof selectedCategory.value) {
  selectedCategory.value = category
  // 如果当前选中的 case 不在筛选结果中，选择第一个
  if (!filteredCases.value.find(c => c.id === selectedCase.value.id)) {
    selectedCase.value = filteredCases.value[0]
  }
}
</script>

<template>
  <div class="component-wrapper">
    <div class="component-header">
      <h3 class="component-title">Flaky 测试原因分析</h3>
      <div class="category-filter">
        <button
          v-for="(label, key) in categoryLabels"
          :key="key"
          class="filter-btn"
          :class="{ active: selectedCategory === key }"
          @click="selectCategory(key as any)"
        >
          {{ label }}
        </button>
      </div>
    </div>

    <div class="component-body">
      <!-- 案例列表 -->
      <div class="cases-grid">
        <div
          v-for="flakyCase in filteredCases"
          :key="flakyCase.id"
          class="case-card"
          :class="{ active: selectedCase.id === flakyCase.id }"
          @click="selectCase(flakyCase)"
        >
          <div class="case-icon">{{ flakyCase.icon }}</div>
          <div class="case-name">{{ flakyCase.name }}</div>
        </div>
      </div>

      <!-- 详细分析 -->
      <div class="analysis-panel">
        <div class="analysis-header">
          <div class="analysis-icon">{{ selectedCase.icon }}</div>
          <div class="analysis-title">{{ selectedCase.name }}</div>
        </div>

        <div class="analysis-section">
          <div class="section-label">❓ 问题表现</div>
          <div class="section-content">{{ selectedCase.problem }}</div>
        </div>

        <div class="analysis-section">
          <div class="section-label">🔍 典型症状</div>
          <div class="section-content symptom">{{ selectedCase.symptom }}</div>
        </div>

        <div class="analysis-section">
          <div class="section-label">💡 根本原因</div>
          <div class="section-content cause">{{ selectedCase.cause }}</div>
        </div>

        <div class="analysis-section">
          <div class="section-label">✅ 解决方案</div>
          <div class="section-content solution">{{ selectedCase.solution }}</div>
        </div>

        <!-- 代码对比 -->
        <div class="code-comparison">
          <div class="code-block bad">
            <div class="code-header">❌ 错误写法</div>
            <pre><code>{{ selectedCase.badCode }}</code></pre>
          </div>

          <div class="code-arrow">→</div>

          <div class="code-block good">
            <div class="code-header">✅ 正确写法</div>
            <pre><code>{{ selectedCase.goodCode }}</code></pre>
          </div>
        </div>
      </div>

      <!-- 诊断流程 -->
      <div class="diagnosis-box">
        <div class="diagnosis-title">🔧 Flaky 测试诊断流程</div>
        <ol class="diagnosis-steps">
          <li>
            <strong>连续跑 5 次</strong>：用 <code>--repeat-each=5</code> 判断是 Flaky 还是真 bug
          </li>
          <li>
            <strong>看错误类型</strong>：超时？断言失败？网络错误？
          </li>
          <li>
            <strong>看截图</strong>：测试失败时页面是什么状态？
          </li>
          <li>
            <strong>看 Trace</strong>：网络请求返回了什么？哪一步卡住了？
          </li>
          <li>
            <strong>检查数据隔离</strong>：测试之间有没有共享状态？
          </li>
          <li>
            <strong>检查等待逻辑</strong>：有没有用 <code>sleep</code>？是否用了显式等待？
          </li>
        </ol>
      </div>

      <!-- 最佳实践 -->
      <div class="knowledge-box">
        <div class="knowledge-title">💡 避免 Flaky 测试的最佳实践</div>
        <ul class="knowledge-list">
          <li>永远不要用 <code>waitForTimeout</code>（固定等待），用条件等待</li>
          <li>每个测试独立准备数据，不依赖其他测试的状态</li>
          <li>使用 <code>data-testid</code> 而不是 CSS 类名或文本定位元素</li>
          <li>给断言设置合理的超时时间，考虑 CI 环境性能</li>
          <li>遇到 Flaky 测试立刻修复，不要让它"偶尔红"</li>
          <li>用 Playwright 的 <code>trace</code> 功能记录测试过程，方便排查</li>
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

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.case-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: 2px solid var(--component-border);
  border-radius: var(--radius-md);
  background: var(--component-bg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.case-card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.case-card.active {
  border-color: var(--vp-c-brand);
  background: rgba(21, 160, 81, 0.05);
}

.case-icon {
  font-size: 32px;
}

.case-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--component-text);
  text-align: center;
}

.analysis-panel {
  padding: var(--spacing-lg);
  border: 2px solid var(--vp-c-brand);
  border-radius: var(--radius-lg);
  background: var(--component-bg);
  margin-bottom: var(--spacing-lg);
}

.analysis-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--component-border);
}

.analysis-icon {
  font-size: 40px;
}

.analysis-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--component-text);
}

.analysis-section {
  margin-bottom: var(--spacing-md);
}

.section-label {
  font-weight: 600;
  color: var(--component-text);
  margin-bottom: var(--spacing-sm);
  font-size: 14px;
}

.section-content {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--component-hover-bg);
  border-radius: var(--radius-md);
  color: var(--component-text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.section-content.symptom {
  border-left: 3px solid var(--color-warning);
}

.section-content.cause {
  border-left: 3px solid var(--color-error);
}

.section-content.solution {
  border-left: 3px solid var(--color-success);
}

.code-comparison {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  align-items: center;
}

.code-block {
  border-radius: var(--radius-md);
  overflow: hidden;
}

.code-header {
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 600;
  font-size: 13px;
}

.code-block.bad .code-header {
  background: rgba(255, 59, 48, 0.1);
  color: var(--color-error);
}

.code-block.good .code-header {
  background: rgba(21, 160, 81, 0.1);
  color: var(--color-success);
}

.code-block pre {
  margin: 0;
  padding: var(--spacing-md);
  background: var(--component-hover-bg);
  overflow-x: auto;
}

.code-block code {
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  color: var(--component-text);
}

.code-arrow {
  font-size: 24px;
  color: var(--vp-c-brand);
  font-weight: bold;
}

.diagnosis-box {
  padding: var(--spacing-md);
  border: 2px solid var(--color-info);
  border-radius: var(--radius-md);
  background: rgba(46, 179, 223, 0.05);
  margin-bottom: var(--spacing-lg);
}

.diagnosis-title {
  font-weight: 600;
  color: var(--component-text);
  margin-bottom: var(--spacing-sm);
}

.diagnosis-steps {
  margin: 0;
  padding-left: var(--spacing-lg);
  color: var(--component-text-secondary);
  font-size: 14px;
  line-height: 1.8;
}

.diagnosis-steps strong {
  color: var(--component-text);
}

.diagnosis-steps code {
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 13px;
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

.knowledge-list code {
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 13px;
}

@media (max-width: 640px) {
  .category-filter {
    flex-direction: column;
  }

  .filter-btn {
    width: 100%;
  }

  .cases-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .code-comparison {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .code-arrow {
    transform: rotate(90deg);
    justify-self: center;
  }
}
</style>
