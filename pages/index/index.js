//index.js
//获取应用实例
var jsUtil = require('../../utils/util.js')
var audioUtil = require('../../utils/audio.js')
var imageUtil = require('../../utils/image.js')
Page({
  data: { //数据
    originSrc:"", //原图url
    src:"", //图片url
    prevSrc:"", //预览图url
    
    imagewidth: 0,  //图片宽
    imageheight: 0, //图片高
    boxwidth: 0, //容器宽
    boxheight: 0, //容器高

    imageInfoHidden: true, //图片详情是否显示 
    photoHidden: true, //TODO:修复图片调整尺寸时的抖动
    bottomBarHidden: false, //底部tabbar是否隐藏
    
    favCount: 0, //喜爱数量
    faved: false, //是否喜爱
    
    times: 0, //刷新次数
    
    current:"",//当前图片Id
    tags:[], //图片标签集
    author:"", //作者
    createBy:"", //添加者
    picExif:"", //图片尺寸分辨率等

    isLoading: false, //加载状态标记
    loadBeginTime: 0 //加载开始时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },

  /**
   * 更新版本的提示
   */
  updateTip: function () {
    jsUtil.formErrTip({
      title: "当前微信版本过低，请升级到最新版以支持所有功能",
      duration: 50000
    })
  },

  /**
   * 长按刷新按钮
   * 尚未解决自定义延时长度的问题
   * 尚未解决长按松开后仍触发点按事件的问题
   */
  switchMode: function(e) {
    console.log(e)
  },
  
  /**
   * 随机刷新图片
   */
  getRandomPhoto: function (e) {
    var that = this

    wx.showLoading({
      title: '加载中'
    })

    /**
     * 限制频率不得大于1秒1次
     */
    var loadBeginTime = Date.parse(new Date()) //本次加载开始时间
    var lastBeginTime = that.data.loadBeginTime //上次加载时间
    // 小于1秒，忽略
    if(lastBeginTime !== 0 && loadBeginTime - lastBeginTime <= 400){
      jsUtil.formErrTip({
        title: "慢点...你戳痛人家了"
      })
      return
    }
    // 首次请求或大于1秒，记录开始时间
    that.setData({
      loadBeginTime: loadBeginTime
    })

    if (this.data.times != 0) {
      audioUtil.playTap()
    }
    jsUtil.authedRequest({
      url: "a/wp/picture/getRandomPic",
      method: "GET",
      success: function (data) {
        that.refreshData(data)
      }
    })
  },

  /**
   * 刷新图片信息
   */
  refreshData: function(data){
    var that = this
    /**
     * 修正版权
     */
    var author
    if (data.hasOrigin) {
      author = "原创"
    } else {
      author = data.originThird
      author += author && data.author ? ">>" : ""
      author += data.author || ""
      author = author || data.originUrl
      author = author || "未知来源"
    }
    var createBy
    if (data.createByName) {
      createBy = data.createByName
    } else {
      createBy = "本站用户"
    }

    /**
     * 修正图片信息
     */
    var picExif
    picExif = (data.fileSize / 1048576).toFixed(2)
    picExif += "MB,"
    picExif += data.pictureWidth + "×" + data.pictureHeight

    /**
     * 开始计时
     */
    var startTime = new Date().getTime()

    /**
     * 修正url
     */
    var picSrc, picOriginSrc
    picOriginSrc = imageUtil.getPicServerUrl() + data.filePath + data.fileName
    picSrc = picOriginSrc + imageUtil.getThumb({
      width:data.pictureWidth,
      height:data.pictureHeight
    })
    that.setData({
      originSrc: picOriginSrc,
      prevSrc: picSrc,
      times: that.data.times + 1,
      tags: data.fixTagList ? data.fixTagList : [{ name: "无标签"}], //临时
      author: author,
      createBy: createBy,
      picExif: picExif,
      faved: data.hasCollect,
      favCount: data.collectCount,
      loadBeginTime: startTime,
      current: data.id
    })
  },
  
  /**
   * 预加载完成
   */
  prevLoaded: function(e){
    if(this.data.prevSrc == "") return

    var that = this

    /**
     * 结束计时
     */
    var endTime = new Date().getTime()
    var keepTime = endTime - that.data.loadBeginTime
    jsUtil.authedRequest({
      url: "a/wp/picture/confirm",
      data: {
        "keepTime": keepTime,
        "result": "success"
      },
      method: "GET",
      success: function (data) {
        that.setData({
          photoHidden: true,
          src: that.data.prevSrc
        })
      }
    })
  },

  /**
   * 预加载失败
   */
  prevErr: function(e){
    var that = this
    var endTime = new Date().getTime()
    var keepTime = endTime - that.data.loadBeginTime
    jsUtil.authedRequest({
      url: "a/wp/picture/confirm",
      data: {
        "keepTime": keepTime,
        "result": "fail"
      },
      method: "GET",
      success: function (data) {
        jsUtil.formErrTip({
          title: "图片加载失败"
        })
        that.getRandomPhoto()
      }
    })
  },

  /**
   * 图片加载完毕
   */
  imageLoaded: function (e) { //图片加载成功事件
    if(this.data.src == "") return
    wx.hideLoading();
    var imageSize = imageUtil.imageFixer(e);
    this.setData({
      imagewidth: imageSize.imageWidth, 
      imageheight: imageSize.imageHeight,
      boxwidth: imageSize.boxWidth,
      boxheight: imageSize.boxHeight
    });
    this.setData({
      photoHidden: false
    })
    if(this.data.times > 1){
      setTimeout(function(){
        audioUtil.playSlide()
      },100)
    }
  },

  /**
   * 显示/隐藏图片详情
   */
  showDetail: function(e) {
    this.setData({
      imageInfoHidden: this.data.imageInfoHidden?false:true
    })
  },

  /**
   * 显示/隐藏底部tabbar
   */
  toggleBottomBar: function(e) {
    this.setData({
      bottomBarHidden: this.data.bottomBarHidden?false:true,
      imageInfoHidden: this.data.imageInfoHidden?this.data.imageInfoHidden:true
    })
  },

  /**
   * 查看原图
   */
  download: function() {
    jsUtil.authedRequest({
      url: "a/wp/picture/showOriginPic",
      method: "GET",
      success: function (data) {
        console.log(data)
      }
    })
    wx.previewImage({
      urls: [this.data.originSrc],
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
    console.log("share!")
    var that = this
    return {
      title: 'Soda壁纸【微信一定要把图裁掉一半】',
      // path: '/pages/detail/detail?pid=' + that.data.current,
      path: '/pages/index/index',
      success: function(res) {
        jsUtil.formSuccessTip({
          title:"分享成功"
        })
      },
      fail: function(res) {
        jsUtil.formErrTip({
          title: "分享失败"
        })
      }
    }
  },

  /**
   * 喜欢/取消喜欢图片
   */
  doFav: function(e){
    var that = this
    if (!that.data.faved){
      jsUtil.authedRequest({
        url: "a/wp/picture/collect/save",
        data:{
          "id":that.data.current
        },
        method: "GET",
        success: function (data) {
          if(data === "success"){
            that.setData({
              faved: true,
              favCount: that.data.favCount + 1
            })
          } else {
            jsUtil.formErrTip({
              title:"抱歉，服务器可能出问题了"
            })
          }
        }
      })
    } else {
      jsUtil.authedRequest({
        url: "a/wp/picture/collect/del",
        data: {
          "id": that.data.current
        },
        method: "GET",
        success: function (data) {
          that.setData({
            faved: false,
            favCount: that.data.favCount - 1
          })
        }
      })
    }
  },

  /**
   * 更多菜单
   */
  actionSheet: function(e){
    var that = this
    wx.showActionSheet({
      // itemList: ['发送给文武百官', '朕认为此图不妥','来人，朕有要事宣布'],
      itemList: ['发送给朋友', '反馈', '举报','test'],
      success: function(res) {
        switch(res.tapIndex){
          case 0:
            jsUtil.formErrTip({
              title:"微信让点右上角的···按钮"
            })
          break;
          case 2:
            wx.navigateTo({
              url: '/pages/index/report/report?pid=' + that.data.current,
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
          break;
          case 1:
            wx.navigateTo({
              url: '/pages/index/feedback/feedback',
              success: function (res) {
                // success
              },
              fail: function (res) {
                // fail
              },
              complete: function (res) {
                // complete
              }
            })
          break;
          case 3:
            wx.navigateTo({
              url: '/pages/index/error/error',
            })
          default:
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    //检测版本，版本过低的话提示然后不进行下一步
    try {
      wx.getSystemInfo({
        success: function (res) {
          var version = res.version
          var vers = version.split(".")
          if (vers[0] < 6) { //大版本必须6以上
            that.updateTip()
            return
          } else if (vers[0] == 6) {
            if (vers[1] < 5) { //大版本为6时，中版本为5以上
              that.updateTip()
              return
            } else if (vers[1] == 5) {
              if (vers[2] < 6) { //中版本为5时，小版本为8或以上
                that.updateTip()
                return
              }
            }
          }
          
          wx.showLoading({
            title: '正在接入',
            mask: true
          })
          jsUtil.login(
            function () {
              that.getRandomPhoto()
            }
          )
        },
      })
    } catch (e) {
      // Do something when catch error
    }
  }
})