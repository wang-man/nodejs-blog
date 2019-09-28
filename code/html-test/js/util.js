var utils = {
  getDate: function (time) {
    var d = new Date(time);
    var year = d.getFullYear(),
      month = d.getMonth() + 1,
      date = d.getDate(),
      hour = d.getHours() > 10 ? d.getHours() : '0' + d.getHours(),
      minutes = d.getMinutes() > 10 ? d.getMinutes() : '0' + d.getMinutes(),
      seconds = d.getSeconds() > 10 ? d.getSeconds() : '0' + d.getSeconds();
    return year + '年' + month + '月' + date + '日' + ' ' + hour + ':' + minutes + ':' + seconds;

  },
  getUrlParam: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURIComponent(r[2]);
    return null;
  }
}