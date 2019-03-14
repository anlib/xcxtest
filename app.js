const ts = require('pages/module/myinfo/teacher-server/teacher-server.js');
const md5 = require('utils/md5.js');

App({
  onLaunch: function() {
    //获取本地缓存
    this.globalData.openid = wx.getStorageSync('openid');
    this.globalData.sessionOpenid = wx.getStorageSync('sessionOpenid');
    this.globalData.teacherDetail = wx.getStorageSync('teacherDetail');
    this.globalData.userid = this.globalData.teacherDetail.id;
    //console.log(this.globalData.userid)
    //懒加载获取openid并登录
    this.getUserLogin(this.callback); //lazy  loading openid
  },

  /* 
   * 懒加载获取openid并登录
   */
  getUserLogin(callback) {
    //console.log('--------getUserOpenId----------');
    var openid = this.globalData.openid;
    //console.log(this.globalData.sessionOpenid)
    //console.log(md5.hex_md5(md5.hex_md5(openid + this.globalData.salt)))
    var sessionOk = this.globalData.sessionOpenid == md5.hex_md5(md5.hex_md5(openid + this.globalData.salt));
    //console.log(sessionOk);
    if (openid && sessionOk) {
      callback(null, openid);
    } else {
      //调用登录接口
      const that = this;
      wx.login({
        success: function(data) {
          //console.log('data', data)
          wx.request({ //发送 res.code 到后台换取 openid, session_key, unionId
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' +
              that.globalData.appid + '&secret=' +
              that.globalData.secret + '&js_code=' +
              data.code + '&grant_type=authorization_code',
            data: {},
            header: {
              'content-type': 'application/json'
            },
            success: function(res) {
              //console.log('拉取openid成功', res)
              var openid = res.data.openid;
              callback(null, openid);
            },
            fail(res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
          // 获取用户信息
          wx.getUserInfo({
            success: function(res) {
              //console.log('login:', res);
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo
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

  /* 
   * 懒加载返回函数并登录
   */
  callback: function(mgs, openid) {
    //console.log('-----callback-----openid:', openid);
    mgs && console.log(mgs);
    //本地存储能力
    if (openid) {
      wx.setStorageSync('openid', openid);
      this.globalData.openid = openid; //返回openid
      // sessionOpenid 登录 并 更新登录时间
      ts.appjsTeacher(openid, this.globalData.serverUrl, this);
    }
  },

  globalData: {
    openid: null,
    sessionOpenid: null,
    userid: null,
    userInfo: null,
    serverUrl: 'https://www.ylj.com/cp-springboot/',
    srcUrl: 'http://www.ylj.com/',
    //微信的账号配置信息
    appid: 'wx11949ca5579cda89',
    secret: '2b55dadc6cedee08a9f26b80f7bb6e08',
    //特定设置
    salt: 'suanzhezhineng', //加密盐值
  }
})