const app = getApp();
const serverUrl = app.globalData.serverUrl; //初始服务器地址
const srcUrl = app.globalData.srcUrl; //初始服务器地址
const cd = require('../module/common/config-data.js');
const util = require('../../utils/util.js');
//初始化可接受科目选择
let subjectDataInit = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    srcUrl: srcUrl,
    //幻灯片
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true, //是否采用衔接滑动
    interval: 5000, //间隔时间
    duration: 1000,
    certificate: null,
    bottomData: cd.bottomData,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //从端取数据
    //* 动态获取该id老师信息
    var id = options.id;
    //id = 10; 
    if (!id) {
      wx.showToast({
        title: "请首页进入",
        duration: 9999999,
        mask: true,
      })
      return;
    }
    this.setData({
      id: id,
      userid: app.globalData.teacherDetail['id'],
    })
    //console.log(id);
    this.getTeacher(id);
    this.followed();
    //*/
  },

  /**
   * 自定义查询老师列表的处理函数
   */
  getTeacher: function(id) {
    //* 动态读取数据
    var that = this;
    wx.request({
      url: serverUrl + 'teacher/id/' + id,
      method: 'GET',
      data: {},
      success: function(res) {
        //console.log(res.data);
        var dt = res.data['teacher'][0];
        var university = res.data['university']; //毕业院校
        var experience = res.data['experience']; //教育经历
        var certificate = res.data['certificate']; //证书
        var teacherScore = res.data['score']; //评分
        for (var x in certificate) {
          certificate[x]['certificate'] = srcUrl + certificate[x]['certificate'];
        }
        for (var x in teacherScore) {
          teacherScore[x]['content'] = teacherScore[x]['content'] ? teacherScore[x]['content'].replace(/<br\/>/g, '\n') : '';
        }
        if (dt) {
          dt['avatar'] = srcUrl + dt['avatar'];
          dt['grade'] = dt['grade'] ? dt['grade'].replace(/,/g, ' ') : '';
          dt['taught'] = dt['taught'] ? dt['taught'].replace(/,/g, ' ') : '';
          dt['gender'] = cd.dataDict.genderPic[dt['gender']];
          dt['scoreImg'] = Math.round(dt['score'] / 2);
          dt['distance'] = '';
          //获取地理位置
          wx.getLocation({
            type: 'wgs84',
            success: function(res) {
              dt['distance'] = util.distance(res.latitude, res.longitude, dt['latitude'], dt['longitude']);
              that.setData({
                teacherDetail: dt
              })
            }
          })
        }
        //console.log(dt);
        if (dt == null) {
          var toastText = '获取数据失败' + res.data.errMsg;
          wx.showToast({
            title: toastText,
            icon: '',
            duration: 2000 //弹出时间
          })
        } else {
          that.setData({
            teacherDetail: dt,
            university: university,
            experience: experience,
            certificate: certificate,
            teacherScore: teacherScore
          })
        }
      }
    })
  },

  /* 
   * 图片预览
   */
  previewImage(e) {
    const current = e.target.dataset.src;
    var certificate = this.data.certificate;
    for (var x in certificate) {
      certificate[x] = certificate[x]['certificate'];
    }
    //console.log(certificate);
    wx.previewImage({
      current,
      urls: certificate
    })
  },

  /**
   * 返回前一页
   */
  goBack: util.goBack,

  /* 
   * 联系Ta
   */
  wechatTa: function(e) {
    var wechat = '10086';
    util.wechatTa(wechat);
  },
  phoneTa: function(e) {
    var phone = '10086';
    util.phoneTa(phone);
  },

  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },

  /* 
   * 是否已经关注Ta
   */
  followed: function() {
    var p = {
      'touserid': this.data.id,
      'fromuserid': this.data.userid
    }
    var that = this;
    wx.request({
      url: serverUrl + 'teacherFollow/count',
      method: 'POST',
      data: p,
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        //console.log("followCount{res.data}:");
        //console.log(res.data);
        var list = res.data;
        if (!list[0]['count']) { //如果没数据
          //console.log('没数据');
          return false;
        } else {
          that.data.bottomData['bottomDataOne'] = '已关注';
          that.setData({
            bottomData: that.data.bottomData,
          })
        }
      }
    })
  },
  /* 
   * 如果没有关注则关注，关注则取消
   */
  follow: function(e) {
    if (this.data.bottomData['bottomDataOne'] == '已关注') {
      this.followDel();
    } else {
      this.toFollow();
    }
  },
  /* 
   * 关注Ta
   */
  toFollow: function() {
    var p = {
      'touserid': this.data.id,
      'fromuserid': this.data.userid
    }
    var that = this;
    wx.request({
      url: serverUrl + 'teacherFollow/add',
      method: 'POST',
      data: p,
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        //console.log("followAdd{res.data}:");
        //console.log(res.data);
        var list = res.data;
        if (!list['insertId']) { //如果没数据
          //console.log('没数据');
          return false;
        } else {
          //console.log('数据已添加,关注成功');
          that.data.bottomData['bottomDataOne'] = '已关注';
          that.setData({
            bottomData: that.data.bottomData,
          })
        }
      }
    })
  },
  /* 
   * 去掉关注Ta
   */
  followDel: function(e) {
    var p = {
      'touserid': this.data.id,
      'fromuserid': this.data.userid
    }
    var that = this;
    wx.request({
      url: serverUrl + 'teacherFollow/del',
      method: 'POST',
      data: p,
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        //console.log("followDel{res.data}:");
        //console.log(res.data);
        var list = res.data;
        if (!list['effectCount']) { //如果没数据
          //console.log('没数据');
          return false;
        } else {
          //console.log('数据已删除,关注成功');
          that.data.bottomData['bottomDataOne'] = '关注';
          that.setData({
            bottomData: that.data.bottomData,
          })
        }
      }
    })
  },

})