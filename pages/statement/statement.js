const app = getApp();
const serverUrl = app.globalData.serverUrl; //初始服务器地址
const srcUrl = app.globalData.srcUrl; //初始服务器地址
const util = require('../../utils/util.js');
const cd = require('../module/common/config-data.js');
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
    scoreImgList: cd.scoreImgList,
    scoreFlag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var teacherDetail = wx.getStorageSync('teacherDetail');
    var id = teacherDetail.id;
    if (app.globalData.userid == id) {
      this.setData({
        isMyself: true,
        bottomData: cd.bottomDataisMyself,
        id: id,
      });
    } else {
      //本页只能用户本人查看操作
      return;
    }
    //从端取数据transaction
    this.transactionList();
  },
  //显示提交评价页面
  scoreFlag: function(e) {
    this.setData({
      scoreFlag: true,
      bottomHidden: true,
      statementid: parseInt(e.currentTarget.dataset.statementid),
      forteacher: parseInt(e.currentTarget.dataset.forteacher)
    });
    wx.setNavigationBarTitle({
      title: '评价'
    });
  },
  /*
   * 点击分数和星星
   */
  scoreCount: function(e) {
    //console.log(e);
    var count = e.currentTarget.dataset.count;
    //console.log(count);
    var scoreImgList = this.data.scoreImgList;
    for (var i = 1; i <= 5; i++) {
      if (count == 1 && scoreImgList[1] == 'light' && scoreImgList[2] == 'gray') {
        scoreImgList[i] = 'gray';
        if (i == 1) count = 0;
      } else if (i <= count) {
        scoreImgList[i] = 'light';
      } else {
        scoreImgList[i] = 'gray';
      }
    }
    //console.log(scoreImgList);
    var scoreCount = count * 2;
    //console.log(scoreCount);
    this.setData({
      scoreImgList: this.data.scoreImgList,
      scoreCount: scoreCount,
    })
  },

  /* 
   * 提交form
   */
  formSubmit(e) {
    //console.log(e)
    //console.log('form发生了submit事件，携带数据为：', e.detail.value);
    if (e.detail.value.content == '' || !e.detail.value.content || !this.data.scoreCount){
      wx.showToast({
        title: '请评价或评分',
        icon: 'none',
        duration: 2000
      });
      return;
    }
      //console.log(this.data.scoreCount);
      var p = {
        'statementid': this.data.statementid,
        'score': this.data.scoreCount,
        'content': e.detail.value.content,
        'fromuserid': this.data.id,
        'listpid': this.data.forteacher,
      };
      //post 提交 
      this.insertScore(p); //记录本条评价
      //this.averageScore(p); //更新平均平均分数
    this.setData({
      scoreFlag: false,
      bottomHidden: false,
      textareaData: ''
    });
  },

  /* 
   * insert评价老师,在后端update评价老师的平均分数
   */
  insertScore: function(p) {
    console.log(p);
    if (!p) {
      return;
    }
    var that = this;
    wx.request({
      url: serverUrl + 'teacherScore/add',
      method: 'POST',
      data: p,
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res.data);
        var list = res.data;
        if (!list['effectCount']) { //如果没数据
          console.log('没数据');
          return false;
        } else {
          console.log('数据已提交成功');
          wx.showToast({
            title: '评价已提交',
            icon: 'success',
            duration: 2000
          });
          that.setData({
            scoreCount: null,
            scoreImgList: cd.scoreImgList
          });
        }
      }
    })
  },

  /* 
   * 重置form表单
   */
  formReset(e) {
    //重新赋值全局变量
    this.setData({
      scoreFlag: false,
      bottomHidden: false,
    })
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
                  if (transactionList[x]['type'] == 2) {
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
  wechatTa: function(e) {
    var wechat = '10086';
    util.wechatTa(wechat);
  },
  phoneTa: function(e) {
    var phone = '10086';
    util.phoneTa(phone);
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})