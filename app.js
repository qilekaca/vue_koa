import Koa from 'koa'
import koaRouter from 'koa-router'
import json from 'koa-json'
import logger from 'koa-logger'
import koaBodyparser from 'koa-bodyparser'

const app = new Koa()
const router = koaRouter()

app.use(koaBodyparser());
app.use(json());
app.use(logger());

app.use(function* (next){
  let start = new Date;
  yield next;
  let ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms); // 显示执行的时间
});

app.on('error', function(err, ctx){
  console.log('server error', err);
});

app.listen(9999,() => {
  console.log('Koa is listening in 9999');
});

module.exports = app;
