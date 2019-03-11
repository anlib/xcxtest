const app = getApp();
const serverUrl = app.globalData.serverUrl; //初始服务器地址
const srcUrl = app.globalData.srcUrl; //初始服务器地址
const util = require('../../utils/util.js');
//初始化可接受科目选择
let subjectDataInit = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listBottom: false,
    transactionList: null,
    srcUrl: srcUrl,
    currentPage: 1,
    pageSize: 7,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //从端取数据transaction
    this.transactionList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    //console.log('onReachBottom', new Date());
    this.setData({
      currentPage: this.data.currentPage + 1,
    });
    this.transactionList();
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 2000);
  },

  transactionList: function() {
    //ids需要后端读数据
    var that = this;
    var teacherDetail = wx.getStorageSync('teacherDetail');
    var id = teacherDetail.id;
    if (!id) {
      return;
    }
    var p = {
      "status": 1,
      "listpid": id,
    }
    //console.log(p);
    var currentPage = this.data.currentPage;
    var pageSize = this.data.pageSize;
    wx.request({
      url: serverUrl + 'teacherStatement/list/' + currentPage + '/' + pageSize,
      method: 'POST',
      data: p,
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        //console.log("transactionList{res.data}:");
        //console.log(res.data);
        var transactionList = res.data;
        //如果没数据
        if (!transactionList[0]) {
          //console.log('没数据');
          that.setData({
            listBottom: true,
          })
          return false;
        } else {
          var ids = [];
          for (var x in transactionList) {
            ids.push(transactionList[x]['forteacher']);
          }
          var p = {
            "ids": ids
          }
          //console.log(p);
          // ts.teacherList(p, serverUrl, that, pageSize);
          wx.request({
            url: serverUrl + 'teacher/list/1/' + pageSize,
            method: 'POST',
            data: p,
            //contentType: 'application/json;charset=utf-8',
            //header: {
             // 'Content-Type': 'application/json'
            //},
            success: function(res) {
              //console.log("teacherList{res.data}:");
              //console.log(res.data);
              var teacherList = res.data;
              //如果没数据
              if (!teacherList[0]) {
                //console.log('没数据');
                that.setData({
                  listBottom: true,
                })
                return false;
              } else {
                var teacherListTemp = new Array()
                for (var x in teacherList) {
                  id = teacherList[x]['id'];
                  teacherListTemp[id] = new Array();
                  teacherListTemp[id]['teacher'] = teacherList[x]['teacher'];
                  teacherListTemp[id]['avatar'] = teacherList[x]['avatar'];
                  teacherListTemp[id]['graduation'] = teacherList[x]['graduation'];
                }
                for (var x in transactionList) {
                  var id = transactionList[x]['forteacher'];
                  transactionList[x]['teacher'] = teacherListTemp[id]['teacher'];
                  transactionList[x]['avatar'] = srcUrl + teacherListTemp[id]['avatar'];
                  transactionList[x]['graduation'] = teacherListTemp[id]['graduation'];
                  if (transactionList[x]['type'] == 2){
                    transactionList[x]['typeVal'] = '个月';
                  } 
                  if (transactionList[x]['type'] == 3) {
                    transactionList[x]['typeVal'] = '年';
                  }
                }
                //console.log(transactionList)
                that.setData({
                  transactionList: transactionList
                });
              }
            }
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

})