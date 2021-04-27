import * as Router from 'koa-router'

const router = new Router()
router.get('/order:cid', (ctx, next) => {
  // ctx.body = 'hello world'
  ctx.body = ''
})
router.put('/order:cid&', (ctx, next) => {
  ctx.body = ''
})

export default router.routes()
