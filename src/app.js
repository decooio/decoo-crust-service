"use strict";
exports.__esModule = true;
var koa_1 = require("koa");
var routes_1 = require("./routes");
var app = new koa_1["default"]();
app.use(routes_1["default"]);
app.listen(3333, function () { console.log('listening 3333'); });
