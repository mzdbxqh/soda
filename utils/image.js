/**
 * 图片相关JS工具包
 */


/**
 * 初始化参数
 */
(function(){

})()

/**
 * 获取图片服务器地址
 */
function getPicServerUrl() {
  return "http://picture1.91xiaban.com";
  // return "http://picture.91xiaban.com";
}

/**
 * 根据屏幕尺寸调整图片大小
 */
function imageFixer(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽 
  var originalHeight = e.detail.height;//图片原始高 
  var originalScale = originalHeight / originalWidth;//图片高宽比 
  //获取屏幕宽高 
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight / windowWidth;//屏幕高宽比 
      if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比 
        //图片缩放后的宽为屏幕宽 
        imageSize.imageHeight = windowHeight;
        imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight
      } else {//图片高宽比大于屏幕高宽比 
        //图片缩放后的高为屏幕高 
        imageSize.imageWidth = windowWidth;
        imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
      }
      imageSize.boxWidth = windowWidth;
      imageSize.boxHeight = windowHeight;
    }
  });
  return imageSize;
}

/**
 *  小图片自动调整9:16
 */
function smallImageFixer(e) {
  var imageSize = {};
  var originalWidth = e.pictureWidth;//图片原始宽 
  var originalHeight = e.pictureHeight;//图片原始高 
  var originalScale = originalHeight / originalWidth;//图片高宽比 

  // 临时手动设置9:16的参考尺寸
  var windowWidth = 350; //加多几个单位避免四舍五入出现白边
  var windowHeight = 622;
  var windowscale = windowHeight / windowWidth;//屏幕高宽比 
  
  if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比 
    //图片缩放后的宽为屏幕宽 
    imageSize.imageHeight = windowHeight;
    imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight
  } else {//图片高宽比大于屏幕高宽比 
    //图片缩放后的高为屏幕高 
    imageSize.imageWidth = windowWidth;
    imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
  }

  imageSize.boxWidth = windowWidth;
  imageSize.boxHeight = windowHeight;
  return imageSize;
}

/**
 * 根据屏幕大小和图片大小即时计算缩略图尺寸
 */
function getThumb(image = { width: 1, height: 1 }) {

  var res = wx.getSystemInfoSync()
  var baseHeight = res.windowHeight
  var baseWidth = res.windowWidth
  var photoScale = image.width / image.height //值越大，图片越扁平；越小，图片越瘦高
  var deviceScale = baseWidth / baseHeight //值越大，设备越扁平；越小，设备越瘦高

  var minHeight, thumb
  //图片宽高比大于屏幕宽高比，图片比设备更胖，此时以设备高度为基准，图片高度大于设备高度，图片就够大
  if (photoScale > deviceScale) {
    minHeight = baseHeight

    // 图片宽高比小于屏幕宽高比，图片小，以图片宽度为基准
  } else {
    minHeight = baseWidth / photoScale
  }

  if (minHeight > 2400) {
    thumb = "!"
  } else if (minHeight > 2000) {
    thumb = "!2400"
  } else if (minHeight > 1600) {
    thumb = "!2000"
  } else if (minHeight > 1200) {
    thumb = "!1600"
  } else if (minHeight > 800) {
    thumb = "!1200"
  } else if (minHeight > 400) {
    thumb = "!800"
  } else {
    thumb = "!400"
  }

  return thumb
}

module.exports = {
  imageFixer: imageFixer,
  smallImageFixer: smallImageFixer,
  getThumb: getThumb,
  getPicServerUrl: getPicServerUrl
}