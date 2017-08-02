var app = getApp()
var jsUtil = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picCount:0,
    tagCount:0,
    editorList:[],
    hidden:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    jsUtil.authedRequest({
      url: app.editorAbstractUrl,
      method: "GET",
      success: function (res) {
        if (res && res.result == 0){
          var list = []
          for(var i = 0; i < res.data.list.length; i++){
            res.data.list[i]["hidden"] = true
          }
          that.setData({
            picCount: res.data.picCount,
            tagCount: res.data.tagCount,
            editorList: res.data.list
          })
        }
      }
    })
  },

  /**
   * 页面跳转
   */
  joinUs: function(){
    wx.navigateTo({
      url: '/pages/share/join/join',
    })
  },

  /**
   * 切换显示情况
   */
  toggleMemberTip: function(options) {
    var that = this
    var list = that.data.editorList
    var index = options.currentTarget.id
    for(var i = 0;i <= list.length;i++){
      if(i == index){
        var isHidden = list[i]["hidden"]
        list[i]["hidden"] = isHidden ? false : true
      }
    }
    that.setData({
      editorList: list
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