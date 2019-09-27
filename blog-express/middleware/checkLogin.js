const { FailModel } = require('../model/resModel')
module.exports = (req, res, next) => {    // 中间件，这三个固定的参数
  if (req.session.username) {
    next();           // 不要忘记执行next();
    return;
  }
  res.json(new FailModel('尚未登录，请先登录'))
}
