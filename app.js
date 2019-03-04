//app.js
App({
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //调用登录接口
    wx.login({
      success: function (res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx11949ca5579cda89&secret=2b55dadc6cedee08a9f26b80f7bb6e08&js_code=' + res.code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            //console.log(res);
            that.globalData.openid = res.data.openid //返回openid
            that.globalData.session_key = res.data.session_key //返回session_key
          }
        })
    // 获取用户信息
        wx.getUserInfo({
          success: function (res) {
            //console.log('login:');
            //console.log(res);
            // 可以将 res 发送给后台解码出 unionId
            that.globalData.userInfo = res.userInfo
          }
        })
      }
    })
  },
  globalData: {
    openid: null,
    session_key: null,
    userInfo: null,
    serverUrl: 'https://www.ylj.com/cp-springboot/',
    srcUrl: 'http://www.ylj.com/'
  }
})

