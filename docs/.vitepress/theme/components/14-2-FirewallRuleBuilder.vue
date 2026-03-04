<script setup lang="ts">
import { ref, computed } from 'vue'

interface FirewallRule {
  id: string
  port: string
  protocol: 'tcp' | 'udp'
  direction: 'in' | 'out'
  action: 'allow' | 'deny'
  label: string
  preset: boolean
  enabled: boolean
}

const presetRules = ref<FirewallRule[]>([
  { id: 'ssh', port: '22', protocol: 'tcp', direction: 'in', action: 'allow', label: 'SSH', preset: true, enabled: false },
  { id: 'http', port: '80', protocol: 'tcp', direction: 'in', action: 'allow', label: 'HTTP', preset: true, enabled: false },
  { id: 'https', port: '443', protocol: 'tcp', direction: 'in', action: 'allow', label: 'HTTPS', preset: true, enabled: false },
])

interface CustomInput {
  port: string
  protocol: 'tcp' | 'udp'
  direction: 'in' | 'out'
  action: 'allow' | 'deny'
}

const customInput = ref<CustomInput>({
  port: '',
  protocol: 'tcp',
  direction: 'in',
  action: 'allow',
})

const customRules = ref<FirewallRule[]>([])
let customIdCounter = 0

function togglePreset(ruleId: string) {
  presetRules.value = presetRules.value.map(r =>
    r.id === ruleId ? { ...r, enabled: !r.enabled } : r
  )
}

function addCustomRule() {
  const port = customInput.value.port.trim()
  if (!port || !/^\d{1,5}$/.test(port)) return
  const portNum = parseInt(port, 10)
  if (portNum < 1 || portNum > 65535) return

  const newRule: FirewallRule = {
    id: `custom-${++customIdCounter}`,
    port,
    protocol: customInput.value.protocol,
    direction: customInput.value.direction,
    action: customInput.value.action,
    label: `Port ${port}`,
    preset: false,
    enabled: true,
  }

  customRules.value = [...customRules.value, newRule]
  customInput.value = { ...customInput.value, port: '' }
}

function removeCustomRule(ruleId: string) {
  customRules.value = customRules.value.filter(r => r.id !== ruleId)
}

const activeRules = computed(() => {
  const enabled = presetRules.value.filter(r => r.enabled)
  return [...enabled, ...customRules.value]
})

function generateCommand(rule: FirewallRule): string {
  const action = rule.action === 'allow' ? 'allow' : 'deny'
  const direction = rule.direction === 'in' ? 'in' : 'out'
  const portProto = `${rule.port}/${rule.protocol}`

  if (rule.direction === 'in' && rule.action === 'allow') {
    return `ufw allow ${portProto}`
  }
  return `ufw ${action} ${direction} ${portProto}`
}

function generateComment(rule: FirewallRule): string {
  const dirLabel = rule.direction === 'in' ? '入站' : '出站'
  const actLabel = rule.action === 'allow' ? '允许' : '拒绝'
  return `# ${rule.label} - ${actLabel}${dirLabel} ${rule.protocol.toUpperCase()}`
}
</script>

<template>
  <div class="fw-root">
    <h4 class="fw-title">防火墙规则构建器</h4>

    <!-- Preset Rules -->
    <div class="fw-section">
      <div class="fw-section-label">常用规则</div>
      <div class="fw-presets">
        <button
          v-for="rule in presetRules"
          :key="rule.id"
          :class="['fw-preset-card', { active: rule.enabled }]"
          @click="togglePreset(rule.id)"
        >
          <div class="fw-preset-top">
            <span class="fw-preset-name">{{ rule.label }}</span>
            <span class="fw-preset-toggle">
              <span :class="['fw-toggle-dot', { on: rule.enabled }]" />
            </span>
          </div>
          <div class="fw-preset-detail">
            <span class="fw-preset-port">{{ rule.port }}/{{ rule.protocol }}</span>
            <span class="fw-preset-dir">允许入站</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Custom Rule Builder -->
    <div class="fw-section">
      <div class="fw-section-label">自定义规则</div>
      <div class="fw-custom-form">
        <div class="fw-field">
          <label class="fw-field-label">端口</label>
          <input
            v-model="customInput.port"
            type="text"
            class="fw-input"
            placeholder="例如 3000"
            maxlength="5"
            @keyup.enter="addCustomRule"
          />
        </div>

        <div class="fw-field">
          <label class="fw-field-label">协议</label>
          <div class="fw-toggle-group">
            <button
              :class="['fw-toggle-btn', { active: customInput.protocol === 'tcp' }]"
              @click="customInput = { ...customInput, protocol: 'tcp' }"
            >TCP</button>
            <button
              :class="['fw-toggle-btn', { active: customInput.protocol === 'udp' }]"
              @click="customInput = { ...customInput, protocol: 'udp' }"
            >UDP</button>
          </div>
        </div>

        <div class="fw-field">
          <label class="fw-field-label">方向</label>
          <div class="fw-toggle-group">
            <button
              :class="['fw-toggle-btn', { active: customInput.direction === 'in' }]"
              @click="customInput = { ...customInput, direction: 'in' }"
            >入站</button>
            <button
              :class="['fw-toggle-btn', { active: customInput.direction === 'out' }]"
              @click="customInput = { ...customInput, direction: 'out' }"
            >出站</button>
          </div>
        </div>

        <div class="fw-field">
          <label class="fw-field-label">动作</label>
          <div class="fw-toggle-group">
            <button
              :class="['fw-toggle-btn', 'fw-toggle-allow', { active: customInput.action === 'allow' }]"
              @click="customInput = { ...customInput, action: 'allow' }"
            >允许</button>
            <button
              :class="['fw-toggle-btn', 'fw-toggle-deny', { active: customInput.action === 'deny' }]"
              @click="customInput = { ...customInput, action: 'deny' }"
            >拒绝</button>
          </div>
        </div>

        <button class="fw-add-btn" @click="addCustomRule">添加规则</button>
      </div>
    </div>

    <!-- Active Rules Output -->
    <div class="fw-section">
      <div class="fw-section-label">
        当前规则
        <span class="fw-rule-count">{{ activeRules.length }}</span>
      </div>

      <div v-if="activeRules.length === 0" class="fw-empty">
        尚未添加任何规则，请点击上方常用规则或自定义添加
      </div>

      <div v-else class="fw-output">
        <div class="fw-output-header">
          <code class="fw-output-title">ufw commands</code>
        </div>
        <div class="fw-output-body">
          <div v-for="rule in activeRules" :key="rule.id" class="fw-output-line">
            <code class="fw-cmd">{{ generateCommand(rule) }}</code>
            <span class="fw-comment">{{ generateComment(rule) }}</span>
            <button
              v-if="!rule.preset"
              class="fw-remove-btn"
              @click="removeCustomRule(rule.id)"
              title="移除规则"
            >&#x2715;</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.fw-root {
  max-width: 688px;
  margin: 1.5rem auto;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.fw-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

/* Sections */
.fw-section {
  margin-bottom: 20px;
}

.fw-section:last-child {
  margin-bottom: 0;
}

.fw-section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 10px;
}

.fw-rule-count {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
}

/* Preset Cards */
.fw-presets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.fw-preset-card {
  padding: 12px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.fw-preset-card:hover {
  border-color: var(--vp-c-brand-1);
}

.fw-preset-card.active {
  border-color: var(--color-success);
  background: rgba(21, 160, 81, 0.06);
}

.fw-preset-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.fw-preset-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.fw-preset-toggle {
  width: 28px;
  height: 16px;
  border-radius: 8px;
  background: var(--vp-c-divider);
  display: flex;
  align-items: center;
  padding: 2px;
  transition: background 0.2s;
}

.fw-preset-card.active .fw-preset-toggle {
  background: var(--color-success);
}

.fw-toggle-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
}

.fw-toggle-dot.on {
  transform: translateX(12px);
}

.fw-preset-detail {
  display: flex;
  gap: 8px;
  align-items: center;
}

.fw-preset-port {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.fw-preset-dir {
  font-size: 11px;
  color: var(--vp-c-text-3);
}

/* Custom Form */
.fw-custom-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-end;
  padding: 14px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.fw-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fw-field-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-3);
}

.fw-input {
  width: 90px;
  padding: 6px 10px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

.fw-input:focus {
  border-color: var(--vp-c-brand-1);
}

.fw-toggle-group {
  display: flex;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
}

.fw-toggle-btn {
  padding: 6px 12px;
  border: none;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.fw-toggle-btn + .fw-toggle-btn {
  border-left: 1px solid var(--vp-c-divider);
}

.fw-toggle-btn.active {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.fw-toggle-btn.fw-toggle-allow.active {
  background: var(--color-success);
}

.fw-toggle-btn.fw-toggle-deny.active {
  background: var(--color-error);
}

.fw-add-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.fw-add-btn:hover {
  opacity: 0.85;
}

/* Output */
.fw-empty {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px dashed var(--vp-c-divider);
}

.fw-output {
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.fw-output-header {
  padding: 8px 14px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.fw-output-title {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.fw-output-body {
  padding: 10px 14px;
}

.fw-output-line {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 5px 0;
  font-size: 13px;
}

.fw-cmd {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  color: var(--color-success);
  font-weight: 600;
  white-space: nowrap;
}

.fw-comment {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.fw-remove-btn {
  margin-left: auto;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}

.fw-remove-btn:hover {
  background: rgba(255, 59, 48, 0.1);
  color: var(--color-error);
}

/* Dark Mode */
:global(html.dark) .fw-preset-card.active {
  background: rgba(21, 160, 81, 0.08);
}

:global(html.dark) .fw-toggle-dot {
  background: #e5e7eb;
}

:global(html.dark) .fw-input {
  background: var(--vp-c-bg-soft);
}

:global(html.dark) .fw-output {
  border-color: #333;
}

:global(html.dark) .fw-output-header {
  background: #1e1e2e;
}

/* Responsive */
@media (max-width: 640px) {
  .fw-root {
    padding: 14px;
  }

  .fw-title {
    font-size: 14px;
  }

  .fw-presets {
    grid-template-columns: 1fr;
  }

  .fw-custom-form {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .fw-field {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .fw-input {
    width: 100%;
    flex: 1;
  }

  .fw-output-line {
    flex-wrap: wrap;
    gap: 4px;
  }

  .fw-comment {
    font-size: 11px;
  }

  .fw-cmd {
    font-size: 12px;
  }
}
</style>
