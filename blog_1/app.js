const blogRouter = require('./src/router/blog');
const userRouter = require('./src/router/user');
const { accessLog } = require('./src/utils/log');
const qs = require('querystring');
// 处理post请求数据，作为一个promise使用
const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    if (req.method !== 'POST') {          // 如果不是post请求，就返回空对象
      resolve({});                        // 这里并不reject，而是传一个空对象，可以继续回调保证get请求正常。POST这里返回的值放在req.body,GET则是放在req.query中
      return;
    }
    // if (req.headers['content-type'] !== 'application/json') {
    //   resolve({});                       // 同样这里并不reject，而是传一个空对象，可以继续回调保证get请求正常
    //   return;
    // }
    let postData = '';
    req.on('data', thunk => {     // post请求的这个‘data’过程可能是分多次进行的
      postData += thunk.toString();
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      console.log('postData')
      console.log(qs.parse(postData))
      resolve(qs.parse(postData))
    })
  })
}

function clone (target) {
  if (typeof target === 'object') {
    var obj = Array.isArray(target) ? [] : {};
    for (const key in target) {
      obj[key] = clone(object[key]);
    }
    return obj;
  } else {
    return target
  }
}


// 设置全局变量，SESSION_DATA用来存储所有session信息。一个session就是一个SESSION_DATA[userId]
const SESSION_DATA = {};
// 输出，将作为服务器的回调函数使用
module.exports = serverHandle = (req, res) => {
  res.writeHead(200, { 'content-type': 'application/json' });

  req.cookie = {}, req.session = {};
  // 解析cookie，客户端每次请求都会携带cookie，并且放在headers中
  req.headers.cookie && req.headers.cookie.split(';').forEach(function (Cookie) {
    var parts = Cookie.split('=');
    // 解析为json格式
    req.cookie[parts[0].trim()] = (parts[1] || '').trim();
  });

  // 写access日志
  accessLog(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)


  let userId = req.cookie.userid;   // 获取cookie中的userid，userId的作用————作为SESSION_DATA的键
  // console.log('SESSION_DATA----app.js----')
  // console.log(SESSION_DATA)
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {};
    }
  } else {
    userId = `${+new Date()}_${Math.random()}`;      // 设置初始的userId，每个userId都不相同
    req.cookie.userid = userId;
    SESSION_DATA[userId] = {};
  }
  // 最关键的一句。。。。。。这里req.session为空对象，并且它的用途是在login接口被赋值，然后在login-test接口使用，在app.js中并不会被用到，那为什么要将SESSION_DATA[userId]给到它呢？？？？
  // 原因是，这个赋值操作目的目的并不是为了赋值，而是req.session形成了对SESSION_DATA[userId]这个对象的引用，在login接口给session赋值同时会赋给SESSION_DATA[userId]，这样SESSION_DATA就存储了登录信息，而不必将它很low的方式传到user.js或blog.js中使用
  req.session = SESSION_DATA[userId];   // 一个userId对应一个session

  getPostData(req).then(postData => {
    req.body = postData;        // postData是调用接口传递的参数，post请求的参数存放在里面，get则是空对象

    // 第一种：处理博客相关请求数据
    const blogResult = blogRouter(req, res);    // blogRouter中会返回对象格式的数据
    if (blogResult) {
      blogResult.then(blogData => {
        res.end(JSON.stringify(blogData))
      })
      return
    }

    // 第二种：处理用户相关请求数据
    const userResult = userRouter(req, res);
    if (userResult) {
      userResult.then(userData => {
        res.end(JSON.stringify(userData))
      })
      return
    }

    // 第三种情况：接口地址错误，返回404
    res.writeHead(404, { 'Content-type': 'text/plain' });
    res.end('404 Not Found\n');

  })
} 