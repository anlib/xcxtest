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
    userid: app.globalData.teacherDetail['id'],
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
      "fromuserid": id
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
            ids.push(list[x]['touserid']);
          }
          var p = {
            "ids": ids
          }
          //console.log(p);
          ts.teacherList(p, serverUrl, that, pageSize);
        }
      }
    })
  },

  /* 
     * 如果没有关注则关注，关注则取消
     */
  follow: function (e) {
    var touserid = e.currentTarget.dataset.touserid;
    var followData = e.currentTarget.dataset.followdata;
    //console.log(touserid);
    //console.log(followData);
    if (followData == '关注') {
      this.toFollow(touserid);
    } else {
      this.followDel(touserid);
    }
  },
  /* 
   * 关注Ta
   */
  toFollow: function (touserid) {
    var p = {
      'touserid': touserid,
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
      success: function (res) {
        //console.log("followAdd{res.data}:");
        //console.log(res.data);
        var list = res.data;
        if (!list['insertId']) { //如果没数据
          //console.log('没数据');
          return false;
        } else {
          //console.log('数据已添加,关注成功');
          var teacherList = that.data.teacherList;
          for (var x in teacherList) {
            if (teacherList[x]['id'] == touserid) {
              teacherList[x]['followData'] = '已关注';
            }
          }
          that.setData({
            teacherList: teacherList,
          })
        }
      }
    })
  },

  /* 
  * 去掉关注Ta
  */
  followDel: function (touserid) {
    var p = {
      'touserid': touserid,
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
      success: function (res) {
        //console.log("followDel{res.data}:");
        //console.log(res.data);
        var list = res.data;
        if (!list['effectCount']) { //如果没数据
          //console.log('没数据');
          return false;
        } else {
          //console.log('数据已删除,关注成功');
          var teacherList = that.data.teacherList;
          for (var x in teacherList) {
            if (teacherList[x]['id'] == touserid){
              teacherList[x]['followData'] = '关注';
            }
          }
          that.setData({
            teacherList: teacherList,
          })
        }
      }
    })
  },

  /**
   * 返回前一页
   */
  goBack: util.goBack,

  /* 
   * 联系Ta
   */
  wechatTa: function (e) {
    var wechat = '10086';
    util.wechatTa(wechat);
  },
  phoneTa: function (e) {
    var phone = '10086';
    util.phoneTa(phone);
  },
})