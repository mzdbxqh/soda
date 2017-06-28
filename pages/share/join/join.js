var app = getApp()
var jsUtil = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wechatNo:""
  },

  /**
   * 输入内容变动
   */
  inputChange: function (e) {
    this.setData({
      wechatNo: e.detail.value
    })
  },

  /**
   * 执行加组申请
   */
  callJoin: function(){
    var that = this
    if(!that.data.wechatNo){
      jsUtil.formErrTip({
        title:"请填写微信号"
      })
      return
    }
    var postData = {
      content: "#组员申请#:" + that.data.wechatNo
    }
    jsUtil.authedRequest({
      url: app.feedbackUrl,
      data: postData,
      success: function (data) {
        jsUtil.formSuccessTip({
          title: "申请成功，请留意微信好友申请",
          duration: 2500,
          callback: function () {
            wx.navigateBack({
              delta: 1
            })
          }
        })
        if (data !== "success") {
          jsUtil.formSuccessTip({
            title: "申请失败，可能服务器出问题了",
            callback: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      },
      fail: function (e) {

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 分享方法
   */
  onShareAppMessage: function () {
    var that = this
    return app.doShare({
      title: '欢迎加入Soda壁纸作者团',
      path: '/pages/share/join/join'
    })
  },
})