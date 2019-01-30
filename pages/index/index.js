Page({
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: 'page/swiper/swiper'
    }
  },

  data: {
    background: [
      { pic: '../image/test1.png' },
      { pic: '../image/test2.png' },
      { pic: '../image/test3.png' }
      ],
    
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500
  }

})
