const ts = require('pages/module/myinfo/teacher-server/teacher-server.js');
const util = require('utils/util.js')
App({
  onLaunch: function() {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //获取本地缓存
    that.globalData.openid = wx.getStorageSync('openid'); //返回openid
    that.globalData.teacherDetail = wx.getStorageSync('teacherDetail');
    //console.log(that.globalData.teacherDetail);
    
    //调用登录接口
    wx.login({
      success: function(res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx11949ca5579cda89&secret=2b55dadc6cedee08a9f26b80f7bb6e08&js_code=' + res.code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            //console.log(res);
            var openid = res.data.openid;
            that.globalData.openid = openid; //返回openid
            that.globalData.session_key = res.data.session_key; //返回session_key
            if (openid) {
              //存储到本地
              wx.setStorageSync("openid", openid);
              var p = {
                'openid': res.data.openid,
                'lastlongin': util.formatDateTime(new Date())
              };
              //此处需要修改为 cookie 和 session 登录；
              //更新登录时间
              ts.searchTeacher(p, that.globalData.serverUrl, that);
              
            }
          }
        })
        // 获取用户信息
        wx.getUserInfo({
          success: function(res) {
            //console.log('login:');
            //console.log(res);
            // 可以将 res 发送给后台解码出 unionId
            that.globalData.userInfo = res.userInfo
          }
        })
      }
    })
  },
  // lazy loading openid
  getUserOpenId(callback) {
    const self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success(data) {
          wx.request({
            url: config.openIdUrl,
            data: {
              code: data.code
            },
            success(res) {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.data.openid
              callback(null, self.globalData.openid)
            },
            fail(res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },
  globalData: {
    openid: null,
    session_key: null,
    userInfo: null,
    serverUrl: 'https://www.ylj.com/cp-springboot/',
    srcUrl: 'http://www.ylj.com/',
    header: { cookie: ''},
  }
})