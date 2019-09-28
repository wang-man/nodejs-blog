const router = require('koa-router')()
const { SuccessModel, FailModel } = require('../model/resModel')
const { loginCheck, } = require('../controller/user');

router.prefix('/api/user')       // 相当于给下面两个接口加上的前缀/api/user/login

router.post('/login', async function (ctx, next) {
  const username = ctx.request.body.username || '';
  const password = ctx.request.body.password || '';
  if (!username || !password) {
    ctx.body = new FailModel('缺少用户名或密码');
  } else {
    const loginResult = await loginCheck(username, password);
    const result = loginResult[0] || {};   //result拿到的是一个数组，我们实际需要的是一个对象
    if (result.username) {
      // 给客户端种下cookie
      ctx.session.username = username;
      ctx.session.password = password;
      ctx.body = new SuccessModel(result, '登录成功');   // 用id查询到的返回的是一条博客，仍然是一个数组，所以直接取里面的数据
    } else {
      ctx.body = new FailModel('用户名或密码错误');
    }
  }
})

router.get('/session-test', async function (ctx, next) {
  if (ctx.session.viewCount == null) {      // ctx.session拿到session
    ctx.session.viewCount = 0;
  }
  ctx.session.viewCount++;
  ctx.body = {
    result: 0,
    viewCount: ctx.session.viewCount
  }
})

module.exports = router
