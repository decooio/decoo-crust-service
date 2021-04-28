import * as Router from 'koa-router'

const router = new Router()
router.get('/hello', (ctx, next) => {
  // ctx.body = 'hello world'
  ctx.body = 'sdsdsds'
})
router.post('/order', (ctx, next) => {
  ctx.body = ''
})

export default router.routes()
