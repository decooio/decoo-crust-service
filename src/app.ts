import * as Koa from 'koa'
import routes from './routes'
const app = new Koa()
app.use(routes)

app.listen(3333, () => { console.log('listening 3333') })
