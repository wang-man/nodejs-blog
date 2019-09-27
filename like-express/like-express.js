const http = require('http');
const slice = Array.prototype.slice;   // 借用数组的slice方法，将用在arguments上

class LikeExpress {
  constructor() {
    this.routes = {
      all: [],      // 存放use路由及中间件函数
      get: [],      // 存放get路由及中间件函数
      post: []      // 存放post路由及中间件函数
    }
  }
  register (path) {
    const info = {};
    if (typeof path === 'string') {
      info.path = path;
      // 后面的参数就是中间件函数
      info.middleware = slice.call(arguments, 1); // arguments本身为一个类数组对象，使用slice.call拿取内部数组项
    } else {
      info.path = '/';
      // 省略了路由的。全部都是中间件函数，比如，app.use(function(){}, function(){})
      info.middleware = slice.call(arguments, 0);
    }
    return info;      // {path: '/api/test', middleware: [fnc, fnc2]}
  }
  use () {
    // 下面为错误用法。。。。。
    // const info = this.register(arguments);
    const info = this.register.apply({}, arguments);    // 使用apply，this.register代码的执行环境放在use内，那么arguments就直接代替了this.register内部的arguments，从而不会被会被register函数作为参数再包装一次
    this.routes.all.push(info);
  }
  get () {
    const info = this.register.apply(this, arguments);
    this.routes.get.push(info);
  }
  post () {
    const info = this.register.apply(this, arguments);
    this.routes.post.push(info);
  }
  serverHandle () {
    // 这里必须得返回一个箭头函数给到createServer()，否则此class内部this将变换
    return (req, res) => {
      // 如果路由请求中要执行res.json，就像前端返回数据
      res.json = (data) => {
        res.setHeader('Content-type', 'application/json');
        res.end(JSON.stringify(data))
      }
      const method = req.method.toLowerCase();
      const url = req.url;

      let middlewareList = [];      // 收集一个请求下将可能命中的所有路由
      if (url === '/favicon.ico') {   // 如果是图标的请求，则直接返回空数组
        return middlewareList;
      }

      // 获取routes
      let curRoutes = [];
      // console.log('this.routes------------')
      // console.log(this.routes)
      curRoutes = curRoutes.concat(this.routes.all);    // all里面是use请求参数，不管是get还是post都会匹配到
      curRoutes = curRoutes.concat(this.routes[method]);
      curRoutes.forEach(route => {
        // app.use('/api/blog') 可匹配 app.use('/')
        // app.use('/api/blog') 可匹配 app.use('/api')
        // app.use('/api/blog') 可匹配 app.use('/api/blog')
        if (url.indexOf(route.path) === 0) {
          middlewareList = middlewareList.concat(route.middleware)
        }
      })
      const next = () => {
        // console.log('middlewareList-----------')
        // console.log(middlewareList)
        const firstMiddleware = middlewareList.shift();   // 截取第一个中间件(middlewareList会逐渐减少)
        if (firstMiddleware) {
          firstMiddleware(req, res, next);    // 关键的一步，将next函数传入继续执行，形成递归调用
        }
      }
      next();
    }
  }
  listen (...arg) {
    const server = http.createServer(this.serverHandle());
    server.listen(...arg)
  }
}
module.exports = () => {
  return new LikeExpress();
}
