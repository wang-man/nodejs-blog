var express = require('express');
var router = express.Router();

const { SuccessModel, FailModel } = require('../model/resModel')
const { loginCheck, } = require('../controller/user');

/* GET users listing. */
router.post('/login', function (req, res, next) {
  const username = req.body.username || '';
  const password = req.body.password || '';
  if (!username || !password) {
    res.json(new FailModel('缺少用户名或密码'));
  } else {
    loginCheck(username, password).then(loginResult => {
      const result = loginResult[0] || {};   //result拿到的是一个数组，我们实际需要的是一个对象
      if (result.username) {
        // 给客户端种下cookie
        req.session.username = username;
        req.session.password = password;
        res.json(new SuccessModel(result, '登录成功'));   // 用id查询到的返回的是一条博客，仍然是一个数组，所以直接取里面的数据
      } else {
        res.json(new FailModel('用户名或密码错误'));
      }
    })
  }
});


// 使用express-session后测试接口中是否可拿取session
router.get('/login-test', function (req, res, next) {
  const session = req.session; // express中post请求的参数放在req.body中，原因:app.use(express.json())
  if (!session.username) {
    res.json({                // express使用res.json返回前端json格式数据
      result: 0,
      message: '未登录'
    })
  } else {
    res.json({                // express使用res.json返回前端json格式数据
      result: 1,
      data: session
    })
  }
});

// 使用express-session后测试接口中是否可拿取session
// router.get('/session-test', function (req, res, next) {
//   const session = req.session; // express中post请求的参数放在req.body中，原因:app.use(express.json())
//   console.log('session--------------')
//   console.log(session)
//   if (!session.viewNum) {
//     session.viewNum = 0;
//   }
//   res.json({                // express使用res.json返回前端json格式数据
//     viewNum: session.viewNum++
//   })
// });

module.exports = router;
