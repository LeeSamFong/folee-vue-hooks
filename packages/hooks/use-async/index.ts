import { computed, ref } from 'vue'
import { isAxiosCancel } from './utils/is-cancel'

export function useAsync<T, K extends unknown[]>(
  func: (...args: K) => Promise<T>,
) {
  const data = ref<T | undefined>()
  const error = ref<unknown>(undefined)
  const status = ref<'idle' | 'loading' | 'error' | 'cancel' | 'success'>(
    'idle',
  )
  const cancel = computed<boolean>(() => status.value === 'cancel')
  const loading = computed<boolean>(() => status.value === 'loading')

  async function run(...args: K) {
    if (loading.value) {
      throw new Error('loading')
    }

    status.value = 'loading'
    return func(...args)
      .then(res => {
        data.value = res
        status.value = 'success'
        error.value = undefined
        return res
      })
      .catch(err => {
        if (isAxiosCancel(err)) {
          status.value = 'cancel'
          return Promise.reject(err)
        }

        error.value = err
        status.value = 'error'
        return Promise.reject(err)
      })
  }

  function reset() {
    data.value = undefined
    error.value = undefined
    status.value = 'idle'
  }

  function clearError() {
    error.value = undefined
  }

  return {
    run,
    clearError,
    reset,
    data,
    status,
    error,
    loading,
    cancel,
  }
}
