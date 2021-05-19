import * as Router from 'koa-router'
import createKeyring from '../services/crust/krp'
import { getOrderState, placeOrder } from '../services/crust/order'
import { api } from '../services/crust/api'
import { getAccountBalance } from '../services/crust/info'
const router = new Router()
router.get('/order/:cid', async (ctx, next) => {
  try {
    const cid = ctx.params.cid
    const { meaningfulData } = await getOrderState(api, cid)
    ctx.body = {
      code: 1,
      data: meaningfulData,
      error_msg: null
    }
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
    ctx.body = {
      code: 1,
      error_msg: null,
      data: res
    }
  } catch (e) {
    throw new Error(e)
  }
})

router.get('/balance/:id', async (ctx, next) => {
  try {
    const account = ctx.params.id
    const free = await getAccountBalance(api, account)
    ctx.body = {
      code: 1,
      error_msg: null,
      data: {
        free,
        account
      }
    }
  } catch (e) {
    throw new Error(e)
  }
})

export default router.routes()
