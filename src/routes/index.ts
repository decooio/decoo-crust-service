import * as Router from 'koa-router'
import createKeyring from '../services/crust/krp'
import { placeOrder } from '../services/crust/order'
import { api } from '../services/crust/api'
const router = new Router()
router.get('/order/:cid', (ctx, next) => {
  const cid = ctx.params.cid
  ctx.body = {
    cid
  }
})
interface OrderInfo {
  fileCid: string,
  fileSize: number,
  seeds: string
}
router.post('/order', async (ctx, next) => {
  try {
    console.log(ctx.request.body)
    const { fileCid, fileSize, seeds } = ctx.request.body as OrderInfo
    console.log({ fileCid, fileSize, seeds })
    const krp = createKeyring(seeds)
    const res = await placeOrder(api, krp, fileCid, fileSize, 0)
    console.log(res)
    ctx.body = {
      code: 0,
      error_msg: null
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      code: 1,
      error_msg: 'error while'
    }
  }
})

export default router.routes()
