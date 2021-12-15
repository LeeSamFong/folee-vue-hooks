import { onUnmounted } from 'vue'

export const useInterval = (
  handler: TimerHandler,
  timeout?: number,
  ...args: any[]
): number => {
  const timer = window.setInterval(handler, timeout, ...args)

  onUnmounted(() => {
    window.clearInterval(timer)
  })

  return timer
}
