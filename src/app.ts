import * as Koa from 'koa'
import * as koaBodyparser from 'koa-bodyparser'

import routes from './routes'

const app = new Koa()
app.use(koaBodyparser())
app.use(routes)
app.listen(3000, () => { console.log('listening at 3000') })
