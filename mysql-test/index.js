const mysql = require('mysql');

// 创建连接对象
const connection = mysql.createConnection({
  host: 'localhost',      // 本地开发
  user: 'root',           // 安装mysql时设置的名字
  password: '123456',     // 安装mysql时的密码，一定要正确
  port: '3306',           // 默认的3306
  database: 'myblog'      // 要连接的库名
})

// 开始连接
connection.connect();

// 执行SQL语句
// const sql = `update users set username='kit' where username='lion2'`;
// const sql = `insert into users (username, password, realname, state) values ('mike', '456', '麦克', 1)`;
const sql = `select * from users`;
// const sql = `delete from users where username='zhangsan'`;

connection.query(sql, (err, res) => {
  if (err) {
    console.error(err)
  } else {
    console.log(res)
  }
})

// 关闭连接
connection.end();