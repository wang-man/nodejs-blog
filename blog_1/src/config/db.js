// 此文件是关于在不同环境下建立mysql的连接时候的配置
// 开发环境和生产环境下的配置肯定是不同的，所以不能写死，而是通过环境变量来区分

const env = process.env.NODE_ENV     // 环境变量。来自pakage.json中scripts

let mysql_conf = {}
let redis_conf = {}

// 开发环境下的连接mysql的配置
if (env === 'dev') {
  mysql_conf = {
    host: 'localhost',      // 本地开发
    user: 'root',           // 安装mysql时设置的名字
    password: '123456',     // 安装mysql时的密码，一定要正确
    port: '3306',           // 默认的3306
    database: 'myblog'      // 要连接的库名
  }

  redis_conf = {
    port: 6379,
    host: '127.0.0.1'
  }
}

// 生产环境下的连接mysql的配置
if (env === 'production') {
  mysql_conf = {
    host: 'xxx',      // 本地开发
    user: 'xxx',           // 安装mysql时设置的名字
    password: 'xxx',     // 安装mysql时的密码，一定要正确
    port: 'xxx',           // 默认的3306
    database: 'xxx'      // 要连接的库名
  }

  redis_conf = {
    port: 000,
    host: 'xxx.xx.xx.xx'
  }
}
module.exports = {
  mysql_conf,
  redis_conf
}