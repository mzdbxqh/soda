/**
 * 模式开关相关工具包
 */

import jsUtil from "util.js"
var app = getApp()
// 模式常量
var ENUM = {
  MAN: {
    code:2,
    msg:"绅士模式",
    str:"HENTAI"
  },
  WOMAN: {
    code:3,
    msg:"???模式",
    str:"???"
  }
}

// 开关字符
var INS = {
  OPEN: {
    str: "open",
    msg: "开启",
    reg: new RegExp("^开启","g")
  },
  CLOSE: {
    str: "close",
    msg: "关闭",
    reg: new RegExp("^关闭", "g")
  }
}


/**
 * 进行开关匹配
 */
function isSwitch({str,callback}) {
  str = str.replace(/(^\s*)|(\s*$)/g, "") // 去除空格
  if(!str) return false // 判空
  
  var ins = ""
  if(str.substring(0,2) == INS.OPEN.msg){ // 开
    ins = INS.OPEN
    str = str.replace(INS.OPEN.reg, "")
  } else if(str.substring(0,2) == INS.CLOSE.msg){ // 关
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
  wx.showModal({
    title: '提示',
    content: '是否' + ins.msg + '「' + mode.msg + '」',
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
          title: '放弃进入',
        })
      }
    }
  })
}

module.exports = {
  isSwitch: isSwitch,
  switchMode:switchMode
}