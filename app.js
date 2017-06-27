App({

  /**
   * 全局Url
   */
  // serverUrl = "http://127.0.0.1:8080/soda/",
  serverUrl: "https://www.91xiaban.com/", // 服务器Url
  picServerUrl: "https://soda-1253373459.image.myqcloud.com", // 图片服务器Url

  /**
   * 获取单图接口
   */
  getRandomPicUrl: "a/wp/picture/getRandomPic", // 随机获取图片
  getPicUrl: "a/wp/picture/getPic", // 获取指定图片

  /**
   * 获取图片列表接口
   */
  picCollectListUrl: "a/wp/picture/collect/list", // 获取图片收藏列表
  picCreateListUrl: "a/wp/picture/create/list", // 获取图片发布列表
  picUpdateListUrl: "a/wp/fixTag/getUpdateLog", // 根据修正标签显示图片更新列表
  picListByFixTagUrl: "a/wp/picture/fixTag/list", // 根据修正标签获取图片列表

  /**
   * 图片操作接口
   */
  picCollectUrl: "a/wp/picture/collect/save", // 收藏图片
  picCollectCancelUrl: "a/wp/picture/collect/del", // 取消收藏
  picUploadUrl: "a/wp/picture/import", // 上传图片
  picInfoUploadUrl: "a/wp/picture/saveByWechat", // 上传图片信息

  /**
   * 标签操作接口
   */
  fixTagSearchUrl: "a/wp/fixTag/search", //搜索修正标签

  /**
   * 辅助页面接口
   */
  feedbackUrl: "a/wp/feedback/put", // 提交feedback
  reportUrl: "a/wp/report/put", // 提交report

  /**
   * 纯交互行为埋点
   */
  picLoadConfirmUrl: "a/wp/picture/confirm", // 图片加载确认接口
  picShowOriginUrl: "a/wp/picture/showOriginPic", // 显示大图行为接口

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