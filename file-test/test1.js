const fs = require('fs');   // fs模块为nodejs自带模块，用于读取文件
const path = require('path'); // path也是nodejs自带模块，用于查找文件路径

const fileName = path.resolve(__dirname, 'log/logo.txt1');
console.log(fileName)
// 读文件
fs.readFile(fileName, (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  // 文件读取后是一个buffer的二进制字符，需要转换为正常字符串才能还原。
  console.log(data.toString())
})

// 写入文件

const content = '这是一条新日志\n',
  option = {
    flag: 'a'     // option是写文件必带的参数，a代表append，插入，w代表write，会覆盖已有内容
  }

// writeFile有个毛病就是，当fileName读取的文件不存在，它会自动创建这个名字的文件并写入内容
fs.writeFile(fileName, content, option, err => {
  if (err) {
    console.error(err)
  } else {
    console.log('写入文件成功')
  }
})