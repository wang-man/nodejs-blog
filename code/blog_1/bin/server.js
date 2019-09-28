const http = require("http")
const serverHandle = require('../app.js')

const server = http.createServer(serverHandle);

server.listen('8000', (s) => {
  console.log('服务启动，监听在8000端口')
})