/**
 * 模式开关相关工具包
 */

import jsUtil from "util.js"
var app = getApp()
// 模式常量
var ENUM = {
  MAN: {
    code:2,
    openMsg:"开启#Hentai 标签浏览权限，用绅士角度看世界，但拒绝H。关闭请搜索“关闭Hentai”",
    closeMsg:"确认关闭Hentai模式吗？",
    str:"HENTAI"
  },
  WOMAN: {
    code:3,
    openMsg: "开启#biubiubiu 标签浏览权限，进入激萌的世界。关闭请搜索“关闭biubiubiu”",
    closeMsg: "确认关闭Hentai模式吗？",
    str:"biubiubiu"
  }
}

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
  for(var key in ENUM){
    if (str.toUpperCase() == ENUM[key].str){
      switchMode(ins, ENUM[key],callback)
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
    msg = mode.closeMsg
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
            "modeCode": mode.code 
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
  switchMode:switchMode
}