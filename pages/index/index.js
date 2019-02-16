//var cityData = require('../common/city.js');
const app = getApp();
const menuFirst = ['综合排序', '科目', '区域', '筛选'];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //设置初始化
    serverUrl: app.globalData.serverUrl, //初始服务器地址
    //幻灯片
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    //过滤选择
    pxopen: false,
    showNavIndex: '',
    weiZhi: "北京市",
    subjectNext: null,
    selected: [{}, {}, {}, {} ], //筛选中选中第几个记录

    //首页上部切换北京图片
    background: [{
      pic: '../image/banner_01.png',
        url: '../teacherlist/teacherlist',
      },
      {
        pic: '../image/banner_02.png',
        url: '../test/test',
      },
      {
        pic: '../image/banner_03.png',
        url: 'index',
      }
    ],

    //幻灯片下面的导航数据
    menu: menuFirst,
    menuData: {
      //排序
      order: ["综合排序", "距离最近", "教学经验", "评价最高", "价格最低", "价格最高"],
      //获取科目
      subjectData: [{
          "i": "不限",
          "v": ""
        },
        {
          "i": "小学",
          "v": ["不限", "数学", "英语", "语文"]
        },
        {
          "i": "初中",
          "v": ["不限", "数学", "英语", "语文", "物理", "化学", "地理", "历史"]
        }
      ],
      //获取地区
      areaData: ["不限", "东城", "西城", "崇文", "宣武", "朝阳", "丰台", "石景山", "海淀", "门头沟", "房山", "通州", "顺义", "昌平", "大兴", "怀柔", "平谷", "密云", "延庆"],
      //获取老师类型
      gender: ["男", "女"],
      experience: ["5年以下", "5-10年", "10年以上"],
    },
  },

  /**
   * 幻灯片上url跳转
   */
  slider: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },

  /**
   * 过滤菜单条件选择
   */
  menuList: function(e) {
    //console.log(e);
    if (this.data.pxopen &&
      this.data.showNavIndex === e.currentTarget.dataset.nav) {
      this.setData({
        showNavIndex: '',
        pxopen: false,
      })
    } else {
      this.setData({
        showNavIndex: e.currentTarget.dataset.nav,
        pxopen: true,
      })
    }
    //选择的第index+1个
    //console.log("选择的第几个:" + (e.currentTarget.dataset.nav + 1));
  },

  /**
   * 选择科目二级菜单
   */
  selectNext: function(e) {
    var value = null;
    if (e.currentTarget.dataset.value == "不限") {
      this.data.menu[this.data.showNavIndex] = menuFirst[this.data.showNavIndex];
      //赋全局变量，收回下拉菜单
      this.setData({
        showNavIndex: "",
        pxopen: false,
        subjectNext: null,
      });
    } else {
      this.data.menu[this.data.showNavIndex] = e.currentTarget.dataset.value;
      //console.log(this.data.menuData.subjectData[e.currentTarget.dataset.nav]);
      this.setData({
        //给下一级赋值(value)并携带父节点值(per)
        subjectNext: {
          "showNavIndex": this.data.showNavIndex,
          "per": e.currentTarget.dataset.value,
          "value": this.data.menuData.subjectData[e.currentTarget.dataset.nav]["v"],
        },
      });
    }
    //设置全局的菜单的值并把已有的选择值清空
    this.setData({
      menu: this.data.menu,
    });
    //console.log("e.currentTarget.dataset.value：" + e.currentTarget.dataset.value);
  },

  /**
   * 菜单过滤下面的详细条件选择
   */
  selectitem: function(e) {
    if (this.data.subjectNext == null) {
      this.data.subjectNext = {
        "per": null
      };
    }
    //console.log(this.data.subjectNext);
    if (e.currentTarget.dataset.item) {
      if (this.data.subjectNext.per &&
        this.data.subjectNext.showNavIndex === this.data.showNavIndex) {
        //有二级
        if (e.currentTarget.dataset.item == "不限") {
          this.data.menu[this.data.showNavIndex] = this.data.subjectNext.per;
        } else {
          this.data.menu[this.data.showNavIndex] = this.data.subjectNext.per + ":" +
            e.currentTarget.dataset.item;
        }
      } else {
        //没有二级
        if (e.currentTarget.dataset.item == "不限") {
          this.data.menu[this.data.showNavIndex] = menuFirst[this.data.showNavIndex];
        } else {
          this.data.menu[this.data.showNavIndex] = e.currentTarget.dataset.item;
        }
      }
    }
    //重新赋值全局变量
    this.setData({
      menu: this.data.menu,
      showNavIndex: '',
      pxopen: false,
    });
    //console.log(this.data.menu);
  },

  /* 
   * 选中区域添加input值
   */
  filteritem: function(e) {
    var data = {}; //设置一个data变量，开始赋值
    //选中给隐藏input赋值
    var dataName = e.currentTarget.dataset.input;
    data[dataName] = e.currentTarget.dataset.item;
    //选中变色标识
    //console.log(this.data.selected);
    this.data.selected[this.data.showNavIndex][dataName] = e.currentTarget.dataset.item;
    data["selected"] = this.data.selected;
    //console.log(data);
    //重新赋值全局变量
    this.setData(data);
  },

  /* 
   * 提交form
   */
  formSubmit(e) {
    // 提交
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    // 关闭筛选菜单
    this.setData({
      showNavIndex: '',
      pxopen: false,
    });
  },
 /* 
   * 重置form表单
   */
  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.data.selected[this.data.showNavIndex] = {};
    //重新赋值全局变量
    this.setData({
      selected: this.data.selected,
    })
  },

  hidebg: function(e) {
    //重新赋值全局变量
    this.setData({
      showNavIndex: '',
      pxopen: false,
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: 'index',
      path: 'page/index/index',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(this.data.menuData);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
    //list赋值
    var teacherList = [
        {
        avatar: "../image/avatar_01.png",
        genderPic: "../image/gender_1.png",
        teacherName: "张老师",
        university: "澳大利亚美利坚合众国外国语工程总设计部位专攻英语大学",
      },
      {
        avatar: "../image/avatar_01.png",
        genderPic: "../image/gender_2.png",
        teacherName: "李老师",
        university: "北京外国语大学",
      },
      {
        avatar: "../image/avatar_01.png",
        genderPic: "../image/gender_2.png",
        teacherName: "李老师",
        university: "北京外国语大学",
      },
      ];
    console.log(teacherList);
    this.setData({
      teacherList: teacherList
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //var that = this;
    /*
    wx.request({
      url: that.data.serverUrl + 'superadmin/listarea',
      method: 'GET',
      data: {},
      success: function (res) {
        var list = res.data.areaList;
        if (list == null) {
          var toastText = '获取数据失败' + res.data.errMsg;
          wx.showToast({
            title: toastText,
            icon: '',
            duration: 2000 //弹出时间
          })
        } else {
          that.setData({
            list: list
          })
        }
      }
    })
    */
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

})
/*//..... 参考 语法
 this.data.numberArray = [this.data.numberArray.length + 1].concat(this.data.numberArray)
*/