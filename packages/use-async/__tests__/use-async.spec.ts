import flushPromises from 'flush-promises'

import useAsync from '../index'
import { isAxiosCancel } from '../utils/is-cancel'

describe('use-async hook', () => {
  it('test init data', async () => {
    async function mockFunc() {
      return
    }

    const { run, clearError, reset, data, status, error, loading, cancel } =
      useAsync(mockFunc)

    expect(run).toBeTruthy()
    expect(clearError).toBeTruthy()
    expect(reset).toBeTruthy()
    expect(data.value).toBeUndefined()
    expect(status.value).toBe('idle')
    expect(error.value).toBeUndefined()
    expect(loading.value).toBeFalsy()
    expect(cancel.value).toBeFalsy()
  })

  it('test loading and success status', async () => {
    async function mockFunc() {
      return
    }

    const { run, loading, status } = useAsync(mockFunc)
    run()
    expect(loading.value).toBeTruthy()
    expect(status.value).toBe('loading')
    await flushPromises()
    expect(loading.value).toBeFalsy()
    expect(status.value).toBe('success')
  })

  it('test run loading lock', async () => {
    async function mockFunc() {
      return Promise.resolve()
    }

    const { run } = useAsync(mockFunc)
    run()
    try {
      await run()
    } catch (e) {
      expect(e.message).toBe('loading')
      return
    }
    throw new Error('loading is not locked')
  })

  it('test error status', async () => {
    const errorMsg = 'is error'

    async function mockFunc() {
      return Promise.reject(errorMsg)
    }

    const { run, error, status } = useAsync(mockFunc)
    try {
      await run()
    } catch (e) {
      expect(e).toBe(errorMsg)
      expect(error.value).toBe(errorMsg)
      expect(status.value).toBe('error')
      return
    }
    throw new Error('error status is abnormal')
  })

  it('test cancel status', async () => {
    async function mockAxiosCancelFunc() {
      return Promise.reject({
        __CANCEL__: true,
      })
    }

    const { run, cancel } = useAsync(mockAxiosCancelFunc)
    try {
      await run()
    } catch (e) {
      expect(isAxiosCancel(e)).toBeTruthy()
      expect(cancel.value).toBeTruthy()
      return
    }
    throw new Error('cancel status is abnormal')
  })

  it('test function run argument', async () => {
    const mockArgs = [1, '2', true]

    async function mockFunc(...args: typeof mockArgs) {
      args.forEach((item, index) => {
        expect(item).toBe(mockArgs[index])
      })
    }

    const { run } = useAsync(mockFunc)
    run(...mockArgs)
    await flushPromises()
  })

  it('test run data', async () => {
    const mockData = 'mock data'

    async function mockFunc() {
      return Promise.resolve(mockData)
    }

    const { run, data } = useAsync(mockFunc)
    const res = await run()
    expect(res).toBe(mockData)
    expect(data.value).toBe(mockData)
  })

  it('test reset', () => {
    async function mockFunc() {
      return Promise.resolve('mock data')
    }

    const { data, error, status, reset } = useAsync(mockFunc)
    data.value = 'test'
    error.value = 'test'
    status.value = 'success'

    reset()
    expect(data.value).toBeUndefined()
    expect(error.value).toBeUndefined()
    expect(status.value).toBe('idle')
  })

  it('test clearError', () => {
    async function mockFunc() {
      return Promise.resolve()
    }

    const { error, clearError } = useAsync(mockFunc)
    error.value = 'test'

    clearError()
    expect(error.value).toBeUndefined()
  })
})
