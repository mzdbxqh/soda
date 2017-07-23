/**
 * 模式开关相关工具包
 */

import jsUtil from "util.js"
var app = getApp()

// 模式常量
var TAG_LIST = []

// 开关字符
var INS = {
  OPEN: {
    str: "open",
    reg: new RegExp("^开启|^进入|^召唤","g")
  },
  CLOSE: {
    str: "close",
    reg: new RegExp("^关闭|^退出|^结束|^封印", "g")
  }
}

/**
 * 用于外部检测是否已初始化开关列表
 */
function isEmpty(){
  if (TAG_LIST.length == 0){
    return true
  } else {
    return false
  }
}

/**
 * 用于外部填入
 */
function unpackTagList(data){
  for (var key in data) {

    var code = 0
    switch(data[key].type){
      case 21:
        code = 2
        break
      case 22:
        code = 3
        break
    }

    var name = data[key].name
    var tag = {
      code: code,
      openMsg: data[key].remarks ? data[key].remarks : "开启#" + name + "标签浏览权限。关闭请搜索“关闭" + name + "”",
      tagId: key,
      tagName: name
    }
    TAG_LIST.push(tag)
  }
}


/**
 * 进行开关匹配
 */
function isSwitch({str,callback}) {
  str = str.replace(/(^\s*)|(\s*$)/g, "") // 去除空格
  if(!str) return false // 判空
  
  var ins = ""
  if(INS.OPEN.reg.exec(str)){ // 开
    ins = INS.OPEN
    str = str.replace(INS.OPEN.reg, "")
  } else if (INS.CLOSE.reg.exec(str)){ // 关
    ins = INS.CLOSE
    str = str.replace(INS.CLOSE.reg, "")
  } else { // 非特殊指令
    return false
  }
  
  for(var key in TAG_LIST){
    if (str.toUpperCase() == TAG_LIST[key].tagName.toUpperCase()){
      switchMode(ins, TAG_LIST[key],callback)
      return true
    }
  }
  
  return false
}

/**
 * 切换模式逻辑
 */
function switchMode(ins, mode, callback) {
  var msg
  if(ins.str == "open") {
    msg = mode.openMsg
  } else {
    msg = "确认关闭" + mode.tagName + "模式吗？"
  }
  wx.showModal({
    title: '提示',
    content: msg,
    success: function (res) {
      if (res.confirm) {
        jsUtil.authedRequest({
          url: app.picSwitchModeUrl,
          method: "GET",
          data: {
            "ins": ins.str,
            "modeCode": mode.code,
            "tagId": mode.tagId
          },
          success: function (data) {
            callback()
          }
        });
      } else if (res.cancel) {
        wx.showToast({
          title: '已放弃',
        })
      }
    }
  })
}

module.exports = {
  isSwitch: isSwitch,
  switchMode:switchMode,
  isEmpty: isEmpty,
  unpackTagList: unpackTagList
}