const { FailModel } = require('../model/resModel')
module.exports = async (ctx, next) => {    // 中间件，这三个固定的参数
  if (ctx.session.username) {
    await next();           // 不要忘记执行next();
    return;
  }
  ctx.body = new FailModel('尚未登录，请先登录');
}
