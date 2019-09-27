// 此文件用于创建mysql连接对象
const mysql = require('mysql');
const { mysql_conf } = require('../config/db')

// 创建连接对象
const connection = mysql.createConnection(mysql_conf)

// 开始连接
connection.connect();
// exec定义一个查询SQL的promise
function exec (sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

module.exports = { exec };