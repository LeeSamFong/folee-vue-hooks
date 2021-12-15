import { onUnmounted } from 'vue'

export const useTimeout = (
  handler: TimerHandler,
  timeout?: number,
  ...args: any[]
): number => {
  const timer = window.setTimeout(handler, timeout, ...args)

  onUnmounted(() => {
    window.clearTimeout(timer)
  })

  return timer
}
