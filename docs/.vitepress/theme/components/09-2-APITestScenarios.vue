<script setup lang="ts">
import { ref } from 'vue'

interface TestScenario {
  id: string
  name: string
  icon: string
  color: string
  colorBg: string
  description: string
  examples: string[]
}

const scenarios: TestScenario[] = [
  {
    id: 'normal',
    name: '正常场景',
    icon: '✅',
    color: '#15a051',
    colorBg: 'rgba(21, 160, 81, 0.1)',
    description: '验证核心功能在理想条件下能正常工作',
    examples: [
      '有效评分 (1-5) → 保存成功 → 返回 201',
      '查询已存在的电影 → 返回完整数据 → 200',
      '登录用户访问个人资料 → 返回用户信息',
    ],
  },
  {
    id: 'validation',
    name: '校验场景',
    icon: '🔍',
    color: '#2eb3df',
    colorBg: 'rgba(46, 179, 223, 0.1)',
    description: '验证输入校验逻辑能正确拦截错误数据',
    examples: [
      '评分为 0 或 6 → 校验失败 → 返回 422',
      '缺少必填字段 → 返回 400 + 错误提示',
      '邮箱格式错误 → 拒绝注册 → 返回 400',
    ],
  },
  {
    id: 'permission',
    name: '权限场景',
    icon: '🔒',
    color: '#D4952C',
    colorBg: 'rgba(212, 149, 44, 0.1)',
    description: '验证权限控制能阻止未授权访问',
    examples: [
      '未登录访问受保护接口 → 返回 401',
      '普通用户访问管理员接口 → 返回 403',
      '访问其他用户的私有数据 → 返回 403',
    ],
  },
  {
    id: 'edge',
    name: '边界场景',
    icon: '⚠️',
    color: '#e53935',
    colorBg: 'rgba(229, 57, 53, 0.1)',
    description: '验证业务特有的边界情况和异常处理',
    examples: [
      '重复评分 → 更新旧评分 → 返回 200',
      '电影不存在 → 返回 404',
      '并发请求同一资源 → 正确处理竞态条件',
    ],
  },
]

const hoveredId = ref<string | null>(null)
const selectedId = ref<string | null>(null)
</script>

<template>
  <div class="api-test-scenarios">
    <div class="scenarios-header">
      <div class="header-icon">📡</div>
      <h3 class="header-title">API 测试四类场景</h3>
      <p class="header-subtitle">每个接口至少覆盖这四类场景</p>
    </div>

    <div class="scenarios-grid">
      <div
        v-for="scenario in scenarios"
        :key="scenario.id"
        :class="['scenario-card', {
          hovered: hoveredId === scenario.id,
          selected: selectedId === scenario.id
        }]"
        :style="{
          '--scenario-color': scenario.color,
          '--scenario-bg': scenario.colorBg
        }"
        @mouseenter="hoveredId = scenario.id"
        @mouseleave="hoveredId = null"
        @click="selectedId = selectedId === scenario.id ? null : scenario.id"
      >
        <div class="scenario-header">
          <span class="scenario-icon">{{ scenario.icon }}</span>
          <h4 class="scenario-name">{{ scenario.name }}</h4>
        </div>

        <p class="scenario-description">{{ scenario.description }}</p>

        <div class="scenario-examples">
          <h5 class="examples-title">示例</h5>
          <ul class="examples-list">
            <li
              v-for="(example, i) in scenario.examples"
              :key="i"
              class="example-item"
            >
              <span class="example-bullet">→</span>
              <span class="example-text">{{ example }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="scenarios-footer">
      <div class="footer-tip">
        <span class="tip-icon">💡</span>
        <span class="tip-text">点击卡片查看详细示例</span>
      </div>
      <div class="footer-note">
        覆盖这四类场景 = 高质量测试
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.api-test-scenarios {
  max-width: 1000px;
  margin: var(--spacing-lg) auto;
  padding: var(--spacing-lg);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
}

.scenarios-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.header-icon {
  font-size: 32px;
  margin-bottom: var(--spacing-sm);
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: var(--spacing-xs);
}

.header-subtitle {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.scenario-card {
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-divider);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.scenario-card:hover {
  border-color: var(--scenario-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.scenario-card.selected {
  border-color: var(--scenario-color);
  background: var(--scenario-bg);
  box-shadow: 0 0 0 3px var(--scenario-bg);
}

.scenario-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.scenario-icon {
  font-size: 24px;
}

.scenario-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--scenario-color);
}

.scenario-description {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin-bottom: var(--spacing-md);
}

.scenario-examples {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--vp-c-divider);
}

.examples-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: var(--spacing-sm);
}

.examples-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.example-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.example-bullet {
  color: var(--scenario-color);
  font-weight: 700;
  flex-shrink: 0;
}

.example-text {
  line-height: 1.5;
}

.scenarios-footer {
  text-align: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--vp-c-divider);
}

.footer-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.tip-icon {
  font-size: 16px;
}

.tip-text {
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.footer-note {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

/* 响应式设计 */
@media (max-width: 640px) {
  .api-test-scenarios {
    padding: var(--spacing-md);
  }

  .header-icon {
    font-size: 24px;
  }

  .header-title {
    font-size: 18px;
  }

  .header-subtitle {
    font-size: 13px;
  }

  .scenarios-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }

  .scenario-card {
    padding: var(--spacing-sm);
  }

  .scenario-icon {
    font-size: 20px;
  }

  .scenario-name {
    font-size: 14px;
  }

  .scenario-description {
    font-size: 12px;
  }

  .examples-title {
    font-size: 11px;
  }

  .example-item {
    font-size: 11px;
  }

  .footer-note {
    font-size: 13px;
  }
}
</style>
