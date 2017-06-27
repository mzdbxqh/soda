/**
 * 音频相关JS工具包
 */

/**
 * 初始化并判定兼容性
 * ciu = Can I Use
 */
var app = getApp()
var ciuAudio = 0
var backgroundAudioManager = null
function audioInit(){
  switch(ciuAudio){
    case 0:
      if (wx.canIUse('getBackgroundAudioManager')) {
        backgroundAudioManager = wx.getBackgroundAudioManager()
        backgroundAudioManager.title = 'Soda音效'
        backgroundAudioManager.epname = 'Soda音效'
        backgroundAudioManager.singer = 'Soda'
        backgroundAudioManager.coverImgUrl = app.audioCoverPic
        ciuAudio = 1
        return true
      } else {
        ciuAudio = 2
        return false
      }
      break
    case 1:
      return true
      break
    case 2:
      return false
  }
}
if(ciuAudio){
  
}

/**
 * 是否正在播放
 */
function isPlaying(){
  if (audioInit()){
    if (backgroundAudioManager.paused === false) {
      return true;
    } else {
      return false;
    }
  }
}

/**
 * 播放tap音效
 */
function playTap(){
  if (audioInit()) {
    backgroundAudioManager.title = "滴，学生卡"
    backgroundAudioManager.src = app.audioTap
  }
}

/**
 * 播放tap音效
 */
function playSlide() {
  if (audioInit()) {
    backgroundAudioManager.title = "咻..."
    backgroundAudioManager.src = app.audioSlide
  }
}

module.exports = {
  isPlaying:isPlaying,
  playTap: playTap,
  playSlide: playSlide
}