/**
 * 音频相关JS工具包
 */

/**
 * 初始化并判定兼容性
 * ciu = Can I Use
 */
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
        backgroundAudioManager.coverImgUrl = 'http://picture.91xiaban.com/bottom-tab-bar.png'
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
    backgroundAudioManager.src = "http://picture.91xiaban.com/resources/tap.mp3?20170612"
  }
}

/**
 * 播放tap音效
 */
function playSlide() {
  if (audioInit()) {
    backgroundAudioManager.title = "咻..."
    backgroundAudioManager.src = "http://picture.91xiaban.com/resources/slide.mp3?20170612"
  }
}

module.exports = {
  isPlaying:isPlaying,
  playTap: playTap,
  playSlide: playSlide
}