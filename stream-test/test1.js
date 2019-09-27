// 输入即输出
// process.stdin.pipe(process.stdout)


// const http = require('http')
// const server = http.createServer((req, res) => {
//   if (req.method === 'POST') {
//     req.pipe(res);      // 请求参数输出为响应数据
//   }
// })

// server.listen(8002)

// stream拷贝文件
// const fs = require('fs')
// const path = require('path')

// const fileName1 = path.resolve(__dirname, 'data.txt')
// const fileName2 = path.resolve(__dirname, 'data-pak.txt')

// const readStream = fs.createReadStream(fileName1)
// const writeStream = fs.createWriteStream(fileName2)


// readStream.pipe(writeStream)    // 读取对象数据流入写入对象

// readStream.on('data', chunk => {
//   console.log(chunk.toString())
// })

// readStream.on('end', () => {
//   console.log('拷贝完成')
// })


// 接口中使用stream的概念返回文件流

const fs = require('fs')
const path = require('path')

const fileName1 = path.resolve(__dirname, 'data.txt')
const http = require('http')
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain;charset=UTF8' });
  if (req.method === 'GET') {
    const readStream = fs.createReadStream(fileName1)   // 水桶
    readStream.pipe(res);      // 水桶流入响应数据
  }
})

server.listen(8002)
