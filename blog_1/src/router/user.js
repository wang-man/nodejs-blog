const qs = require('querystring');

const { SuccessModel, FailModel } = require('../model/resModel')
const { loginCheck, } = require('../controller/user');
const { setRedis, get } = require('../redis')
const setCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 1000 * 1000);    // cookie过期时间
  return d.toGMTString();
}

const userRouter = (req, res) => {
  const method = req.method,
    url = req.url,
    path = url.split('?')[0];
  req.query = qs.parse(url.split('?')[1]);      //解析链接中的查询参数，赋给req.query,注意，req无法直接获取参数
  const id = req.query.id || '';              // id代表博客的id，前端携带在url参数中
  const userId = req.cookie.userid;           // 获取cookie

  // 用户登录接口
  if (method === 'POST' && path === '/api/user/login') {
    const username = req.body.username || '';
    const password = req.body.password || '';
    console.log('req.body')
    console.log(req.body)
    if (!username || !password) {
      return Promise.resolve(new FailModel('缺少用户名或密码'));
    } else {
      return loginCheck(username, password).then(loginResult => {
        const result = loginResult[0] || {};   //result拿到的是一个数组，我们实际需要的是一个对象
        if (result.username) {
          // 给客户端种下cookie
          req.session.username = username;
          req.session.password = password;
          res.writeHead(200, {
            'Set-Cookie': `userid=${userId}; path=/; httpOnly; expires=${setCookieExpires()}`,
            'Content-Type': 'application/json'
          });

          // 同步到Redis
          setRedis('session', req.session);

          return new SuccessModel(result, '登录成功');   // 用id查询到的返回的是一条博客，仍然是一个数组，所以直接取里面的数据
        } else {
          return new FailModel('用户名或密码错误');
        }
      })
    }
  }
  // 请求这个接口，测试是否登录
  // if (method === 'GET' && path === '/api/user/login-test') {
  //   const cookie = req.cookie || {};
  //   if (cookie.userid && req.session.username) {      // cookie过期则req.session.username为空
  //     return Promise.resolve(new SuccessModel(req.session, '登录成功'));
  //   } else {
  //     return Promise.resolve(new FailModel('尚未登录，请先登录'));
  //   }
  // }

}

module.exports = userRouter;