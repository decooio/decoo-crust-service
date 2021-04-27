import * as Router from 'koa-router'

const router = new Router()
router.get('/', (ctx, next) => {
  ctx.body = 'hello world'
})
router.get('/test', (ctx, next) => {
  ctx.body = 'test'
})

export default router.routes()
