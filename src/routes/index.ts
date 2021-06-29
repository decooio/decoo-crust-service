import * as Router from 'koa-router'
import createKeyring from '../services/crust/krp'
import { getOrderState, placeOrder, transfer } from '../services/crust/order'
import { api } from '../services/crust/api'
import { blockInfo, getAccountBalance } from '../services/crust/info'
import { addressFromSeed, create } from '../services/crust/account'
import { successResponse } from '../helpers/response'
const router = new Router()
router.get('/order/:cid', async (ctx, next) => {
  try {
    const cid = ctx.params.cid
    const { meaningfulData } = await getOrderState(api, cid)
    successResponse(ctx, meaningfulData)
  } catch (e) {
    throw new Error(e)
  }
})
interface OrderInfo {
  fileCid: string,
  fileSize: number,
  seeds: string
}
router.post('/order', async (ctx, next) => {
  try {
    const { fileCid, fileSize, seeds } = ctx.request.body as OrderInfo
    const krp = createKeyring(seeds)
    const res = await placeOrder(api, krp, fileCid, fileSize, 0)
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

export default router.routes()
