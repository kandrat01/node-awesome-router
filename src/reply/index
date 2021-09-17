
class Reply {
  /**
   *
   * @param errorCode | 0 if there is no error, positive number if there are errors
   * @param message
   * @param data
   */
  constructor (errorCode, message, data = {}) {
    this.errorCode = errorCode
    this.message = message
    this.data = data
  }

  get json () {
    return JSON.stringify({
      errorCode: this.errorCode,
      message: this.message,
      data: this.data
    })
  }
}
module.exports = Reply