import * as Koa from 'koa'
import routes from './routes'
require('dotenv').config()

const app = new Koa()
app.use(routes)
console.log(process.env.PORT)
app.listen(process.env.PORT || 3000, () => { console.log(`listening at ${process.env.PORT || 3000}`) })
