/**
 * 通用JS工具包
 * 1、上传下载登录方法
 * 2、表单提示
 * 3、文本格式化
 */
var app = getApp()
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 读写sessionID
 */
function setSessionId(sessionId){
  if(getSessionId() !== sessionId){
      wx.setStorageSync('jeeSiteSessionId', sessionId)
  }
}
function getSessionId(){
  return wx.getStorageSync('jeeSiteSessionId')
}

/**
 * 完成一个完整的登录行为
 * 完成后更新sessionID，并调用回调函数
 */
function login(callBack){
  wx.login({
    success: function(res) {
      if (res.code) {
        //获得用户信息
        wx.getUserInfo({
          withCredentials:true,
          success: function(res2) {
            var header = {
              'content-type': 'application/x-www-form-urlencoded',
              'isWechat': '1'
            }
            // 上报用户数据
            wx.request({
              url: app.serverUrl + "wechatLogin",
              data: {
                "userinfo":res2.userInfo,
                "encryptedData":res2.encryptedData,
                "iv":res2.iv,
                "code":res.code
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: header,
              success: function(res3){
                if(res3.data.jeeSiteSessionId){
                  setSessionId(res3.data.jeeSiteSessionId) //每次都更新sessionId
                }
                callBack()
              },
              fail: function(res) {
                // fail
              },
              complete: function(res) {
                // complete
              }
            })
          },
          fail:function(res){
            wx.navigateTo({
              url: '/pages/error/error',
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
            console.log(res)
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });
}

//封装网络请求方法(每次都带上sessionId)
function authedRequest({url, data, success, fail, complete, method = "POST"}) {
  var time = 1
  var cookieStr = ""
  var header = {}
  url = app.serverUrl + url
  var callback = function(){
    
    var jeeSiteSessionId = getSessionId()
    cookieStr = "jeesite.session.id=" + jeeSiteSessionId
    header = {
      'content-type': 'application/x-www-form-urlencoded',
      'isWechat': '1',
      'Cookie': cookieStr
    }

    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: res => {
        var data = res.data
        if (res['statusCode'] === 200) {
          success(data)
        } else if (res['statusCode'] === 401) {
          if (time === 1) {
            login(callback)
            time++
          }
        } else if (res['statusCode'] === 417) {
          console.log("登录失败")
          fail(data)
        }
      },
      complete: complete
    })
  }
  callback()
}

//封装上传方法(每次都带上sessionId)
function authedUploader({url, filePath,formData={},success,fail,complete}){
  var time = 1
  var cookieStr = ""
  var header = {}
  url = app.serverUrl + url
  var callback = function(){
    
    var jeeSiteSessionId = getSessionId()
    cookieStr = "jeesite.session.id=" + jeeSiteSessionId
    header = {
      'content-type': 'multipart/form-data',
      'isWechat': '1',
      'Cookie': cookieStr
    }

    wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'file',
      header: header,
      formData: formData,
      success: function (res) {
        var data = res.data
        if (res['statusCode'] === 200) {
          success(data)
        } else if (res['statusCode'] === 401) {
          if (time === 1) {
            login(callback)
            time++
          }
        } else if (res['statusCode'] === 417) {
          console.log("登录失败")
          fail(data)
        } else if (res['statusCode'] === 500) {
          this.formErrTip({
            title: "真是抱歉，服务器恐怕是被撑爆了"
          })
        }
      },
      fail: function (res) {
        console.log("fail:")
        console.log(res)
      },
      complete: function (res) {
        complete(res)
      }
    })
  
  }
  callback()
}

//表单提示
function formErrTip({title,duration = 1500}){
  wx.showToast({
    title: title,
    icon: 'fail',
    duration: duration
  })
}
function formSuccessTip({title,duration = 1500,callback}){
  wx.showToast({
    title: title,
    icon: 'success',
    duration: duration,
    mask:true,
    success:function(){
      // bug解决之前手动延时
      setTimeout(callback,duration)
    }
  })
}
function formLoading({title}){
  wx.showLoading({
    title: title,
    mask: true
  })
}

// 获取用户昵称
function getNickName(){
  wx.getUserInfo({
    success: function (res) {
      return res.userInfo.nickName
    }
  })
  return ""
}


module.exports = {
  formatTime: formatTime,
  setSessionId: setSessionId,
  getSessionId: getSessionId,
  login: login,
  authedRequest: authedRequest,
  authedUploader: authedUploader,
  formErrTip: formErrTip,
  formSuccessTip: formSuccessTip,
  formLoading: formLoading,
  getNickName: getNickName
}
