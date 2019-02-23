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
    //从端取数据
    var teacherDetail = [{ 
      certificate: "../../image/sys-place.png",
      active: 1,
    },
      {
        certificate: "../../image/sys-place.png",
        active: 1,
      }, {
        certificate: "../../image/sys-place.png",
        active: 1,
      }, {
        certificate: "../../image/sys-place.png",
        active: 1,
      }, {
        certificate: "../../image/sys-place.png",
        active: 1,
      }, {
        certificate: "../../image/sys-place.png",
        active: 1,
      }, {
        certificate: "../../image/sys-place.png",
        active: 1,
      },
    ];
    this.setData({
      teacherDetail: teacherDetail,
    });
  },

  /* 
   * 照片
   */

  chooseImage() {
    const self = this
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed', 'original'],
      sourceType: ['camera', 'album'],
      success(res) {
        console.log('chooseImage success, temp path is', res.tempFilePaths[0])
        const filePath = res.tempFilePaths[0]
        wx.showLoading({
          title: '上传中'
        })
        wx.uploadFile({
          url: 'https://localhost/save',
          filePath: filePath,　//待上传的图片，由 chooseImage获得
          name: 'food_image',
          formData: {
            latitude: 0.0,
            longitude: 0.0,
            restaurant_id: 0,
            city: '北京',
            name: 'beijing' // 名称
          }, // HTTP 请求中其他额外的 form data
          success: function (res) {
            console.log("addfood success", res);
          },
          fail: function (res) {
            console.log("addfood fail", res);
          },
        })
      },
      fail({ errMsg }) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })
  },

/*
* 使用拍照图片test，可以删除
*/
  chooseImagex() {
    const that = this
    const sourceType = [['camera'], ['album'], ['camera', 'album']]
    const sizeType = [['compressed'], ['original'], ['compressed', 'original']]

    wx.chooseImage({
      sourceType: sourceType[2],
      sizeType: sizeType[2],
      count: 9,
      success(res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
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
