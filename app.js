import Koa from 'koa'
import koaRouter from 'koa-router'
import json from 'koa-json'
import logger from 'koa-logger'
import koaBodyparser from 'koa-bodyparser'
import auth from './server/routes/auth.js'
import api from './server/routes/api.js'
import jwt from 'koa-jwt'
import path from 'path'
import serve from 'koa-static'
import historyApiFallback from 'koa2-history-api-fallback'



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

app.use(function *(next){  //  如果JWT验证失败，返回验证失败信息
  try {
    yield next;
  } catch (err) {
    if (401 == err.status) {
      this.status = 401;
      this.body = {
        success: false,
        token: null,
        info: 'Protected resource, use Authorization header to get access'
      };
    } else {
      throw err;
    }
  }
});

app.on('error', function(err, ctx){
  console.log('server error', err);
});

router.use('/auth', auth.routes()) // 挂载到koa-router上，同时会让所有的auth的请求路径前面加上'/auth'的请求路径。
router.use('/api', jwt({secret: 'vue-koa-demo'}), api.routes()) // 所有走/api/打头的请求都需要经过jwt验证。
app.use(router.routes())  // 将路由规则挂载到Koa上。

app.use(historyApiFallback()) // 将这两个中间件挂载在api的路由之后

app.use(serve(path.resolve('dist'))) // 将webpack打包好的项目目录作为Koa静态文件服务的目录


app.listen(9999,() => {
  console.log('Koa is listening in 9999');
});

module.exports = app;
