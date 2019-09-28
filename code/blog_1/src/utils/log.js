const fs = require('fs')
const path = require('path')

// 创建write stream
function createWriteStream (logName) {
  const fileName = path.resolve(__dirname, '../../logs/', logName);
  const writeStream = fs.createWriteStream(fileName, {
    flags: 'a'    // 插入的方式，而不是覆盖以前的日志
  });
  return writeStream;
}

/*创建写日志方法函数
  log type:string 写入的日志字符
*/
function accessLog (log) {
  const writeStream = createWriteStream('access.log');
  writeStream.write(log + '\n')
}

module.exports = {
  accessLog
}