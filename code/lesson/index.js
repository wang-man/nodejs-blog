const http = require('http')
const qs = require('querystring')

// const server = http.createServer((req, res) => {
//   res.writeHead(200, { 'content-type': 'text/html' })
//   console.log(req.url)
//   const query = req.url.split('?')[1];
//   console.log(qs.parse(query))
//   res.end('<h1>hello world</h1>');
// })

const server = http.createServer((req, res) => {
  if (req.method = 'POST') {
    console.log('req格式：' + req.headers['content-type']);

    let postData = '';
    req.on('data', chunk => {
      postData += chunk.toString();
    })

    req.on('end', () => {
      console.log('postData:' + postData)
      res.end('hello')
    })
  }
})

server.listen(3000, () => {
  console.log('服务启动，监听在3000端口')
})