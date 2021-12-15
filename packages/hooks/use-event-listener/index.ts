import { onMounted, onUnmounted } from 'vue'

type Options =
  | boolean
  | (AddEventListenerOptions & {
      immediate?: boolean // 是否立即执行监听
    })

export const useEventListener = <K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: Options,
) => {
  const addListener = () => {
    window.addEventListener(type, listener, options)
  }
  const removeListener = () => {
    window.removeEventListener(type, listener, options)
  }

  if (typeof options === 'object' && options.immediate) {
    addListener()
  } else {
    onMounted(() => {
      addListener()
    })
  }

  onUnmounted(() => {
    removeListener()
  })

  return removeListener
}

useEventListener('scroll', () => null)
