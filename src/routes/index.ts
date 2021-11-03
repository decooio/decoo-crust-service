import * as Router from 'koa-router'
import createKeyring from '../services/crust/krp'
import { getOrderState, orderPrice, placeOrder, transfer, transferBatch } from '../services/crust/order'
import { api } from '../services/crust/api'
import { blockInfo, getAccountBalance } from '../services/crust/info'
import { addressFromSeed, create } from '../services/crust/account'
import { successResponse } from '../helpers/response'
import { fromDecimal } from '../helpers/utils'
const router = new Router()
router.get('/order/price', async (ctx, next) => {
  try {
    const { filesize, account } = ctx.query as any
    const res = await orderPrice(api, account, filesize)
    if (!res) {
      throw new Error('Order Failed')
    }
    successResponse(ctx, res)
  } catch (e) {
    throw new Error(e)
  }
})
router.get('/order/:cid', async (ctx, next) => {
  try {
    const cid = ctx.params.cid
    const res = await getOrderState(api, cid)
    if (!res) {
      successResponse(ctx, { meaningfulData: null }, 2)
    } else {
      successResponse(ctx, { meaningfulData: res.meaningfulData })
    }
  } catch (e) {
    throw new Error(e)
  }
})
interface OrderInfo {
  fileCid: string,
  fileSize: number,
  seeds: string,
  tip: string,
  memo?: string
}
router.post('/order', async (ctx, next) => {
  try {
    const { fileCid, fileSize, seeds, memo = undefined, tip = 0.00005 } = ctx.request.body as OrderInfo
    const krp = createKeyring(seeds)
    const res = await placeOrder(api, krp, fileCid, fileSize, fromDecimal(tip).toFixed(0), memo)
    if (!res) {
      throw new Error('Order Failed')
    }
    successResponse(ctx, res)
  } catch (e) {
    throw new Error(e)
  }
})

router.get('/balance/:id', async (ctx, next) => {
  try {
    const account = ctx.params.id
    const free = await getAccountBalance(api, account)
    successResponse(ctx, {
      free,
      account
    }
    )
  } catch (e) {
    throw new Error(e)
  }
})

router.get('/account/balance/:id', async (ctx, next) => {
  try {
    const account = ctx.params.id
    const free = await getAccountBalance(api, account)
    successResponse(ctx, {
      free,
      account
    }
    )
  } catch (e) {
    throw new Error(e)
  }
})

router.post('/account/transfer', async (ctx) => {
  try {
    const { target, seeds, amount } = ctx.request.body
    const krp = createKeyring(seeds)
    const fromAccount = addressFromSeed(seeds)
    const hash = await transfer(api, krp, amount, target)
    const fromBalance = await getAccountBalance(api, fromAccount)
    const targetBalance = await getAccountBalance(api, target)
    successResponse(ctx, {
      ...hash,
      from: {
        address: fromAccount,
        balance: fromBalance
      },
      target: {
        address: target,
        balance: targetBalance
      }
    }
    )
  } catch (e) {
    throw new Error(e)
  }
})
router.get('/account/create', async (ctx) => {
  try {
    const addressInfo = await create()
    successResponse(ctx, addressInfo)
  } catch (e) {
    throw new Error(e)
  }
})
router.get('/block/state', async (ctx) => {
  try {
    const { blockHash, extrinsicHash } = ctx.query
    console.log({ blockHash, extrinsicHash })
    await blockInfo(api, blockHash as string, extrinsicHash as string)
    successResponse(ctx, { isFinalized: true })
  } catch (e) {
    throw new Error(e)
  }
})
router.post('/account/transfer/batch', async (ctx) => {
  try {
    const { seeds, records } = ctx.request.body
    const krp = createKeyring(seeds)
    const hash = await transferBatch(api, krp, records)
    successResponse(ctx, { tx: hash })
  } catch (e) {
    throw new Error(e)
  }
})
export default router.routes()
