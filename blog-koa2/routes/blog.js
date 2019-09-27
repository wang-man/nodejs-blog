const router = require('koa-router')()
const { SuccessModel, FailModel } = require('../model/resModel')
const { getList, getDetail, creatNewBlog, updateBlog, deleteBlog } = require('../controller/blog');
const checkLogin = require('../middleware/checkLogin')


router.prefix('/api/blog')       // 相当于给下面两个接口加上的前缀/api/user/login

router.get('/list', async function (ctx, next) {
  const author = ctx.query.author || '';
  const keyword = ctx.query.keyword || '';
  // 返回接口结果
  const listData = await getList(author, keyword);
  ctx.body = new SuccessModel(listData, '成功');
})

router.post('/new', checkLogin, async function (ctx, next) {
  // 返回接口结果
  let blogData = ctx.request.body;
  blogData.author = ctx.session.username;
  if (!blogData.title || !blogData.content) {
    // 没有查询参数时候返回错误状态。因为app.js中默认接受promise，所以这里同样要返回一个promise
    ctx.body = new FailModel('缺少标题或内容');
  } else {
    const insertData = await creatNewBlog(blogData);
    ctx.body = new SuccessModel({ id: insertData.insertId }, '新建成功');
  }
})

module.exports = router
