const redis = require('redis');

const { redis_conf } = require('../config/db');

// 创建客户端
const redisClient = redis.createClient(redis_conf.port, redis_conf.host)
redisClient.on('error', err => {
  console.error(err)
})

// 将redis的get和set包装一下。
function setRedis (key, val) {
  if (typeof val === 'object') {      // val只允许是字符串格式
    val = JSON.stringify(val)
  }
  redisClient.set(key, val, redis.print)
}

// get其实是异步的，所以使用promise将其封装。
function getRedis (key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err)
        return
      }
      // 如果没有返回值，val就是null，这个时候正常返回null。。。。但我感觉写法是多余
      if (val == null) {
        resolve(null)
        return
      }

      // val如果是一个json格式，就转为对象。但不是就会报错，所以要是试错处理
      // 注意这个用法。catch并不只是为了捕获错误而存在，它本质是为了处理正常情况。关键在于try是为了试错。
      try {
        resolve(JSON.parse(val))
      } catch (error) {
        resolve(val)
      }
      // 退出
      // redisClient.quit()     // 这不再需要退出，因为redisClient是一个单例，一旦退出，其他时候访问他就不存在了
    })
  })
}


module.exports = {
  getRedis,
  setRedis
}