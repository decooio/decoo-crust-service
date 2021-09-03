import { Context } from 'koa'

export const response = (ctx: Context, code: number, data?: any, msg = 'success') => {
  ctx.body = {
    code,
    error_msg: msg,
    data
  }
}

export const successResponse = (ctx: Context, data?: any, code = 1) => {
  response(ctx, code, data, null)
}
