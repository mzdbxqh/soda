var app = getApp()
var jsUtil = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  callUploader: function(e){
    wx.navigateTo({
      url: '/pages/share/uploader/uploader',
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  /**
   * 分享方法
   */
  onShareAppMessage: function () {
    var that = this
    return jsUtil.doShare({
      page: "share"
    })
  },
})