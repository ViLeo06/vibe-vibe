<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnimation } from '../composables/useAnimation'

const { delay, typeText } = useAnimation()

interface DomainLevel {
  id: string
  name: string
  icon: string
  color: string
  description: string
  examples: string[]
  role: string
}

const levels: DomainLevel[] = [
  {
    id: 'root',
    name: '根域名',
    icon: '🌍',
    color: '#ff3b30',
    description: 'DNS 系统的最顶层，由 13 个根服务器管理',
    examples: ['.'],
    role: '指向顶级域名服务器'
  },
  {
    id: 'tld',
    name: '顶级域名 (TLD)',
    icon: '🏛️',
    color: '#ff9500',
    description: '域名的最后一部分，分为通用和国家/地区顶级域',
    examples: ['.com', '.org', '.net', '.cn', '.io'],
    role: '管理二级域名注册'
  },
  {
    id: 'second',
    name: '二级域名',
    icon: '🏢',
    color: '#ffcc00',
    description: '用户可以注册的域名，是网站的主要标识',
    examples: ['google.com', 'github.com', 'vercel.com'],
    role: '网站主域名'
  },
  {
    id: 'subdomain',
    name: '子域名',
    icon: '📁',
    color: '#34c759',
    description: '在二级域名下创建的子级域名，用于组织不同服务',
    examples: ['www.google.com', 'api.github.com', 'docs.vercel.com'],
    role: '服务分类和组织'
  }
]

const exampleDomain = ref('www.example.com')
const typedDomain = ref('')
const selectedLevel = ref<string | null>(null)
const isTyping = ref(false)
const parsedParts = ref<{ level: string; text: string; color: string }[]>([])

function selectLevel(id: string) {
  selectedLevel.value = selectedLevel.value === id ? null : id
}

async function parseDomain() {
  if (isTyping.value) return
  isTyping.value = true
  typedDomain.value = ''
  parsedParts.value = []

  // 打字机效果
  await typeText(exampleDomain.value, 100, (text) => {
    typedDomain.value = text
  })

  await delay(500)

  // 解析域名
  const parts = exampleDomain.value.split('.')
  const parsed: { level: string; text: string; color: string }[] = []

  if (parts.length >= 3) {
    // www.example.com
    parsed.push({ level: 'subdomain', text: parts[0], color: '#34c759' })
    parsed.push({ level: 'second', text: parts[1], color: '#ffcc00' })
    parsed.push({ level: 'tld', text: parts[2], color: '#ff9500' })
  } else if (parts.length === 2) {
    // example.com
    parsed.push({ level: 'second', text: parts[0], color: '#ffcc00' })
    parsed.push({ level: 'tld', text: parts[1], color: '#ff9500' })
  }

  for (let i = 0; i < parsed.length; i++) {
    parsedParts.value.push(parsed[i])
    await delay(400)
  }

  isTyping.value = false
}

const currentLevel = computed(() => levels.find(l => l.id === selectedLevel.value))

function getDomainExample(domain: string) {
  exampleDomain.value = domain
  parseDomain()
}
</script>

<template>
  <div class="domain-container">
    <div class="domain-header">
      <h3 class="domain-title">🌐 域名层级结构</h3>
    </div>

    <div class="domain-parser">
      <div class="parser-header">
        <span class="parser-icon">🔍</span>
        <span class="parser-title">域名解析演示</span>
      </div>

      <div class="parser-input">
        <input
          v-model="exampleDomain"
          type="text"
          placeholder="输入域名，如 www.example.com"
          class="domain-input"
          @keyup.enter="parseDomain"
        />
        <button
          class="parse-btn"
          :class="{ parsing: isTyping }"
          @click="parseDomain"
          :disabled="isTyping"
        >
          {{ isTyping ? '解析中...' : '解析' }}
        </button>
      </div>

      <div v-if="typedDomain" class="parser-result">
        <div class="typed-domain">{{ typedDomain }}</div>
        <div v-if="parsedParts.length > 0" class="parsed-parts">
          <div
            v-for="(part, index) in parsedParts"
            :key="index"
            class="domain-part"
            :style="{ '--part-color': part.color }"
          >
            <div class="part-text">{{ part.text }}</div>
            <div class="part-label">
              {{ levels.find(l => l.id === part.level)?.name }}
            </div>
          </div>
          <div v-if="parsedParts.length > 0" class="domain-part root-part">
            <div class="part-text">.</div>
            <div class="part-label">根域名</div>
          </div>
        </div>
      </div>

      <div class="quick-examples">
        <span class="examples-label">快速示例：</span>
        <button
          v-for="example in ['www.google.com', 'api.github.com', 'docs.vercel.com', 'example.com']"
          :key="example"
          class="example-btn"
          @click="getDomainExample(example)"
        >
          {{ example }}
        </button>
      </div>
    </div>

    <div class="hierarchy-levels">
      <div class="levels-title">📊 层级结构（从上到下）</div>
      <div class="levels-list">
        <div
          v-for="(level, index) in levels"
          :key="level.id"
          class="level-card"
          :class="{ selected: selectedLevel === level.id }"
          :style="{ '--level-color': level.color }"
          @click="selectLevel(level.id)"
        >
          <div class="level-main">
            <div class="level-icon">{{ level.icon }}</div>
            <div class="level-info">
              <div class="level-name">{{ level.name }}</div>
              <div class="level-desc">{{ level.description }}</div>
            </div>
            <div class="level-number">{{ index + 1 }}</div>
          </div>

          <div v-if="selectedLevel === level.id" class="level-details">
            <div class="detail-section">
              <div class="section-title">📝 示例</div>
              <div class="examples-grid">
                <code
                  v-for="example in level.examples"
                  :key="example"
                  class="example-code"
                >
                  {{ example }}
                </code>
              </div>
            </div>

            <div class="detail-section">
              <div class="section-title">🎯 作用</div>
              <div class="role-text">{{ level.role }}</div>
            </div>
          </div>

          <div class="level-arrow">↓</div>
        </div>
      </div>
    </div>

    <div class="dns-flow">
      <div class="flow-title">🔄 DNS 查询流程</div>
      <div class="flow-steps">
        <div class="flow-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <div class="step-title">查询根域名服务器</div>
            <div class="step-desc">获取 TLD 服务器地址</div>
          </div>
        </div>

        <div class="flow-arrow">→</div>

        <div class="flow-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <div class="step-title">查询 TLD 服务器</div>
            <div class="step-desc">获取权威域名服务器地址</div>
          </div>
        </div>

        <div class="flow-arrow">→</div>

        <div class="flow-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <div class="step-title">查询权威服务器</div>
            <div class="step-desc">获取最终 IP 地址</div>
          </div>
        </div>

        <div class="flow-arrow">→</div>

        <div class="flow-step">
          <div class="step-number">4</div>
          <div class="step-content">
            <div class="step-title">返回结果</div>
            <div class="step-desc">浏览器连接到服务器</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.domain-container {
  background: var(--vp-c-bg-soft);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.domain-header {
  margin-bottom: var(--spacing-lg);
}

.domain-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
}

.domain-parser {
  background: var(--component-bg);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.parser-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.parser-icon {
  font-size: 20px;
}

.parser-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.parser-input {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.domain-input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: var(--font-mono);
  color: var(--vp-c-text-1);
  transition: all var(--transition-base);
}

.domain-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.parse-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  min-width: 80px;
}

.parse-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.parse-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.parse-btn.parsing {
  animation: pulse 1s infinite;
}

.parser-result {
  padding: var(--spacing-md);
  background: var(--vp-c-bg-soft);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.typed-domain {
  font-size: 20px;
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--vp-c-brand);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.parsed-parts {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.domain-part {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--component-bg);
  border: 2px solid var(--part-color);
  border-radius: var(--radius-md);
  animation: fadeIn 0.3s ease;
}

.root-part {
  border-color: #ff3b30;
}

.part-text {
  font-size: 16px;
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.part-label {
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.quick-examples {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.examples-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.example-btn {
  padding: 4px 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all var(--transition-base);
}

.example-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.hierarchy-levels {
  background: var(--component-bg);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.levels-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: var(--spacing-md);
}

.levels-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.level-card {
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--component-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.level-card:hover {
  border-color: var(--level-color);
  transform: translateX(4px);
}

.level-card.selected {
  border-color: var(--level-color);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.level-main {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.level-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--level-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.level-info {
  flex: 1;
  min-width: 0;
}

.level-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.level-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.level-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--component-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  flex-shrink: 0;
}

.level-details {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--component-border);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  animation: fadeIn 0.3s ease;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.examples-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.example-code {
  padding: 4px 12px;
  background: var(--component-bg);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-family: var(--font-mono);
  color: var(--vp-c-brand);
}

.role-text {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.level-arrow {
  text-align: center;
  font-size: 24px;
  color: var(--vp-c-text-3);
  margin-top: var(--spacing-sm);
}

.level-card:last-child .level-arrow {
  display: none;
}

.dns-flow {
  background: var(--component-bg);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.flow-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: var(--spacing-md);
}

.flow-steps {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  overflow-x: auto;
  padding-bottom: var(--spacing-sm);
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 140px;
  padding: var(--spacing-md);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}

.step-content {
  text-align: center;
}

.step-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.step-desc {
  font-size: 11px;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

.flow-arrow {
  font-size: 20px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .parser-input {
    flex-direction: column;
  }

  .parse-btn {
    width: 100%;
  }

  .quick-examples {
    flex-direction: column;
    align-items: flex-start;
  }

  .example-btn {
    width: 100%;
  }

  .level-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .level-name {
    font-size: 14px;
  }

  .level-desc {
    font-size: 12px;
  }

  .flow-steps {
    flex-direction: column;
  }

  .flow-arrow {
    transform: rotate(90deg);
  }

  .flow-step {
    width: 100%;
  }
}
</style>
