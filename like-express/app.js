const express = require('./like-express');
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


app.get('/api/getCookie', (req, res, next) => {
  console.log('第三个处理函数，post请求，路径为----', req.url);
  res.json({
    result: 1,
    data: {
      url: req.url,
      cookie: req.cookie
    }
  })
  // next();
})
app.listen(8000, () => {
  console.log('服务启动成功，端口监听在8000')
})