// createlog.js
var jsUtil = require("../../../utils/util.js")
var imageUtil = require("../../../utils/image.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 0,
    pageCount: 0,
    pictureList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.loadPic()
  },

  /**
   * 加载图片列表（含翻页）
   */
  loadPic: function () {
    var that = this
    var currentPageNo = that.data.pageNo
    var pageNo
    if (currentPageNo == 0) {
      pageNo = 1
    } else if (currentPageNo > 0 && currentPageNo < that.data.pageCount) {
      pageNo = currentPageNo + 1
    } else {
      jsUtil.formErrTip({
        title: "已经没有更多图片了"
      })
      return
    }
    jsUtil.authedRequest({
      url: app.picCreateListUrl,
      method: "POST",
      data: {
        "pageNo": pageNo
      },
      success: function (data) {
        var newList = new Array()
        for (var i = 0; i < data.list.length; i++) {
          var imageSize = imageUtil.smallImageFixer(data.list[i]);
          newList[i] = {
            src: app.picServerUrl + data.list[i].filePath + data.list[i].fileName + "!400",
            width: imageSize.imageWidth,
            height: imageSize.imageHeight,
            id: data.list[i].id
          }
        }
        var oldList = that.data.pictureList
        var list = oldList.concat(newList)
        that.setData({
          pictureList: list,
          pageNo: data.pageNo,
          pageCount: data.pageCount
        })
        if (list.length === 0) {
          jsUtil.formSuccessTip({
            title: "还未发布过壁纸...来一张?",
            duration: 3000,
            callback: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      }
    })
    
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadPic()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})