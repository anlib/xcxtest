const app = getApp();
const serverUrl = app.globalData.serverUrl; //初始服务器地址
const srcUrl = app.globalData.srcUrl; //初始服务器地址
const util = require('../../utils/util.js');
const cd = require('../module/common/config-data.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    teacherDetail: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var teacherDetail = app.globalData.teacherDetail;
    var pid = teacherDetail['id'];
    //console.log(app.globalData.userid == pid);
    if (app.globalData.userid == pid) {
      this.setData({
        isMyself: true,
        bottomData: cd.bottomDataisMyself,
        pid: pid,
      });
      //console.log(this.data.bottomData);
    } else {
      //本页只能用户本人查看操作
      return;
    }
    //从后端取数据
    var that = this;
    wx.request({
      url: serverUrl + 'teacherCertificate/pid/' + pid,
      method: 'POST',
      data: {},
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        //console.log(res.data);
        var teacherDetail = res.data;
        for (var x in teacherDetail) {
          teacherDetail[x]['certificate'] = srcUrl + teacherDetail[x]['certificate'] + '.jpg';
        }
        that.setData({
          teacherDetail: teacherDetail,
        })
      }
    })
  },

  /**
   * 上传照片//选择图片时限制9张，如需超过9张，同理亦可参照此方法上传多张照片
   */
  uploadImg: function() {
    var teacherDetailLength = this.data.teacherDetail.length;
    //console.log(teacherDetail.length);
    if (teacherDetailLength > 20) {
      wx.showToast({
        title: '最多可加21张',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var successUp = 0; //成功
        var failUp = 0; //失败
        var length = res.tempFilePaths.length; //总数
        var count = 0; //第几张
        that.uploadOneByOne(res.tempFilePaths, successUp, failUp, count, length);
      },
    });
  },

  /**
   * 采用递归的方式上传多张
   */
  uploadOneByOne(imgPaths, successUp, failUp, count, length) {
    var pid = this.data.pid;
    var that = this;
    wx.showLoading({
      title: '正在上传第' + count + '张',
    })
    wx.uploadFile({
      url: serverUrl + '/teacherCertificate/upload/' + pid,
      filePath: imgPaths[count],
      name: 'file', //示例，使用顺序给文件命名
      success: function(res) {
        //console.log(res.data);
        //console.log(res.data.length);
        if (res.data.length > 2) {
          successUp++; //成功+1
          var list = new Object();
          list['certificate'] = srcUrl + JSON.parse(res.data) + '.jpg';
          var teacherDetail = that.data.teacherDetail;
          teacherDetail.unshift(list);
          that.setData({
            teacherDetail: teacherDetail,
          })
          //console.log(teacherDetail);
          //console.log(teacherDetail.length);
          if (teacherDetail.length > 20) {
            wx.showToast({
              title: '最多可加21张',
              icon: 'success',
              duration: 2000
            })
            return;
          }
          //上面等修改
        }
      },
      fail: function(res) {
        failUp++; //失败+1
      },
      complete: function(res) {
        count++; //下一张
        if (count == length) {
          //上传完毕，作一下提示
          //console.log('上传成功' + successUp + ',' + '失败' + failUp);
          if (successUp) {
            var title = '上传成功' + successUp + '张';
          } else {
            var title = '检查图片格式';
          }
          wx.showToast({
            title: title,
            icon: 'success',
            duration: 2000
          })
        } else {
          //递归调用，上传下一张
          that.uploadOneByOne(imgPaths, successUp, failUp, count, length);
          //console.log('正在上传第' + count + '张');
        }
      }
    })
  },

  /* 
   * 图片预览
   */
  previewImage(e) {
    const current = e.target.dataset.src;
    var certificate = this.data.teacherDetail;
    for (var x in certificate) {
      certificate[x] = certificate[x]['certificate'];
    }
    console.log(certificate);
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
  wechatTa: function (e) {
    var wechat = '10086';
    util.wechatTa(wechat);
  },
  phoneTa: function (e) {
    var phone = '10086';
    util.phoneTa(phone);
  },
  


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})