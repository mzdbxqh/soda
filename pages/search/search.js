var jsUtil = require("../../utils/util.js")
var app = getApp()
var t
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    tagList: [],
    updateList: []
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    var that = this
    var getSearchTip = that.getSearchTip
    that.setData({
      inputVal: e.detail.value
    });
    if(t){
      clearTimeout(t)
    }
    t = setTimeout(getSearchTip,200)
  },
  inputConfirm: function(e){
    var that = this
    if (that.data.tagList.length == 0){
      wx.navigateTo({
        url: '/pages/search/press/press?tagName=' + e.detail.value,
      })
    } else {
      wx.navigateTo({
        url: '/pages/search/list/list?tagId=' + that.data.tagList[0].id + '&tagName=' + that.data.tagList[0].name,
      })
    }
  },

  getSearchTip: function(){
    var that = this
    if(that.data.inputVal == "题材"
      || that.data.inputVal == "题材:"
      || that.data.inputVal == "题材："
      ||that.data.inputVal == "角色"
      || that.data.inputVal == "角色:"
      || that.data.inputVal == "角色：") {
        return
      }
    jsUtil.authedRequest({
      url: app.fixTagSearchUrl,
      method: "GET",
      data: {
        "sourceTagNameChip": that.data.inputVal
      },
      success: function (data) {
        that.setData({
          tagList: data.list
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
});