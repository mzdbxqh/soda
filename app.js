App({

  /**
   * 服务器Url
   */
  // serverUrl = "http://127.0.0.1:8080/soda/",
  serverUrl: "https://www.91xiaban.com/",

  /**
   * 图片服务器Url
   * 下载必须使用后台配置过的https域名
   */
  picServerUrl: "https://soda-1253373459.image.myqcloud.com",

  /**
   * 随机获取图片接口
   */
  getRandomPicUrl: "a/wp/picture/getRandomPic",

  /**
   * 获取指定图片接口
   */
  getPicUrl: "a/wp/picture/getPic",

  /**
   * 获取图片收藏列表接口
   */
  picCollectListUrl: "a/wp/picture/collect/list",

  /**
   * 获取图片发布列表接口
   */
  picCreateListUrl: "a/wp/picture/create/list",

  /**
   * 收藏/取消图片接口
   */
  picCollectUrl: "a/wp/picture/collect/save",
  picCollectCancelUrl: "a/wp/picture/collect/del",

  /**
   * 根据修正标签获取图片列表接口
   */
  picListByFixTagUrl: "a/wp/picture/fixTag/list",

  /**
   * 根据修正标签显示图片更新列表接口
   */
  picUpdateListUrl: "a/wp/fixTag/getUpdateLog",

  /**
   * 搜索修正标签接口
   */
  fixTagSearchUrl: "a/wp/fixTag/search",

  /**
   * 图片上传接口
   */
  picUploadUrl: "a/wp/picture/import",
  picInfoUploadUrl: "a/wp/picture/saveByWechat",

  /**
   * 提交feedback/report接口
   */
  feedbackUrl: "a/wp/feedback/put",
  reportUrl: "a/wp/report/put",

  /**
   * 纯交互行为埋点
   */
  // 图片加载确认接口
  picLoadConfirmUrl: "a/wp/picture/confirm",
  // 显示大图行为接口
  picShowOriginUrl: "a/wp/picture/showOriginPic",

  /**
   * 资源地址
   */
  audioCoverPic: 'http://picture.91xiaban.com/bottom-tab-bar.png',
  audioTap: "http://picture.91xiaban.com/resources/tap.mp3?20170612",
  audioSlide: "http://picture.91xiaban.com/resources/slide.mp3?20170612",

  onLaunch: function () {
    
  },
  globalData:{

  }
})