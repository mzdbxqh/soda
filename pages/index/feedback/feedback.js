var app = getApp()
var jsUtil = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:"",
    contact:"",
    focus:false //把焦点转移到input
  },

  /**
   * 输入建议
   */
  contentChange: function(e){
    this.setData({
      content: e.detail.value
    })
  },

  /**
   * 输入联系方式
   */
  contactChange: function (e) {
    this.setData({
      contact: e.detail.value
    })
  },


  /**
   * 提交表单
   */
  callSubmit: function(e){

    var that = this

    /**
     * 强制把焦点移到input
     * 避免textarea未失去焦点导致数据绑定不成功
     * 发现并没有什么卵用
     */
    // that.setData({
    //   focus:true
    // })

    if(that.data.content === ""){
      jsUtil.formErrTip({
        title:"请填写建议内容"
      })
      return
    }

    jsUtil.formLoading({
      title: "正在提交"
    })

    var postData = {
      content:that.data.content,
      contact:that.data.contact
    }

    jsUtil.authedRequest({
      url: app.feedbackUrl,
      data: postData,
      success: function (data) {
        // 间隔时间太短，不手动关闭，直接用下一个toast覆盖，否则会闪退
        // wx.hideLoading()
        jsUtil.formSuccessTip({
          title: "提交成功，感谢你的建议",
          duration: 2500,
          callback: function () {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        })
        if(data === "success"){
          
        } else {
          jsUtil.formSuccessTip({
            title: "提交失败，可能服务器出问题了",
            callback: function () {
              wx.switchTab({
                url: '/pages/index/index',
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    return app.doDefaultShare()
  }
})