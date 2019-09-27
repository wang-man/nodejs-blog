// 此文件用于定义博客相关api数据接口
const qs = require('querystring');

const { SuccessModel, FailModel } = require('../model/resModel')
const { getList, getDetail, creatNewBlog, updateBlog, deleteBlog } = require('../controller/blog');

// 登录前验证拦截。下面的接口如需要登录的，才可以请求，在请求之前，就使用这个方法来验证
const checkLogin = (req) => {
  if (!req.session.username) {
    return Promise.resolve(new FailModel('尚未登录，请先登录'));  // 有返回，表示未登录
  }
}
const blogRouter = (req, res) => {
  const method = req.method,
    url = req.url,
    path = url.split('?')[0];
  req.query = qs.parse(url.split('?')[1]);      //解析链接中的查询参数，赋给req.query,注意，req无法直接获取参数
  const id = req.query.id || '';              // id代表博客的id，前端携带在url参数中
  // 获取博客列表接口
  if (method === 'GET' && path === '/api/blog/list') {
    const author = req.query.author || '';
    const keyword = req.query.keyword || '';


    // 返回接口结果
    return getList(author, keyword).then(listData => {
      return new SuccessModel(listData, '成功');
    })
  }
  // 获取博客详情接口
  if (method === 'GET' && path === '/api/blog/detail') {
    // 返回接口结果
    if (!id) {
      // 没有查询参数时候返回错误状态。因为app.js中默认接受promise，所以这里同样要返回一个promise
      return Promise.resolve(new FailModel('缺少id'));
    } else {
      return getDetail(id).then(listData => {
        return new SuccessModel(listData[0], '成功');   // 用id查询到的返回的是一条博客，仍然是一个数组，所以直接取里面的数据
      })
    }
  }
  // 新建一篇博客接口
  if (method === 'POST' && path === '/api/blog/new') {
    if (checkLogin(req)) {
      return checkLogin;      // 返回这个promise，注意一定是返回的promise，与下面返回保持一致
    }
    // 返回接口结果
    let blogData = req.body;
    blogData.author = req.session.username;
    if (!blogData.title || !blogData.content) {
      // 没有查询参数时候返回错误状态。因为app.js中默认接受promise，所以这里同样要返回一个promise
      return Promise.resolve(new FailModel('缺少标题或内容'));
    } else {
      return creatNewBlog(blogData).then(insertData => {
        return new SuccessModel({ id: insertData.insertId }, '新建成功');   // 用id查询到的返回的是一条博客，仍然是一个数组，所以直接取里面的数据
      })
    }

  }

  // 更新一篇博客接口
  if (method === 'POST' && path === '/api/blog/update') {
    let checkLoginResult = checkLogin(req);
    if (checkLoginResult) {
      return checkLoginResult;      // 返回这个promise，注意一定是返回的promise，与下面返回保持一致
    }
    // 更新博客与新建博客的区别只在，前者需要该博客的id确保更新的是此篇博客。
    let blogData = req.body;
    blogData.author = req.session.username;
    if (!blogData.id || !blogData.title && !blogData.content) {
      // 没有查询参数时候返回错误状态。因为app.js中默认接受promise，所以这里同样要返回一个promise
      return Promise.resolve(new FailModel('缺少标题或内容'));
    } else {

      return updateBlog(blogData).then(updateData => {
        return new SuccessModel({ affectedRows: updateData.affectedRows }, '更新成功');   // 用id查询到的返回的是一条博客，仍然是一个数组，所以直接取里面的数据
      })
    }
  }

  // 删除一篇博客接口
  // 删除博客，只需要知道该博客id即可
  if (method === 'POST' && path === '/api/blog/delete') {
    let checkLoginResult = checkLogin(req);
    if (checkLoginResult) {
      return checkLoginResult;      // 返回这个promise，注意一定是返回的promise，与下面返回保持一致
    }
    let blogData = req.body;
    blogData.author = req.session.username;
    if (!blogData.id) {
      // 没有查询参数时候返回错误状态。因为app.js中默认接受promise，所以这里同样要返回一个promise
      return Promise.resolve(new FailModel('缺少id'));
    } else {
      return deleteBlog(blogData).then(delData => {
        console.log(delData)
        if (delData.affectedRows == 1) {

          return new SuccessModel({ affectedRows: delData.affectedRows }, '删除成功');   // 用id查询到的返回的是一条博客，仍然是一个数组，所以直接取里面的数据
        } else {
          return new SuccessModel({ affectedRows: delData.affectedRows }, '删除失败');   // 用id查询到的返回的是一条博客，仍然是一个数组，所以直接取里面的数据

        }
      })
    }
  }
}

module.exports = blogRouter;