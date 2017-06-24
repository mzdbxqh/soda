var jsUtil = require('../../../utils/util.js')
Page({
    data: {
      files: [],
      radioItems: [
        {name: '原创', value: '1', checked: true},
        {name: '转载', value: '0'}
      ],
      tags: [],
      inputContent:[], //所有input的值容器
      tagInputValue: "", //标签输入框值，用于清空
      isOrigin:true //是否原创
    },

    /**
     * 选择图片
     */
    chooseImage: function (e) {
      var that = this;
      wx.chooseImage({
        // sizeType: ['original', 'compressed'], 
        // 可以指定是原图还是压缩图，默认二者都有
        // sourceType: ['album', 'camera'], 
        // 可以指定来源是相册还是相机，默认二者都有
        sizeType: ['original'],
        sourceType: ['album'],
        count:1, //最多一张
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
              // 添加多张的方法
              // files: that.data.files.concat(res.tempFilePaths)
              files: res.tempFilePaths
          });
          console.log(that.data.files)
        }
      })
    },

    /**
     * 原创/转载单选
     */
    radioChange: function (e) {
      var radioItems = this.data.radioItems;
      for (var i = 0, len = radioItems.length; i < len; ++i) {
        radioItems[i].checked = radioItems[i].value == e.detail.value;
        this.setData({
          isOrigin:e.detail.value == 1
        })   
      }
      this.setData({
        radioItems: radioItems
      });
    },

    /**
     * 输入内容变动
     */
    inputChange: function(e){
      var content = this.data.inputContent
      content[e.currentTarget.id] = e.detail.value
      this.setData({
        inputContent: content 
      })
    },

    /**
     * 删除标签
     */
    removeTag: function(e){
      var that = this
      var tagIndex = e.target.dataset.index
      var tagList = this.data.tags
      for(var i=tagIndex;i<tagList.length;i++){
        tagList[i] = tagList[i+1]
      }
      tagList.length -= 1
      that.setData({
        tags: tagList
      })
    },

    /**
     * 输入框点了右下角按钮
     */
    inputConfirm: function(e){
      var that = this
      var newTag = e.detail.value

      // 清空输入框
      that.setData({
        tagInputValue: ""
      })

      // 判空
      if(!e.detail.value){
        return
      }

      // 判重
      var oldList = that.data.tags
      for (var i = 0;i<oldList.length;i++){
        if(oldList[i] == newTag){
          jsUtil.formErrTip({
            title:"标签重复了"
          })
          return
        }
      }

      // 判个数
      if (oldList.length>20){
        jsUtil.formErrTip({
          title: "标签个数太多"
        })
        return
      }

      // 判长度
      if(newTag.length>40){
        jsUtil.formErrTip({
          title:"标签过长"
        })
        return
      }

      // 赋值
      that.setData({
        tags: that.data.tags.concat(newTag)
      })
    },

    /**
     * 上传
     */
    callUploader:function(e){
      var that = this;
      if (that.data.files.length === 0){
        jsUtil.formErrTip({
          title: "请选择图片"
        })
        return
      }
      if (that.data.tags.length === 0){
        jsUtil.formErrTip({
          title: "请填写标签"
        })
        return
      }
      if (!that.data.isOrigin && !that.data.inputContent["author"] && !that.data.inputContent["origin"]){
        jsUtil.formErrTip({
          title: "请填写作者或来源"
        })
        return
      }
      jsUtil.formLoading({
        title: "正在上传"
      })
      jsUtil.authedUploader({
        url:"a/wp/picture/import",
        filePath: that.data.files[0],
        success:function(data){
          var res = JSON.parse(data)
          if(res[0].result==="1"){
            var pic = res[0].picture
            var postData = {
              "filePath": pic.filePath,
              "fileName": pic.fileName,
              "fileSize": pic.fileSize,
              "pictureWidth": pic.pictureWidth,
              "pictureHeight": pic.pictureHeight,
              "hasOrigin": that.data.isOrigin ? "1" : "0",
              "tags": that.data.tags,
              "originThird": that.data.inputContent["origin"] ? that.data.inputContent["origin"]:"",
              "originAuthor": that.data.inputContent["author"] ? that.data.inputContent["author"]:""
            }
            jsUtil.authedRequest({
              url:"a/wp/picture/saveByWechat",
              data:postData,
              success:function(data){
                wx.hideLoading()
                jsUtil.formSuccessTip({
                  title: "上传成功",
                  callback:function(){
                    wx.redirectTo({
                      url: '/pages/search/detail/detail?pid=' + data.id,
                    })
                  }
                })
              },
              fail:function(e){

              }
            })
          }
        },
        fail:function(e){
          console.log("fail")
        },
        complete: function (res) {
          wx.hideLoading()
        }
      })
    }
});