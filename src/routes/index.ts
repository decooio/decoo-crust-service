import * as Router from 'koa-router'
import createKeyring from '../services/crust/krp'
import { getOrderState, placeOrder } from '../services/crust/order'
import { api } from '../services/crust/api'
const router = new Router()
router.get('/order/:cid', async (ctx, next) => {
  try {
    const cid = ctx.params.cid
    const res = await getOrderState(api, cid)
    ctx.body = {
      code: 1,
      data: res,
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

export default router.routes()
