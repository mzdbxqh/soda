var app = getApp()
var jsUtil = require("../../utils/util.js")
var mode = require("../../utils/mode.js")
var t
var searching = true
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
    jsUtil.authedRequest({
      url: app.onSearch,
      method: "GET",
      success: function (data) {
        // 埋点
      }
    })
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
    searching = true
    if(t){
      clearTimeout(t)
    }
    t = setTimeout(getSearchTip,150)
  },
  inputConfirm: function(e){
    var that = this

    // 尝试匹配开关关键词
    if (mode.isSwitch({
      str:that.data.inputVal,
      callback: function(){
        that.setData({ // 初始化输入框
          inputVal: "",
          inputShowed: false,
          tagList: []
        })
        searching = false; // 标记状态
        app.globalData.needRefreshPic = true
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })) {
      return
    }

    if (searching || !that.data.inputVal) {
      jsUtil.formErrTip({
        title: "正在匹配关键词，请稍后"
      })
      return
    }
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

  /**
   * 获取搜索提示
   */
  getSearchTip: function(){
    var that = this

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
        searching = false
      }
    })
  },

  /**
   * 跳转到加入我们页面
   */
  joinUs: function(){
    wx.navigateTo({
      url: '/pages/share/join/join',
    })
  },

  /**
   * 分享方法
   */
  onShareAppMessage: function () {
    var that = this
    return jsUtil.doShare({
      title: '绅士模式是什么鬼？我似乎发现了什么了不得的东西...',
      path: '/pages/search/search',
      page: "search"
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
    if(mode.isEmpty){
      jsUtil.authedRequest({
        url: app.switchTagSearchUrl,
        method: "GET",
        success: function (data) {
          mode.unpackTagList(data)
        }
      })
    }
  }
});