<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

interface SecurityStep {
  id: string
  label: string
  command?: string
  description: string
  icon: string
  color: string
}

const securitySteps: SecurityStep[] = [
  {
    id: 'connect',
    label: '连接服务器',
    command: 'ssh root@your-server-ip',
    description: '首次 SSH 连接',
    icon: '🔌',
    color: '#2eb3df',
  },
  {
    id: 'update',
    label: '系统更新',
    command: 'apt update && apt upgrade -y',
    description: '更新所有软件包',
    icon: '🔄',
    color: '#15a051',
  },
  {
    id: 'tools',
    label: '安装工具',
    command: 'apt install vim git curl...',
    description: '安装常用工具',
    icon: '🛠️',
    color: '#9333ea',
  },
  {
    id: 'firewall',
    label: '配置防火墙',
    command: 'ufw enable',
    description: '只开放必要端口',
    icon: '🛡️',
    color: '#ff9500',
  },
  {
    id: 'ssh',
    label: 'SSH 加固',
    command: '禁用密码登录',
    description: '只允许密钥认证',
    icon: '🔐',
    color: '#e53935',
  },
  {
    id: 'user',
    label: '创建普通用户',
    command: 'adduser username',
    description: '避免直接用 root',
    icon: '👤',
    color: '#D4952C',
  },
]

const currentStep = ref(-1)
const isPlaying = ref(false)
const timers = ref<number[]>([])

async function playHardening() {
  if (isPlaying.value) return
  isPlaying.value = true
  currentStep.value = -1

  for (let i = 0; i < securitySteps.length; i++) {
    currentStep.value = i
    await new Promise<void>(resolve => {
      const id = window.setTimeout(resolve, 1200)
      timers.value = [...timers.value, id]
    })
  }

  isPlaying.value = false
}

function resetHardening() {
  currentStep.value = -1
  isPlaying.value = false
}

onUnmounted(() => {
  timers.value.forEach(id => clearTimeout(id))
})
</script>

<template>
  <div class="sec-root">
    <div class="sec-header">
      <h4 class="sec-title">服务器安全加固流程</h4>
      <div class="sec-controls">
        <button class="sec-btn" @click="playHardening" :disabled="isPlaying">
          {{ isPlaying ? '执行中...' : '演示流程' }}
        </button>
        <button
          v-if="currentStep >= securitySteps.length - 1 && !isPlaying"
          class="sec-btn sec-btn-outline"
          @click="resetHardening"
        >
          重置
        </button>
      </div>
    </div>

    <div class="sec-timeline">
      <div
        v-for="(step, index) in securitySteps"
        :key="step.id"
        :class="[
          'sec-step',
          {
            pending: currentStep < index,
            active: currentStep === index,
            done: currentStep > index,
          },
        ]"
      >
        <div class="sec-step-marker" :style="{ '--step-color': step.color }">
          <div class="sec-step-icon">{{ step.icon }}</div>
          <div v-if="currentStep > index" class="sec-step-check">✓</div>
        </div>

        <div class="sec-step-content">
          <div class="sec-step-header">
            <span class="sec-step-label">{{ step.label }}</span>
            <span v-if="currentStep === index" class="sec-step-badge">执行中</span>
            <span v-if="currentStep > index" class="sec-step-badge sec-step-badge-done">完成</span>
          </div>
          <div v-if="step.command" class="sec-step-command">
            <code>{{ step.command }}</code>
          </div>
          <div class="sec-step-desc">{{ step.description }}</div>
        </div>

        <div v-if="index < securitySteps.length - 1" class="sec-step-connector" />
      </div>
    </div>

    <div v-if="currentStep >= securitySteps.length - 1" class="sec-result">
      <div class="sec-result-icon">🎯</div>
      <div class="sec-result-content">
        <div class="sec-result-title">安全加固完成</div>
        <div class="sec-result-desc">服务器现在可以安全地对外提供服务</div>
      </div>
    </div>

    <div class="sec-warning">
      <div class="sec-warning-icon">⚠️</div>
      <div class="sec-warning-text">
        <strong>重要提示：</strong>裸奔的服务器在互联网上平均几分钟就会被扫描到，务必完成安全加固后再部署应用。
      </div>
    </div>
  </div>
</template>

<style scoped>
.sec-root {
  margin: 24px 0;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.sec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.sec-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.sec-controls {
  display: flex;
  gap: 8px;
}

.sec-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  background: #15a051;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.sec-btn:hover:not(:disabled) {
  background: #128a44;
}

.sec-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sec-btn-outline {
  background: transparent;
  border: 1.5px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.sec-btn-outline:hover:not(:disabled) {
  border-color: var(--vp-c-text-3);
}

.sec-timeline {
  position: relative;
  margin-bottom: 20px;
}

.sec-step {
  position: relative;
  display: flex;
  gap: 16px;
  padding-bottom: 24px;
  opacity: 0.4;
  transition: opacity 0.3s;
}

.sec-step.active,
.sec-step.done {
  opacity: 1;
}

.sec-step-marker {
  position: relative;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-divider);
  transition: all 0.3s;
}

.sec-step.active .sec-step-marker {
  border-color: var(--step-color);
  background: color-mix(in srgb, var(--step-color) 10%, var(--vp-c-bg));
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--step-color) 15%, transparent);
}

.sec-step.done .sec-step-marker {
  border-color: #15a051;
  background: rgba(21, 160, 81, 0.1);
}

.sec-step-icon {
  font-size: 24px;
}

.sec-step-check {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #15a051;
  color: #fff;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  border: 2px solid var(--vp-c-bg-soft);
}

.sec-step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sec-step-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sec-step-label {
  font-size: 15px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.sec-step-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(46, 179, 223, 0.15);
  color: #2eb3df;
}

.sec-step-badge-done {
  background: rgba(21, 160, 81, 0.15);
  color: #15a051;
}

.sec-step-command {
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.sec-step-command code {
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  color: var(--vp-c-text-1);
}

.sec-step-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.sec-step-connector {
  position: absolute;
  left: 23px;
  top: 48px;
  bottom: 0;
  width: 2px;
  background: var(--vp-c-divider);
}

.sec-step:last-child .sec-step-connector {
  display: none;
}

.sec-result {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(21, 160, 81, 0.1), rgba(46, 179, 223, 0.1));
  border: 1.5px solid rgba(21, 160, 81, 0.3);
  margin-bottom: 20px;
}

.sec-result-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.sec-result-content {
  flex: 1;
}

.sec-result-title {
  font-size: 16px;
  font-weight: 700;
  color: #15a051;
  margin-bottom: 4px;
}

.sec-result-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.sec-warning {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(212, 149, 44, 0.08);
  border: 1px solid rgba(212, 149, 44, 0.2);
}

.sec-warning-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.sec-warning-text {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.sec-warning-text strong {
  color: #D4952C;
  font-weight: 600;
}

@media (max-width: 640px) {
  .sec-root {
    padding: 16px;
  }

  .sec-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .sec-title {
    font-size: 14px;
  }

  .sec-step {
    gap: 12px;
    padding-bottom: 20px;
  }

  .sec-step-marker {
    width: 40px;
    height: 40px;
  }

  .sec-step-icon {
    font-size: 20px;
  }

  .sec-step-connector {
    left: 19px;
    top: 40px;
  }

  .sec-step-label {
    font-size: 13px;
  }

  .sec-step-command code {
    font-size: 11px;
  }

  .sec-step-desc {
    font-size: 12px;
  }

  .sec-result {
    padding: 12px 16px;
    gap: 12px;
  }

  .sec-result-icon {
    font-size: 24px;
  }

  .sec-result-title {
    font-size: 14px;
  }

  .sec-result-desc {
    font-size: 12px;
  }

  .sec-warning-text {
    font-size: 11px;
  }
}
</style>
