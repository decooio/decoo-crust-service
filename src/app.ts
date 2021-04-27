require('dotenv').config()
import * as Koa from 'koa'
import routes from './routes'

const app = new Koa()
app.use(routes)
console.log(process.env.PORT);
app.listen(process.env.PORT || 3000, () => { console.log('listening 3333') })
