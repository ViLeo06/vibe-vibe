import { ref, onUnmounted } from 'vue'

/**
 * 动画工具 Composable
 * 提供定时器管理和常用动画函数
 */
export function useAnimation() {
  const timers = ref<number[]>([])
  const intervals = ref<number[]>([])

  /**
   * 延迟函数（自动管理定时器）
   */
  function delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      const id = window.setTimeout(resolve, ms)
      timers.value = [...timers.value, id]
    })
  }

  /**
   * 创建受管理的 setTimeout
   */
  function setTimeout(callback: () => void, ms: number): number {
    const id = window.setTimeout(callback, ms)
    timers.value = [...timers.value, id]
    return id
  }

  /**
   * 创建受管理的 setInterval
   */
  function setInterval(callback: () => void, ms: number): number {
    const id = window.setInterval(callback, ms)
    intervals.value = [...intervals.value, id]
    return id
  }

  /**
   * 清除特定的 timeout
   */
  function clearTimeout(id: number): void {
    window.clearTimeout(id)
    timers.value = timers.value.filter(t => t !== id)
  }

  /**
   * 清除特定的 interval
   */
  function clearInterval(id: number): void {
    window.clearInterval(id)
    intervals.value = intervals.value.filter(i => i !== id)
  }

  /**
   * 清除所有定时器
   */
  function clearAll(): void {
    timers.value.forEach(id => window.clearTimeout(id))
    intervals.value.forEach(id => window.clearInterval(id))
    timers.value = []
    intervals.value = []
  }

  /**
   * 打字机效果
   * @param targetText 目标文本
   * @param speed 打字速度（毫秒/字符）
   * @param onUpdate 每次更新时的回调
   */
  async function typeText(
    targetText: string,
    speed: number = 150,
    onUpdate: (text: string) => void
  ): Promise<void> {
    for (let i = 0; i <= targetText.length; i++) {
      onUpdate(targetText.slice(0, i))
      await delay(speed)
    }
  }

  /**
   * 数据包移动动画
   * @param duration 动画持续时间（毫秒）
   * @param onUpdate 进度更新回调（0-100）
   */
  function animatePacket(
    duration: number,
    onUpdate: (progress: number) => void
  ): Promise<void> {
    return new Promise(resolve => {
      const startTime = Date.now()
      const intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min((elapsed / duration) * 100, 100)
        onUpdate(progress)

        if (progress >= 100) {
          clearInterval(intervalId)
          resolve()
        }
      }, 20)
    })
  }

  /**
   * 步骤导航动画
   * @param steps 步骤数组
   * @param stepDelay 每步之间的延迟（毫秒）
   * @param onStepChange 步骤变化回调
   */
  async function playSteps(
    steps: any[],
    stepDelay: number = 800,
    onStepChange: (index: number) => void
  ): Promise<void> {
    for (let i = 0; i < steps.length; i++) {
      onStepChange(i)
      await delay(stepDelay)
    }
  }

  /**
   * 淡入淡出动画
   * @param element 元素引用
   * @param duration 动画持续时间（毫秒）
   * @param fadeIn 是否淡入（false 为淡出）
   */
  function fade(
    element: HTMLElement,
    duration: number = 300,
    fadeIn: boolean = true
  ): Promise<void> {
    return new Promise(resolve => {
      const startOpacity = fadeIn ? 0 : 1
      const endOpacity = fadeIn ? 1 : 0
      const startTime = Date.now()

      const intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        element.style.opacity = String(
          startOpacity + (endOpacity - startOpacity) * progress
        )

        if (progress >= 1) {
          clearInterval(intervalId)
          resolve()
        }
      }, 16)
    })
  }

  // 组件卸载时自动清理所有定时器
  onUnmounted(() => {
    clearAll()
  })

  return {
    delay,
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    clearAll,
    typeText,
    animatePacket,
    playSteps,
    fade,
  }
}
