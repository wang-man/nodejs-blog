var express = require('express');
var router = express.Router();
const { SuccessModel, FailModel } = require('../model/resModel')
const { getList, getDetail, creatNewBlog, updateBlog, deleteBlog } = require('../controller/blog');
const checkLogin = require('../middleware/checkLogin')


router.get('/list', function (req, res, next) {
  const author = req.query.author || '';
  const keyword = req.query.keyword || '';
  console.log(123)
  // 返回接口结果
  getList(author, keyword).then(listData => {
    res.json(new SuccessModel(listData, '成功'));
  })
});

router.post('/new', checkLogin, function (req, res, next) {
  // 返回接口结果
  let blogData = req.body;
  blogData.author = req.session.username;
  if (!blogData.title || !blogData.content) {
    // 没有查询参数时候返回错误状态。因为app.js中默认接受promise，所以这里同样要返回一个promise
    res.json(new FailModel('缺少标题或内容'));
  } else {
    creatNewBlog(blogData).then(insertData => {
      res.json(new SuccessModel({ id: insertData.insertId }, '新建成功'));   // 用id查询到的返回的是一条博客，仍然是一个数组，所以直接取里面的数据
    })
  }
});

module.exports = router;
