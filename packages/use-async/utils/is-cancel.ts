export function isAxiosCancel(value: any) {
  return !!value?.__CANCEL__
}
