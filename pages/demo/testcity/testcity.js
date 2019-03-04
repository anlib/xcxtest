var cityData = require('./city.js');
Page({
  data: {
    //选择的终点城市暂存数据
    endselect: "",
    //终点缓存的五个城市
    endcitys: [],
    //用户选择省份之后对应的城市和县城
    endkeys: {},
    //用户选择县城
    town: [],
    //所有车长
    commanders: cityData.getcommanders(),
    //所有车型
    models: cityData.getmodels(),
    //选中的车长
    commander: "",
    //选中的车型
    model: "",
    displaycity: 0,
    city: "起点",
    city1: "目的地",
    //车型
    model: "车长车型",
    qyopen: false,
    qyshow: true,
    nzopen: false,
    pxopen: false,
    nzshow: true,
    pxshow: true,
    isfull: false,
    cityleft: cityData.getCity(),
    citycenter: {},
    cityright: {},
    select1: '',
    select2: '',
    select3: '',
    shownavindex: ''
  },

  onLoad: function (options) {
    var that = this
    var province = ""
    var city = ""
    var demo = new QQMapWX({
      key: '你的腾讯地图apikey' // 必填
    });
    //先进行一次最近的数据刷新

    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userLocation" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              //获取地理位置
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  console.log(res)
                  var latitude = res.latitude
                  var longitude = res.longitude
                  // 调用腾讯地图的接口查询当前位置
                  demo.reverseGeocoder({
                    location: {
                      latitude: latitude,
                      longitude: longitude
                    },
                    success: function (res) {
                      console.log(res)
                      province = res.result.address_component.province
                      city = res.result.address_component.city
                      that.setData({ city: city })
                      //获取数据更新页面


                    },
                    fail: function (res) {
                      console.log(res);
                    },
                    complete: function (res) {
                      // console.log(res);
                    }
                  });
                }
              })
            }
          })
        }
      }
    })
  },
  //选择起点
  listqy: function (e) {
    if (this.data.qyopen) {
      this.setData({
        qyopen: false,
        nzopen: false,
        pxopen: false,
        nzshow: true,
        pxshow: true,
        qyshow: false,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        qyopen: true,
        pxopen: false,
        nzopen: false,
        nzshow: true,
        pxshow: true,
        qyshow: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }

  },
  //目的地选择终点
  list: function (e) {
    if (this.data.nzopen) {
      this.setData({
        nzopen: false,
        pxopen: false,
        qyopen: false,
        nzshow: false,
        pxshow: true,
        qyshow: true,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        content: this.data.nv,
        nzopen: true,
        pxopen: false,
        qyopen: false,
        nzshow: false,
        pxshow: true,
        qyshow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
  },
  //选择车型
  listpx: function (e) {
    if (this.data.pxopen) {
      this.setData({
        nzopen: false,
        pxopen: false,
        qyopen: false,
        nzshow: true,
        pxshow: false,
        qyshow: true,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        nzopen: false,
        pxopen: true,
        qyopen: false,
        nzshow: true,
        pxshow: false,
        qyshow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
    console.log(e.target)
  },
  selectleft: function (e) {

    this.setData({
      cityright: {},
      citycenter: this.data.cityleft[e.currentTarget.dataset.city],
      city: e.target.dataset.city,
      select1: e.target.dataset.city,
      select2: '',
      select3: ''
    });
  },
  selectcenter: function (e) {

    this.setData({
      cityright: this.data.citycenter[e.currentTarget.dataset.city],
      select2: e.target.dataset.city,
      select3: '',
      city: e.target.dataset.city
    });
    //地区选择完毕
  },
  selectcity: function (e) {
    console.log(e)
    this.setData({
      city: this.data.cityright[e.target.dataset.city],
      select3: this.data.cityright[e.target.dataset.city]
    });
  },
  hidebg: function (e) {

    this.setData({
      qyopen: false,
      nzopen: false,
      pxopen: false,
      nzshow: true,
      pxshow: true,
      qyshow: true,
      isfull: false,
      shownavindex: 0
    })
  },
  //选择了终点的某一项
  selectsdbitem: function (e) {
    var cityleft = this.data.cityleft
    console.log(e.target.dataset.city)
    this.setData({
      endkeys: cityleft[e.target.dataset.city],
      displaycity: 1,
      endselect: e.target.dataset.city
    });
  },
  //用户选择某个市级地区的时候触发
  selectsdbendkey: function (e) {

    var endkeys = this.data.endkeys
    console.log(e.target.dataset.city)
    this.setData({
      town: endkeys[e.target.dataset.city],
      displaycity: 2,
      endselect: e.target.dataset.city
    });
  },
  //选择五个地区
  selectcityend: function (e) {
    console.log(e.target.dataset.city)
    var endcity = e.target.dataset.city
    var endcitys = this.data.endcitys
    if (endcitys.length == 0) {
      endcitys.push(endcity)
    } else {
      for (var i = 0; i < endcitys.length; i++) {
        if (endcitys[i] == endcity) {
          //删除这个下标的元素
          endcitys.splice(i, 1);
          //跳出循环
          break
        } else if (i == endcitys.length - 1) {
          console.log(i)
          if (i >= 5) {
            wx.showToast({
              title: '最多选五个终点',
              icon: 'warn',
              duration: 2000
            })
          } else {
            endcitys.push(endcity)
          }
          break
        }
      }
    }
    this.setData({ endcitys: endcitys })
  },
  //清空all已选择的地区
  emptyallendcity: function () {
    var endcitys = []
    this.setData({ endcitys: endcitys })
  },
  //清除选中的项
  emptyitem: function (e) {
    var endcitys = this.data.endcitys
    console.log(e.target.dataset.endcity)
    endcitys.splice(e.target.dataset.endcity, 1);
    this.setData({ endcitys: endcitys })
  },
  //返回上一级
  returnupper: function () {
    var displaycity = this.data.displaycity
    console.log(displaycity)
    if (displaycity == 1) {
      displaycity = 0
    } else if (displaycity == 2) {
      displaycity = 1
    } else {
      displaycity = 0
    }
    this.setData({ displaycity: displaycity, endselect: "" })
  },
  //确定终点
  determineend: function () {

  },
  //确定车型车长
  determinecar: function () {

  },
  //选中车长的某个项
  selectcmditem: function (e) {
    var commander = e.target.dataset.commander
    this.setData({ commander: commander })
  },
  //选中车型的某个项
  selectmdlitem: function (e) {
    var model = e.target.dataset.model
    this.setData({ model: model })
  }

})