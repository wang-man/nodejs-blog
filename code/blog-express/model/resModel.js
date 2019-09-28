// 此文件处理接口数据的拼装。属于业内通用。
class BaseModel {
  constructor(data, message) {
    if (typeof data === 'string') {     // 通常data返回为字符串，那么可能放置为错误原因，于是直接给到message
      this.message = data;
      data = null;
      message = null;
    }
    if (data) {
      this.data = data
    }
    if (message) {
      this.message = message
    }
  }
}

class SuccessModel extends BaseModel {
  constructor(data, message) {
    super(data, message)
    this.result = 1
  }
}

class FailModel extends BaseModel {
  constructor(data, message) {
    super(data, message)
    this.result = 0
  }
}

module.exports = {
  SuccessModel,
  FailModel
}

