//此文件对博客数据接口数据返回，将与数据库联通

const { exec } = require('../mysql');


// 博客列表
const loginCheck = (username, password) => {
  let sql = `select * from users where username='${username}' and password='${password}'`

  return exec(sql);
}

module.exports = {
  loginCheck,
}