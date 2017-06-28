// press.js
var app = getApp()
var jsUtil = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      tagName: options.tagName
    })
    if(options.tagName == null){
      that.setData({
        tagName: "测试用标签名"
      })
    }
  },

  /**
   * 催更事件
   */
  callPress: function () {
    var that = this
    var postData = {
      content: "#催更#:" + that.data.tagName
    }
    jsUtil.authedRequest({
      url: app.feedbackUrl,
      data: postData,
      success: function (data) {
        jsUtil.formSuccessTip({
          title: "催更成功，请过段时间再回来",
          duration: 2500,
          callback: function () {
            wx.navigateBack({
              delta: 1
            })
          }
        })
        if (data !== "success") {
          jsUtil.formSuccessTip({
            title: "提交失败，可能服务器出问题了",
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})