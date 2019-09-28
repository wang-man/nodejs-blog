var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blog');
var userRouter = require('./routes/user');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// 模拟生产环境和开发环境日志的处理
const ENV = process.env.NODE_ENV;
if (ENV === 'dev') {        // 开发/测试环境
  app.use(logger('dev'));   // 没有第二个参数，则是直接打印在控制台
} else if (ENV === 'production') {  // 生产环境
  const logFileName = path.join(__dirname, 'log', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream               // 第二个参数，不再打印在控制台，而是输出到日志文件,
  }));
}


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// 使用express-session，路由中通过req.session获取
// app.use(session({
//   secret: 'sgefds7981',   // 密码，自己制定
//   cookie: {             // 设置cookie
//     path: '/',        // 默认配置，可以不写
//     httpOnly: true,   // 默认配置，可以不写
//     maxAge: 1 * 60 * 60 * 1000,   // 过期时间
//   }
// }))

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in dev
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
