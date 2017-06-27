var jsUtil = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    radioItems: [
      {name: '包含裸体或色情', value: '1', checked: true},
      {name: '攻击组织或个人的内容', value: '2'},
      {name: '视觉性的暴力行为', value: '3'},
      {name: '侵害著作权', value: '4'},
      {name: '其他', value: '5'}
    ],
    current:"",
    reason:"1",
    remarks: "",
    isOther:false
  },
  radioChange: function (e) {
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems,
      reason: e.detail.value,
      isOther: e.detail.value === '5'?true:false
    });
  },
  remarkChange: function(e){
    this.setData({
      remarks: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      current: options.pid
    })
  },

  submit: function(){
    var that = this
    if (that.data.isOther && that.data.remarks === ""){
      jsUtil.formErrTip({
        title:"请填写备注"
      })
      return
    }
    if (!that.data.current) {
      jsUtil.formErrTip({
        title:"未选择图片?"
      })
      return
    }
    jsUtil.authedRequest({
      url: app.reportUrl,
      data: {
        "picture.id": that.data.current,
        "reason": that.data.reason,
        "processFlag": "0",
        "remarks": that.data.remarks
      },
      method: "GET",
      success: function (data) {
        if(data === "success"){
          jsUtil.formSuccessTip({
            title: "举报成功，感谢您的协助",
            duration: 1500,
            callback: function(){
              wx.navigateBack({
                delta: 1
              }) 
            }
          })
        }
      }
    })
  }
});