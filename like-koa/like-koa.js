const http = require('http')

// 将中间件函数组合
function compose (middlewareList) {
  return function (ctx) {
    function dispatch (i) {
      const fn = middlewareList[i];   // 这个fn就是app.use()里面的中间件函数
      console.log(fn)
      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));  // 使用promise将fn包裹一次————因为app.use()括号中的fn并不一定是异步函数，根据洋葱模型，前一个中间件内部会使用await next()来执行下一个中间件，即这里的fn，所以这里将中间件fn包裹为promise函数，都不会出现问题了。
      } catch (error) {
        return Promise.reject(error);
      }
    }
    dispatch(0)
  }
}

class LikeKoa {
  constructor() {
    this.middlewareList = []
  }
  // 这个use就是app.use()的use
  use (fn) {
    this.middlewareList.push(fn);   // 执行一次app.use()就将use里的中间件函数插入列表里
    return this;    // 返回this是为了use可以链式调用。实际上在koa使用use时很少链式调用
  }

  listen (...arg) {
    const server = http.createServer(this.callback())
    server.listen(...arg)
  }

  createContext (req, res) {
    const ctx = {
      req,
      res
    }
    ctx.query = req.query;    // koa中的ctx就是结合了req和res的方法。
    ctx.request = req;
    return ctx;
  }

  callback () {
    const fn = compose(this.middlewareList);  // fn是一个内部将返回promise函数的函数
    // 这里返回给httpServer，和原生node一样的
    return (req, res) => {
      const ctx = this.createContext(req, res)
      return fn(ctx);                         // 执行fn()，得到中间件函数，然后返回中间件函数
    }
  }
}

module.exports = LikeKoa