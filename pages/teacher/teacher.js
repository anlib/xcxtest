const cm = require('../module/common/common.js');
const util = require('../../utils/util.js');
const app = getApp();
const serverUrl = app.globalData.serverUrl; //初始服务器地址
const srcUrl = app.globalData.srcUrl; //初始服务器地址

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    /*
    //从端取数据
    var teacherDetail = {
      avatar: "../../image/avatar_01.png",
      teacherName: "张老师",
      score: '8',
      distance: "0.77km",
      university: "澳大利亚美利坚合众国外国语工程总设计部位专攻英语大学",
      lastLongin: "3分钟前",
      graduation: "专职教师",
      grade: "初中",
      subject: ["语文", "英语"],
      auth: "已认证",
      price: "￥300/小时 起",
    };
    this.setData({
      teacherDetail: teacherDetail,
    });
    //*/

    //* 动态获取该id老师信息
    var id = options.id;
    //id = 1; 
    if (!id){
      wx.showToast({
        title: "请首页进入",
        duration: 9999999,
        mask: true,
      })
      return;
    }
    this.setData({
      id: id
    })
    //console.log(id);
    this.getTeacher(id);
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
        console.log(res.data);
        var dt = res.data['teacher'][0];
        var university = res.data['university']; //毕业院校
        var experience = res.data['experience']; //教育经历
        var certificate = res.data['certificate']; //证书
        var teacherScore = res.data['score']; //
        for (var x in teacherScore) {
          teacherScore[x]['content'] = teacherScore[x]['content'].replace(/<br\/>/g, '\n');
        }
        if (dt) {
          dt['avatar'] = srcUrl + dt['avatar'];
          dt['grade'] = dt['grade'].replace(/,/g, ' ');
          dt['taught'] = dt['taught'].replace(/,/g, ' ');
          dt['gender'] = cm.dataDict.genderPic[dt['gender']];
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
        console.log(dt);

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
   * 联系TA
   */
  linkTa(e) {
    console.log('发送选择改变，id携带值为', e.currentTarget.dataset.id);
    var back = followList.linkTa(e, this);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})