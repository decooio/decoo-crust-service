"use strict";
exports.__esModule = true;
var koa_router_1 = require("koa-router");
var router = new koa_router_1["default"]();
router.get('/', function (ctx, next) {
    ctx.body = 'hello world';
});
router.get('/test', function (ctx, next) {
    ctx.body = 'test';
});
exports["default"] = router.routes();
