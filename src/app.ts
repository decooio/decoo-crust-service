import * as Koa from 'koa'
import * as koaBodyparser from 'koa-bodyparser'

import routes from './routes'
import { logger } from './logger'

const app = new Koa()
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = {
      error: err.message,
      code: -1
    }
    ctx.app.emit('error', err, ctx)
  }
})
app.use(koaBodyparser())
app.use(routes)

app.on('error', (err, ctx) => {
  logger.error(err.message)
})

app.listen(3000, () => { console.log('listening at 3000') })
