var jsUtil = require("../../../utils/util.js")
var imageUtil = require("../../../utils/image.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    originSrc: "", //原图url
    src: "",
    
    imageInfoHidden: true, //图片详情是否显示 
    photoHidden: true, //TODO:修复图片调整尺寸时的抖动
    bottomBarHidden: false, //底部tabbar是否隐藏
    isX: false, //是否横向滚动
    scrollTop: 0,
    scrollLeft: 0,

    imagewidth: 0,  //图片宽
    imageheight: 0, //图片高
    boxwidth: 0, //容器宽
    boxheight: 0, //容器高

    favCount: 0, //喜爱数量
    faved: false, //是否喜爱

    current:"",//当前图片Id
    tags:[], //图片标签集
    author:"", //作者
    createBy:"", //添加者
    picExif:"" //图片尺寸分辨率等
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      current: options.pid
    })
    if (!that.data.current){
      that.setData({
        current: "3a2e07ed7dcf4158a80b1ed03a5dc30d"
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    jsUtil.authedRequest({
      url: app.getPicUrl,
      data: {
        id:that.data.current
      },
      method: "GET",
      success: function (data) {
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
        var picSize, picExif
        picSize = (data.fileSize / 1048576).toFixed(2)
        picSize += "M"
        picExif = picSize + "," + data.pictureWidth + "×" + data.pictureHeight

        /**
         * 修正url
         */
        var picSrc, picOriginSrc
        picOriginSrc = app.picServerUrl + data.filePath + data.fileName
        picSrc = picOriginSrc + imageUtil.getThumb({
          width: data.pictureWidth,
          height: data.pictureHeight
        })
        that.setData({
          originSrc: picOriginSrc,
          src: picSrc,
          tags: data.fixTagList ? data.fixTagList : [{ name: "无标签" }], //临时
          author: author,
          createBy: createBy,
          picSize: picSize,
          picExif: picExif,
          faved: data.hasCollect,
          favCount: data.collectCount,
          current: data.id
        })
        wx.showLoading({
          title: '加载中'
        })
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  /**
   * 图片加载完毕
   */
  imageLoaded: function (e) { //图片加载成功事件
    if (this.data.src == "") return
    wx.hideLoading();
    var imageSize = imageUtil.imageFixer(e);
    var isX, scrollLeft, scrollTop
    if (imageSize.imageWidth > imageSize.boxWidth) { //图片比容器宽
      isX = true
      scrollLeft = (imageSize.imageWidth - imageSize.boxWidth) / 2
      scrollTop = 0
    } else {
      isX = false
      scrollLeft = 0
      scrollTop = (imageSize.imageHeight - imageSize.boxHeight) / 2
    }
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight,
      boxwidth: imageSize.boxWidth,
      boxheight: imageSize.boxHeight,
      isX: isX
    })
    this.setData({
      photoHidden: false
    })
    this.setData({
      scrollLeft: scrollLeft,
      scrollTop: scrollTop
    })
  },

  /**
   * 显示/隐藏图片详情
   */
  showDetail: function (e) {
    this.setData({
      imageInfoHidden: this.data.imageInfoHidden ? false : true
    })
  },

  /**
   * 显示/隐藏底部tabbar
   */
  toggleBottomBar: function (e) {
    this.setData({
      bottomBarHidden: this.data.bottomBarHidden ? false : true,
      imageInfoHidden: this.data.imageInfoHidden ? this.data.imageInfoHidden : true
    })
  },

  /**
   * 查看原图
   */
  download: function () {
    var that = this
    jsUtil.authedRequest({
      url: app.picShowOriginUrl,
      method: "GET",
      success: function (data) {
        console.log(data)
      }
    })
    imageUtil.checkAlbumAuth({
      hasAuth: function () {

        jsUtil.formLoading({
          title: "正在下载..."
        })
        //先下载
        wx.downloadFile({
          url: that.data.originSrc,
          success: function (res) {

            //再转移到相册
            wx.hideLoading() //隐藏和下一次显示必须有时间差
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success(res) {
                jsUtil.formSuccessTip({
                  title: "已保存至手机相册",
                  callback: function () { }
                })
              },
              fail(res) {
                jsUtil.formErrTip({
                  title: res.errMsg
                })
              }
            })

          }, fail: function (res) {
            jsUtil.formErrTip({
              title: res.errMsg
            })
          }
        })

      },
      noAuth: function () {
        wx.previewImage({
          urls: [that.data.originSrc],
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
      path: '/pages/index/index',
      success: function (res) {
        jsUtil.formSuccessTip({
          title: "分享成功"
        })
      },
      fail: function (res) {
        jsUtil.formErrTip({
          title: "分享失败"
        })
      }
    }
  },

  /**
   * 喜欢/取消喜欢图片
   */
  doFav: function (e) {
    var that = this
    if (!that.data.faved) {
      jsUtil.authedRequest({
        url: app.picCollectUrl,
        data: {
          "id": that.data.current
        },
        method: "GET",
        success: function (data) {
          if (data === "success") {
            that.setData({
              faved: true,
              favCount: that.data.favCount + 1
            })
          } else {
            jsUtil.formErrTip({
              title: "抱歉，服务器可能出问题了"
            })
          }
        }
      })
    } else {
      jsUtil.authedRequest({
        url: app.picCollectCancelUrl,
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
  actionSheet: function (e) {
    var that = this
    wx.showActionSheet({
      // itemList: ['发送给文武百官', '朕认为此图不妥','来人，朕有要事宣布'],
      itemList: ['发送给朋友', '反馈', '举报'],
      success: function (res) {
        switch (res.tapIndex) {
          case 0:
            jsUtil.formErrTip({
              title: "微信让点右上角的···按钮"
            })
            break;
          case 2:
            wx.navigateTo({
              url: '/pages/index/report/report?pid=' + that.data.current,
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
          default:
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})