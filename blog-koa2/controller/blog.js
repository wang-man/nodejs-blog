//此文件将对接数据库，定义SQL语句，对库增删改查，接口返回结果。

const { exec } = require('../mysql')
// 博客列表
const getList = async (author, keyword) => {
  let sql = `select * from blogs where 1=1`; // where 1=1总为true，能避免后面错误拼接。
  if (author) {
    sql += ` and author='${author}'`;
    console.log(sql)
  }

  if (keyword) {
    sql += ` and keyword='%${keyword}%'`;
    sql += ' order by createtime desc';
  }

  // 仍然返回exec这个promise供外部使用
  return await exec(sql)

}

// 打开博客详情
const getDetail = async (id) => {
  let sql = `select * from blogs where 1=1`; // where 1=1总为true，能避免后面错误拼接。
  if (id) {
    sql += ` and id='${id}'`;
    console.log(sql)
  }
  // 仍然返回exec这个promise供外部使用
  return await exec(sql)
}

// 新建博客
const creatNewBlog = async (blogData = {}) => {
  let title = blogData.title,
    content = blogData.content,
    createTime = + new Date(),
    author = blogData.author

  let sql = `insert into blogs (title,content,createTime,author) values ('${title}','${content}',${createTime},'${author}')`;

  // 仍然返回exec这个promise供外部使用
  return await exec(sql)
}

// 更新博客
const updateBlog = async (blogData = {}) => {
  let title = blogData.title,
    content = blogData.content,
    id = blogData.id,
    author = blogData.author

  let sql = `update blogs set title='${title}', content='${content}' where author='${author}' and id=${id}`;
  // 仍然返回exec这个promise供外部使用
  return await exec(sql)
}

// 删除博客
const deleteBlog = async (blogData) => {
  let author = blogData.author       // 登录后才是真实数据,auther代表是当前作者，保障安全性
  let id = blogData.id       // 登录后才是真实数据,auther代表是当前作者，保障安全性
  let sql = `delete from blogs where author='${author}' and id=${id}`;
  // 仍然返回exec这个promise供外部使用
  return await exec(sql)
}

module.exports = {
  getList,
  getDetail,
  creatNewBlog,
  updateBlog,
  deleteBlog
}