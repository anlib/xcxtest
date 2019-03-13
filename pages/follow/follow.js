const app = getApp();
const serverUrl = app.globalData.serverUrl; //初始服务器地址
const srcUrl = app.globalData.srcUrl; //初始服务器地址
const ts = require('../module/myinfo/teacher-server/teacher-server.js');
const util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    listBottom: false,
    teacherList: null,
    srcUrl: srcUrl,
    currentPage: 1,
    pageSize: 7,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //需要动态数据调整，暂时赋值；
    this.followList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //console.log('onReachBottom', new Date());
    this.setData({
      currentPage: this.data.currentPage + 1,
    });
    this.followList();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 2000);
  },

  followList: function() {
    //ids需要后端读数据
    var that = this;
    var teacherDetail = wx.getStorageSync('teacherDetail');
    var id = teacherDetail.id;
    if (!id) {
      return;
    }
    var p = {
      "touserid": id
    }
    //console.log(p);
    var currentPage = this.data.currentPage;
    var pageSize = this.data.pageSize;
    //var myThis = this;
    wx.request({
      url: serverUrl + 'teacherFollow/list/' + currentPage + '/' + pageSize,
      method: 'POST',
      data: p,
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //console.log("followList{res.data}:");
        //console.log(res.data);
        var list = res.data;
        //如果没数据
        if (!list[0]) {
          //console.log('没数据');
          that.setData({
            listBottom: true,
          })
          return false;
        } else {
          var ids = [];
          for (var x in list) {
            ids.push(list[x]['fromuserid']);
          }
          var p = {
            "ids": ids
          }
          //console.log(p);
          ts.teacherList(p, serverUrl, that, pageSize);
        }
      }
    })
   
    /*
    var list = [{
        id: 1,
        followed: 1,
        avatar: "../../image/avatar_01.png",
        teacherName: "张老师",
        genderPic: "../../image/gender_1.png",
        university: "澳大利亚美利坚合众国外国语工程总设计部位专攻英语大学",
        education: "本科",
        graduation: "专职教师",
        grade: "初中",
        subject: ["语文", "英语"],
        auth: "已认证",
        link: false,
      },
      {
        id: 2,
        followed: 1,
        avatar: "../../image/avatar_01.png",
        genderPic: "../../image/gender_2.png",
        teacherName: "李老师",
        university: "北京外国语大学",
        education: "本科",
        graduation: "大学生/毕业生",
        grade: "音乐",
        subject: ["钢琴", "小提琴", "尤克里里"],
        auth: "已认证",
        link: "13000000000",
      },
    ];

    that.setData({
      followList: followList,
    });
    //*/
  },


  /**
   * 返回前一页
   */
  goBack: util.goBack,

  /* 
   * 联系Ta
   */
  wechatTa: util.wechatTa,
  phoneTa: function (e) {
    var phone = '10086';
    util.phoneTa(phone);
  },

})