const app = getApp();
const serverUrl = app.globalData.serverUrl; //初始服务器地址
const srcUrl = app.globalData.srcUrl; //初始服务器地址
const util = require('../../utils/util.js');
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
    //console.log(app.globalData.teacherDetail);
    var teacherDetail = app.globalData.teacherDetail;
    var pid = teacherDetail['id'];
    this.setData({
      pid: pid,
    })
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
      success: function (res) {
        //console.log(res.data);
        var teacherDetail = res.data;
        for (var x in teacherDetail) {
          teacherDetail[x]['certificate'] = srcUrl + teacherDetail[x]['certificate'];
        }
        //console.log(teacherDetail);
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
    if (teacherDetailLength > 20){
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
      url: serverUrl + '/teacherCertificate/upload/' + pid, //仅为示例，非真实的接口地址
      filePath: imgPaths[count],
      name: 'file', //示例，使用顺序给文件命名
      success: function(res) {
        //console.log(res.data);
        //console.log(res.data.length);
        if (res.data.length > 2) {
          successUp++; //成功+1
          //等修改
          //console.log(res.data);
          var list = new Array();
          list['certificate'] = new Array();
          list['certificate'].push(imgPaths[count]);
          var teacherDetail = that.data.teacherDetail;
          //console.log(teacherDetail);
          console.log(list);
          teacherDetail = list.concat(teacherDetail);
          console.log(teacherDetail);
          that.setData({
            teacherDetail: teacherDetail,
          })
          var teacherDetailLength = teacherDetail.length;
          if (teacherDetailLength > 20) {
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
  wechatTa: util.wechatTa,
  phoneTa: util.phoneTa,


})