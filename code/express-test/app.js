const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log('请求开始，req一些参数为---', req.method, req.url)
  next();
})

app.use((req, res, next) => {
  console.log('第二个处理函数，设置cookie');
  req.cookie = {
    userId: 'abc123'
  }
  next();
})

app.use((req, res, next) => {
  console.log('第三个处理函数，模拟异步请求');
  setTimeout(() => {
    req.body = {
      a: 100,
      b: 200
    }
    next();
  })
})

app.use('/api', (req, res, next) => {
  console.log('第四个处理函数，use请求，根路径为/api');
  next();
})

app.get('/api', (req, res, next) => {
  console.log('第五个处理函数，get请求，根路径为/api');
  next();
})

app.get('/api/getCookie', (req, res, next) => {
  console.log('第六个处理函数，get请求，路径为----', req.url);
  res.json({
    result: 1,
    data: {
      url: req.url,
      cookie: req.cookie
    }
  })
  next();
})

app.post('/api', (req, res, next) => {
  console.log('第七个处理函数，post请求，路径为----', req.url);
  next();
})
app.post('/api/getCookie', (req, res, next) => {
  console.log('第八个处理函数，post请求，路径为----', req.url);
  res.json({
    result: 1,
    data: {
      url: req.url,
      cookie: req.body
    }
  })
  // next();
})

app.use((req, res, next) => {
  console.log('404');
  res.send('404')
})

app.listen(8000, () => {
  console.log('服务启动成功，端口监听在8000')
})