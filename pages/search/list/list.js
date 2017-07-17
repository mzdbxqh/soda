var jsUtil = require("../../../utils/util.js")
var imageUtil = require("../../../utils/image.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagId:"",
    tagName:"",
    pageNo:0,
    pageCount:0,
    pictureList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      tagId:options.tagId,
      tagName:options.tagName
    })
    if(!options.tagId){
      that.setData({
        tagId: "e9cc77eb218c401d984d17da0a31d96f",
        tagName: "新海诚"
      })
    }
    wx.setNavigationBarTitle({
      title: that.data.tagName
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.loadPic()
  },

  loadPic: function() {
    var that = this
    var currentPageNo = that.data.pageNo
    var pageNo
    if (currentPageNo == 0) {
      pageNo = 1
    } else if (currentPageNo > 0 && currentPageNo < that.data.pageCount){
      pageNo = currentPageNo + 1
    } else {
      jsUtil.formErrTip({
        title:"已经没有更多图片了"
      })
      return
    }

    jsUtil.authedRequest({
      url: app.picListByFixTagUrl,
      method: "POST",
      data: {
        "tagId": that.data.tagId,
        "pageNo":pageNo
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
          pageNo:data.pageNo,
          pageCount:data.pageCount
        })

        if (!that.data.pictureList || that.data.pictureList.length ===0){
          jsUtil.formErrTip({
            title: "抱歉，尚未收集该番的壁纸",
            duration: 1500,
            callback: function(){
              wx.navigateTo({
                url: '/pages/search/press/press?tagName=' + that.data.tagName,
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
   * 分享方法
   */
  onShareAppMessage: function () {
    var that = this
    return jsUtil.doShare({
      title: '分享一些关于「' + that.data.tagName + '」的壁纸',
      path: '/pages/search/list/list?tagId=' + that.data.tagId + '&tagName=' + that.data.tagName,
      page: "list"
    })
  },
})