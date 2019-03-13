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
    //分页设置
    currentPage: 1,
    pageSize: 5,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //从端取数据
    var listpid = options.id;
    //listpid = 1;
    if (!listpid) {
      wx.showToast({
        title: "请首页进入",
        duration: 9999999,
        mask: true,
      })
      return;
    }
    this.searchTeacherScore(listpid);
    this.getTeacher(listpid);
    this.setData({
      listpid: listpid,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    });
    this.setData({
      currentPage: this.data.currentPage + 1,
    });
    this.searchTeacherScore(this.data.listpid);
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 2000);
  },

  /**
   * 页面相关事件处理函数--停止监听用户下拉动作
   * <button bindtap="stopPullDownRefresh">停止刷新</button>
   */
  stopPullDownRefresh() {
    wx.stopPullDownRefresh({
      complete(res) {
        wx.hideToast()
      }
    })
  },

  /**
    * 页面上拉触底事件的处理函数
    */
  onReachBottom: function () {
    this.setData({
      currentPage: this.data.currentPage + 1,
    });
    this.searchTeacherScore(this.data.listpid);
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 2000);
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
        dt['scoreImg'] = Math.round(dt['score'] / 2);
        //console.log(dt);
        that.setData({
          teacherDetail: dt,
        })
      }
    })
  },

  searchTeacherScore: function(id) {
    //console.log(p);
    var p = {};
    p['listpid'] = id;
    //* 动态读取数据
    var that = this;
    wx.request({
      url: serverUrl + 'teacherScore/list/' + that.data.currentPage + '/' + that.data.pageSize,
      method: 'POST',
      data: p,
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        //console.log(res.data);
        var list = res.data;
        //console.log(list[0]);
        //如果没数据
        if (!list[0]) {
          //console.log('没数据了别拉了');
          that.setData({
            listBottom: true,
          })
          return;
        }
        for (var x in list) {
          list[x]['content'] = list[x]['content'].replace(/<br\/>/g, '\n');
        }
        that.setTeacherSroceList(list);
        if (list == null) {
          var toastText = '获取数据失败' + res.data.errMsg;
          wx.showToast({
            title: toastText,
            icon: '',
            duration: 2000 //弹出时间
          })
        }
      }
    })
  },

  /* 
   * set data teacherList
   */
  setTeacherSroceList: function(list) {
    //把已加载的数据与新数据拼接
    var teacherScore = this.data.teacherScore;
    if (this.data.currentPage > 0 && teacherScore != null) {
      //console.log("teacherList : " + teacherList)
      list = teacherScore.concat(list);
    } else {
      teacherScore = list;
    }
    this.setData({
      teacherScore: list
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
