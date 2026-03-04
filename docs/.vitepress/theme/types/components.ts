/**
 * 通用组件类型定义
 */

/**
 * 步骤定义
 */
export interface Step {
  id: string | number
  label: string
  icon?: string
  description?: string
}

/**
 * 动画阶段
 */
export type AnimationPhase = 'idle' | 'playing' | 'paused' | 'complete'

/**
 * 对比项
 */
export interface ComparisonItem {
  aspect: string
  option1: string
  option2: string
  option1Label?: string
  option2Label?: string
}

/**
 * 流程节点
 */
export interface FlowNode {
  id: string
  label: string
  icon?: string
  type?: 'start' | 'process' | 'decision' | 'end'
  description?: string
}

/**
 * 流程连接
 */
export interface FlowConnection {
  from: string
  to: string
  label?: string
  type?: 'normal' | 'success' | 'error'
}

/**
 * 层级节点
 */
export interface HierarchyNode {
  id: string
  label: string
  icon?: string
  children?: HierarchyNode[]
  level?: number
}

/**
 * 矩阵单元格
 */
export interface MatrixCell {
  row: string | number
  col: string | number
  value: string | number | boolean
  color?: string
  icon?: string
}

/**
 * 卡片项
 */
export interface CardItem {
  id: string
  title: string
  description?: string
  icon?: string
  tags?: string[]
  metadata?: Record<string, any>
}

/**
 * 时序事件
 */
export interface TimelineEvent {
  id: string
  time: number | string
  actor: string
  action: string
  icon?: string
  type?: 'request' | 'response' | 'process' | 'error'
}

/**
 * 网络层级
 */
export interface NetworkLayer {
  id: string
  name: string
  range: string
  color: string
  description?: string
}

/**
 * 测试场景
 */
export interface TestScenario {
  id: string
  name: string
  type: 'unit' | 'integration' | 'e2e'
  description: string
  cost: 'low' | 'medium' | 'high'
  value: 'low' | 'medium' | 'high'
}

/**
 * 认证方法
 */
export interface AuthMethod {
  id: string
  name: string
  icon: string
  pros: string[]
  cons: string[]
  useCase: string
}

/**
 * 部署方式
 */
export interface DeploymentMethod {
  id: string
  name: string
  icon: string
  conditions: string[]
  steps: string[]
  limitations: string[]
}

/**
 * 优先级
 */
export type Priority = 'low' | 'medium' | 'high' | 'critical'

/**
 * 状态
 */
export type Status = 'pending' | 'in-progress' | 'completed' | 'blocked'
