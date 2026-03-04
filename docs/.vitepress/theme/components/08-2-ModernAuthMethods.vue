<script setup lang="ts">
import { ref } from 'vue'
import type { AuthMethod } from '../types/components'

const authMethods: AuthMethod[] = [
  {
    id: 'session',
    name: 'Session（会话）',
    icon: '🎫',
    pros: [
      '服务器完全掌控，可随时撤销',
      '安全性高，敏感信息不暴露',
      '适合传统 Web 应用'
    ],
    cons: [
      '每次请求需查数据库',
      '多服务器需共享存储',
      '扩展性相对较弱'
    ],
    useCase: '需要严格会话控制的应用（如银行、后台管理系统）'
  },
  {
    id: 'jwt',
    name: 'JWT Token（令牌）',
    icon: '🔑',
    pros: [
      '无需服务端存储，天然支持多服务器',
      '不需要查数据库，性能好',
      '适合微服务架构'
    ],
    cons: [
      '签发后无法撤销（除非维护黑名单）',
      'Token 体积较大',
      '需要妥善保管密钥'
    ],
    useCase: 'API 服务、微服务架构、移动应用后端'
  },
  {
    id: 'oauth',
    name: 'OAuth 2.0',
    icon: '🔗',
    pros: [
      '用户无需记新密码',
      '一键登录，体验好',
      '安全责任转移给第三方'
    ],
    cons: [
      '依赖第三方服务可用性',
      '需要配置 OAuth App',
      '用户可能担心隐私'
    ],
    useCase: '需要快速注册的应用、社交类产品'
  },
  {
    id: 'passkey',
    name: 'Passkeys（无密码）',
    icon: '👆',
    pros: [
      '无密码，无泄露风险',
      '防钓鱼攻击（绑定域名）',
      '用户体验极佳'
    ],
    cons: [
      '需要现代设备支持',
      '用户教育成本',
      '备用方案仍需密码'
    ],
    useCase: '面向现代设备用户的应用、高安全要求场景'
  },
  {
    id: 'magic-link',
    name: 'Magic Link（魔法链接）',
    icon: '✉️',
    pros: [
      '无需记密码',
      '实现简单',
      '适合低频使用场景'
    ],
    cons: [
      '依赖邮件送达',
      '可能进垃圾箱',
      '不适合高频登录'
    ],
    useCase: '内部工具、低频使用的应用'
  },
  {
    id: 'sso',
    name: 'SSO（单点登录）',
    icon: '🏢',
    pros: [
      '一次登录，全系统通用',
      '统一身份管理',
      '企业级安全'
    ],
    cons: [
      '配置复杂',
      '需要企业级基础设施',
      '个人项目用不到'
    ],
    useCase: '企业内部系统、多产品矩阵'
  }
]

const selectedMethod = ref<string | null>(null)

function selectMethod(id: string) {
  selectedMethod.value = selectedMethod.value === id ? null : id
}

function getMethodById(id: string) {
  return authMethods.find(m => m.id === id)
}
</script>

<template>
  <div class="component-wrapper">
    <div class="component-header">
      <h3 class="component-title">现代认证方式对比</h3>
    </div>

    <div class="component-body">
      <p class="intro">
        点击卡片查看详细信息。不同的认证方式适用于不同的场景，选择时需要权衡安全性、用户体验和实现成本。
      </p>

      <div class="methods-grid">
        <div
          v-for="method in authMethods"
          :key="method.id"
          class="method-card"
          :class="{ selected: selectedMethod === method.id }"
          @click="selectMethod(method.id)"
        >
          <div class="method-header">
            <span class="method-icon">{{ method.icon }}</span>
            <h4 class="method-name">{{ method.name }}</h4>
          </div>

          <div v-if="selectedMethod === method.id" class="method-details">
            <div class="detail-section">
              <h5 class="section-title">✅ 优点</h5>
              <ul class="detail-list">
                <li v-for="(pro, index) in method.pros" :key="index">{{ pro }}</li>
              </ul>
            </div>

            <div class="detail-section">
              <h5 class="section-title">⚠️ 缺点</h5>
              <ul class="detail-list">
                <li v-for="(con, index) in method.cons" :key="index">{{ con }}</li>
              </ul>
            </div>

            <div class="detail-section">
              <h5 class="section-title">💡 适用场景</h5>
              <p class="use-case">{{ method.useCase }}</p>
            </div>
          </div>

          <div v-else class="method-preview">
            <p class="preview-text">点击查看详情</p>
          </div>
        </div>
      </div>

      <!-- 对比表格 -->
      <div class="comparison-table">
        <h4>快速对比</h4>
        <table>
          <thead>
            <tr>
              <th>认证方式</th>
              <th>安全性</th>
              <th>用户体验</th>
              <th>实现难度</th>
              <th>扩展性</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Session</strong></td>
              <td><span class="rating high">高</span></td>
              <td><span class="rating medium">中</span></td>
              <td><span class="rating medium">中</span></td>
              <td><span class="rating medium">中</span></td>
            </tr>
            <tr>
              <td><strong>JWT Token</strong></td>
              <td><span class="rating medium">中</span></td>
              <td><span class="rating medium">中</span></td>
              <td><span class="rating medium">中</span></td>
              <td><span class="rating high">高</span></td>
            </tr>
            <tr>
              <td><strong>OAuth 2.0</strong></td>
              <td><span class="rating high">高</span></td>
              <td><span class="rating high">高</span></td>
              <td><span class="rating medium">中</span></td>
              <td><span class="rating high">高</span></td>
            </tr>
            <tr>
              <td><strong>Passkeys</strong></td>
              <td><span class="rating high">高</span></td>
              <td><span class="rating high">高</span></td>
              <td><span class="rating low">低</span></td>
              <td><span class="rating high">高</span></td>
            </tr>
            <tr>
              <td><strong>Magic Link</strong></td>
              <td><span class="rating medium">中</span></td>
              <td><span class="rating medium">中</span></td>
              <td><span class="rating high">低</span></td>
              <td><span class="rating medium">中</span></td>
            </tr>
            <tr>
              <td><strong>SSO</strong></td>
              <td><span class="rating high">高</span></td>
              <td><span class="rating high">高</span></td>
              <td><span class="rating low">高</span></td>
              <td><span class="rating high">高</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 推荐建议 -->
      <div class="recommendations">
        <h4>💡 选择建议</h4>
        <div class="recommendation-grid">
          <div class="recommendation-card">
            <h5>🚀 新项目推荐</h5>
            <p><strong>Better Auth</strong> + <strong>Session</strong> + <strong>OAuth</strong></p>
            <p class="recommendation-reason">
              数据自主、安全可控，同时支持第三方登录提升用户体验
            </p>
          </div>

          <div class="recommendation-card">
            <h5>📱 移动应用</h5>
            <p><strong>JWT Token</strong> + <strong>OAuth</strong></p>
            <p class="recommendation-reason">
              无状态设计适合移动端，OAuth 降低注册门槛
            </p>
          </div>

          <div class="recommendation-card">
            <h5>🔒 高安全场景</h5>
            <p><strong>Session</strong> + <strong>Passkeys</strong> + <strong>2FA</strong></p>
            <p class="recommendation-reason">
              多层防护，可随时撤销会话，无密码泄露风险
            </p>
          </div>

          <div class="recommendation-card">
            <h5>🛠️ 内部工具</h5>
            <p><strong>Magic Link</strong> 或 <strong>SSO</strong></p>
            <p class="recommendation-reason">
              低频使用场景，简化登录流程
            </p>
          </div>
        </div>
      </div>

      <!-- 注意事项 -->
      <div class="warning-box">
        <h5>⚠️ 重要提醒</h5>
        <ul>
          <li><strong>不要自己写认证逻辑</strong> — 使用成熟的认证库（如 Better Auth）</li>
          <li><strong>密码哈希</strong> — 使用 bcrypt 或 Argon2，不要用 MD5</li>
          <li><strong>Cookie 安全</strong> — 设置 HttpOnly、Secure、SameSite 属性</li>
          <li><strong>HTTPS</strong> — 生产环境必须使用 HTTPS</li>
          <li><strong>速率限制</strong> — 防止暴力破解</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.intro {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.method-card {
  padding: var(--spacing-md);
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
}

.method-card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.method-card.selected {
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px rgba(21, 160, 81, 0.1);
}

.method-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.method-icon {
  font-size: 32px;
}

.method-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.method-details {
  margin-top: var(--spacing-md);
  animation: fadeIn 0.3s ease;
}

.detail-section {
  margin-bottom: var(--spacing-md);
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 var(--spacing-xs) 0;
}

.detail-list {
  margin: 0;
  padding-left: var(--spacing-lg);
  list-style: disc;
}

.detail-list li {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: var(--spacing-xs) 0;
  line-height: 1.5;
}

.use-case {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
  font-style: italic;
}

.method-preview {
  text-align: center;
  padding: var(--spacing-md) 0;
}

.preview-text {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin: 0;
}

.comparison-table {
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-md);
  background: var(--vp-c-bg-soft);
  border-radius: var(--radius-lg);
  border: 1px solid var(--vp-c-divider);
  overflow-x: auto;
}

.comparison-table h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 var(--spacing-md) 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th {
  text-align: left;
  padding: var(--spacing-sm);
  background: var(--component-bg);
  color: var(--vp-c-text-1);
  font-weight: 600;
  border-bottom: 2px solid var(--vp-c-divider);
}

td {
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.rating {
  display: inline-block;
  padding: 2px var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
}

.rating.high {
  background: rgba(21, 160, 81, 0.1);
  color: var(--color-success);
}

.rating.medium {
  background: rgba(212, 149, 44, 0.1);
  color: var(--color-warning);
}

.rating.low {
  background: rgba(255, 59, 48, 0.1);
  color: var(--color-error);
}

.recommendations {
  margin: var(--spacing-xl) 0;
}

.recommendations h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 var(--spacing-md) 0;
}

.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-md);
}

.recommendation-card {
  padding: var(--spacing-md);
  background: var(--vp-c-bg-soft);
  border-radius: var(--radius-md);
  border: 1px solid var(--vp-c-divider);
}

.recommendation-card h5 {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 var(--spacing-xs) 0;
}

.recommendation-card p {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: var(--spacing-xs) 0;
  line-height: 1.5;
}

.recommendation-reason {
  font-size: 12px !important;
  color: var(--vp-c-text-3) !important;
  font-style: italic;
}

.warning-box {
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-md);
  background: rgba(255, 59, 48, 0.05);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 59, 48, 0.2);
}

.warning-box h5 {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-error);
  margin: 0 0 var(--spacing-sm) 0;
}

.warning-box ul {
  margin: 0;
  padding-left: var(--spacing-lg);
  list-style: disc;
}

.warning-box li {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: var(--spacing-xs) 0;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .methods-grid {
    grid-template-columns: 1fr;
  }

  .recommendation-grid {
    grid-template-columns: 1fr;
  }

  table {
    font-size: 12px;
  }

  th,
  td {
    padding: var(--spacing-xs);
  }
}
</style>
