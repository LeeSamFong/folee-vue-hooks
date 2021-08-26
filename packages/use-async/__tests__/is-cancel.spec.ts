import { isAxiosCancel } from '../utils/is-cancel'

describe('test is-cancel', () => {
  it('test isAxiosCancel', () => {
    expect(
      isAxiosCancel({
        __CANCEL__: true,
      }),
    ).toBeTruthy()

    expect(
      isAxiosCancel({
        __CANCEL__: false,
      }),
    ).toBeFalsy()
  })
})
