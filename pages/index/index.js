
Page({
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: 'page/swiper/swiper'
    }
  },

  data: {
    //首页上部切换
    background: [
      { pic: '../image/test1.png' },
      { pic: '../image/test2.png' },
      { pic: '../image/test3.png' }
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,

    //幻灯片下面的导航
    menu: [
      { name: '科目' },
      { name: '区域' },
      { name: '教员类型' },
      { name: '筛选' }
    ],
    shownavindex: ''

  },


  //选择
  list: function (e) {
    if (this.data.nzopen) {
      this.setData({
        shownavindex: 0
      })
    } else {
      this.setData({
        shownavindex: e.currentTarget.dataset.nav
      })
    }

    console.log(e.currentTarget.dataset.nav);
  },

})

