<script setup lang="ts">
import { ref, computed } from 'vue'

interface Permission {
  id: string
  name: string
  description: string
}

interface Role {
  id: string
  name: string
  color: string
  description: string
}

const permissions: Permission[] = [
  { id: 'view-public', name: '浏览公开内容', description: '查看首页、电影列表等公开页面' },
  { id: 'view-profile', name: '查看个人资料', description: '访问自己的个人主页' },
  { id: 'create-review', name: '发布评论', description: '对电影发表评论和评分' },
  { id: 'edit-own', name: '编辑自己的内容', description: '修改自己发布的评论' },
  { id: 'delete-own', name: '删除自己的内容', description: '删除自己发布的评论' },
  { id: 'moderate-content', name: '审核内容', description: '删除违规评论、封禁用户' },
  { id: 'manage-movies', name: '管理电影', description: '添加、编辑、删除电影信息' },
  { id: 'manage-users', name: '管理用户', description: '查看用户列表、修改用户权限' },
  { id: 'view-analytics', name: '查看数据', description: '访问后台数据统计' },
  { id: 'system-config', name: '系统配置', description: '修改系统设置、管理数据库' }
]

const roles: Role[] = [
  {
    id: 'guest',
    name: '访客',
    color: '#9ca3af',
    description: '未登录用户，只能浏览公开内容'
  },
  {
    id: 'user',
    name: '普通用户',
    color: '#2eb3df',
    description: '已登录用户，可以发布和管理自己的内容'
  },
  {
    id: 'moderator',
    name: '版主',
    color: '#D4952C',
    description: '可以审核内容，删除违规评论'
  },
  {
    id: 'admin',
    name: '管理员',
    color: '#15a051',
    description: '拥有所有权限，可以管理整个系统'
  }
]

// 权限矩阵：role -> permissions
const permissionMatrix: Record<string, string[]> = {
  guest: ['view-public'],
  user: ['view-public', 'view-profile', 'create-review', 'edit-own', 'delete-own'],
  moderator: ['view-public', 'view-profile', 'create-review', 'edit-own', 'delete-own', 'moderate-content'],
  admin: permissions.map(p => p.id) // 所有权限
}

const selectedRole = ref<Role>(roles[1]) // 默认选中普通用户
const hoveredPermission = ref<string | null>(null)

function hasPermission(roleId: string, permissionId: string): boolean {
  return permissionMatrix[roleId]?.includes(permissionId) || false
}

function selectRole(role: Role) {
  selectedRole.value = role
}

function getPermissionCount(roleId: string): number {
  return permissionMatrix[roleId]?.length || 0
}

const selectedRolePermissions = computed(() => {
  return permissions.map(permission => ({
    ...permission,
    granted: hasPermission(selectedRole.value.id, permission.id)
  }))
})
</script>

<template>
  <div class="component-wrapper">
    <div class="component-header">
      <h3 class="component-title">角色权限矩阵（RBAC）</h3>
      <div class="role-selector">
        <button
          v-for="role in roles"
          :key="role.id"
          class="role-btn"
          :class="{ active: selectedRole.id === role.id }"
          :style="{ '--role-color': role.color }"
          @click="selectRole(role)"
        >
          {{ role.name }}
          <span class="permission-count">{{ getPermissionCount(role.id) }}</span>
        </button>
      </div>
    </div>

    <div class="component-body">
      <!-- 角色说明 -->
      <div class="role-info" :style="{ '--role-color': selectedRole.color }">
        <div class="role-info-header">
          <div class="role-name">{{ selectedRole.name }}</div>
          <div class="role-badge">
            {{ getPermissionCount(selectedRole.id) }} 项权限
          </div>
        </div>
        <div class="role-desc">{{ selectedRole.description }}</div>
      </div>

      <!-- 权限列表 -->
      <div class="permissions-grid">
        <div
          v-for="permission in selectedRolePermissions"
          :key="permission.id"
          class="permission-card"
          :class="{ granted: permission.granted, denied: !permission.granted }"
          @mouseenter="hoveredPermission = permission.id"
          @mouseleave="hoveredPermission = null"
        >
          <div class="permission-header">
            <div class="permission-icon">
              {{ permission.granted ? '✅' : '❌' }}
            </div>
            <div class="permission-status">
              {{ permission.granted ? '允许' : '拒绝' }}
            </div>
          </div>
          <div class="permission-name">{{ permission.name }}</div>
          <div
            v-if="hoveredPermission === permission.id"
            class="permission-desc"
          >
            {{ permission.description }}
          </div>
        </div>
      </div>

      <!-- 完整矩阵视图 -->
      <details class="matrix-details">
        <summary class="matrix-summary">查看完整权限矩阵</summary>
        <div class="matrix-table-wrapper">
          <table class="matrix-table">
            <thead>
              <tr>
                <th class="matrix-header">权限 / 角色</th>
                <th
                  v-for="role in roles"
                  :key="role.id"
                  class="matrix-header role-header"
                  :style="{ '--role-color': role.color }"
                >
                  {{ role.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="permission in permissions" :key="permission.id">
                <td class="permission-cell">
                  <div class="permission-cell-name">{{ permission.name }}</div>
                  <div class="permission-cell-desc">{{ permission.description }}</div>
                </td>
                <td
                  v-for="role in roles"
                  :key="role.id"
                  class="matrix-cell"
                  :class="{
                    granted: hasPermission(role.id, permission.id),
                    denied: !hasPermission(role.id, permission.id)
                  }"
                >
                  <div class="matrix-cell-icon">
                    {{ hasPermission(role.id, permission.id) ? '✓' : '×' }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>

      <!-- 知识点 -->
      <div class="knowledge-box">
        <div class="knowledge-title">💡 RBAC 核心概念</div>
        <ul class="knowledge-list">
          <li><strong>角色（Role）</strong>：一组权限的集合，如 admin、user、moderator</li>
          <li><strong>权限（Permission）</strong>：具体的操作能力，如"删除评论"、"管理用户"</li>
          <li><strong>用户-角色绑定</strong>：每个用户分配一个或多个角色</li>
          <li><strong>最小权限原则</strong>：只给用户完成工作所需的最小权限</li>
          <li><strong>纵深防御</strong>：前端隐藏入口 + Middleware 拦截 + API 内部校验</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.role-selector {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.role-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--component-border);
  border-radius: var(--radius-md);
  background: var(--component-bg);
  color: var(--component-text);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
}

.role-btn:hover {
  border-color: var(--role-color);
  background: var(--component-hover-bg);
}

.role-btn.active {
  border-color: var(--role-color);
  background: var(--role-color);
  color: white;
}

.permission-count {
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  font-size: 12px;
}

.role-btn.active .permission-count {
  background: rgba(255, 255, 255, 0.3);
}

.role-info {
  padding: var(--spacing-md);
  border-left: 4px solid var(--role-color);
  background: var(--component-hover-bg);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
}

.role-info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.role-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--component-text);
}

.role-badge {
  padding: 4px 12px;
  background: var(--role-color);
  color: white;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
}

.role-desc {
  color: var(--component-text-secondary);
  font-size: 14px;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.permission-card {
  padding: var(--spacing-md);
  border: 2px solid var(--component-border);
  border-radius: var(--radius-md);
  background: var(--component-bg);
  transition: all var(--transition-base);
  cursor: pointer;
  min-height: 100px;
}

.permission-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.permission-card.granted {
  border-color: var(--color-success);
  background: rgba(21, 160, 81, 0.05);
}

.permission-card.denied {
  border-color: var(--component-border);
  opacity: 0.6;
}

.permission-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.permission-icon {
  font-size: 20px;
}

.permission-status {
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 500;
}

.permission-card.granted .permission-status {
  background: rgba(21, 160, 81, 0.1);
  color: var(--color-success);
}

.permission-card.denied .permission-status {
  background: rgba(0, 0, 0, 0.05);
  color: var(--component-text-secondary);
}

.permission-name {
  font-weight: 600;
  color: var(--component-text);
  font-size: 14px;
  margin-bottom: var(--spacing-sm);
}

.permission-desc {
  font-size: 12px;
  color: var(--component-text-secondary);
  line-height: 1.5;
  animation: fadeIn 0.2s ease;
}

.matrix-details {
  margin: var(--spacing-xl) 0;
  border: 1px solid var(--component-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.matrix-summary {
  padding: var(--spacing-md);
  background: var(--component-hover-bg);
  cursor: pointer;
  font-weight: 600;
  color: var(--component-text);
  user-select: none;
}

.matrix-summary:hover {
  background: var(--component-border);
}

.matrix-table-wrapper {
  overflow-x: auto;
  padding: var(--spacing-md);
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.matrix-header {
  padding: var(--spacing-sm);
  text-align: left;
  font-weight: 600;
  color: var(--component-text);
  border-bottom: 2px solid var(--component-border);
}

.role-header {
  text-align: center;
  color: var(--role-color);
}

.permission-cell {
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--component-border);
}

.permission-cell-name {
  font-weight: 500;
  color: var(--component-text);
  margin-bottom: 4px;
}

.permission-cell-desc {
  font-size: 12px;
  color: var(--component-text-secondary);
}

.matrix-cell {
  padding: var(--spacing-sm);
  text-align: center;
  border-bottom: 1px solid var(--component-border);
  border-left: 1px solid var(--component-border);
}

.matrix-cell.granted {
  background: rgba(21, 160, 81, 0.1);
}

.matrix-cell.denied {
  background: rgba(0, 0, 0, 0.02);
  opacity: 0.5;
}

.matrix-cell-icon {
  font-size: 16px;
  font-weight: bold;
}

.matrix-cell.granted .matrix-cell-icon {
  color: var(--color-success);
}

.matrix-cell.denied .matrix-cell-icon {
  color: var(--component-text-secondary);
}

.knowledge-box {
  margin-top: var(--spacing-xl);
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
  .role-selector {
    flex-direction: column;
  }

  .role-btn {
    width: 100%;
    justify-content: space-between;
  }

  .permissions-grid {
    grid-template-columns: 1fr;
  }

  .matrix-table {
    font-size: 12px;
  }

  .matrix-header,
  .permission-cell,
  .matrix-cell {
    padding: var(--spacing-xs);
  }
}
</style>
