import BigNumber from 'bignumber.js'
export const fromDecimal = (amount: number | string) => {
  const amountBN = new BigNumber(amount)
  return amountBN.multipliedBy(new BigNumber(1_000_000_000_000))
}
