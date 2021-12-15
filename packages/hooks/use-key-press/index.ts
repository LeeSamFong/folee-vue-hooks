import { useEventListener, EventListenerOptions } from '@folee-vue-hooks/hooks'

export const useKeyPress = (
  key: string | string[],
  cb: (event: KeyboardEvent) => any,
  options?: EventListenerOptions & {
    keyPressType?: 'keyup' | 'keydown' | 'keypress'
  },
) => {
  let trigger: (event: KeyboardEvent) => void
  if (Array.isArray(key)) {
    trigger = event => {
      if (key.includes(event.key)) {
        cb(event)
      }
    }
  } else {
    trigger = event => {
      if (event.key === key) {
        cb(event)
      }
    }
  }

  const type =
    (typeof options === 'object' && options.keyPressType) || 'keydown'
  return useEventListener(type, trigger, options)
}
