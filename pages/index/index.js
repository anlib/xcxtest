const cd = require('../module/common/config-data.js');
const util = require('../../utils/util.js');
const app = getApp();
const serverUrl = app.globalData.serverUrl; //初始服务器地址
const srcUrl = app.globalData.srcUrl; //初始服务器地址

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //设置初始化
    hasHiddenTabBar: false,
    //幻灯片
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true, //是否采用衔接滑动
    interval: 2000,
    duration: 500,
    //过滤选择
    pxopen: false,
    showNavIndex: '',
    weiZhi: "北京市",
    subjectNext: null,
    selected: [{}, {}, {}, {}], //筛选中选中第几个记录
    formData: {},
    //首页上部切换北京图片
    background: cd.indexBackground,
    //幻灯片下面的导航数据
    menu: cd.menuFirst,
    menuData: {
      //排序
      order: cd.menuOrder,
      //获取科目
      subjectData: cd.menuSubjectData,
      //获取地区
      areaData: cd.menuAreaData,
      //获取老师类型
      gender: cd.menuGender,
      experience: cd.menuExperience,
    },
    //分页设置
    currentPage: 1,
    pageSize: 5,
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
      this.data.menu[this.data.showNavIndex] = cd.menuFirst[this.data.showNavIndex];
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
          this.data.menu[this.data.showNavIndex] = cd.menuFirst[this.data.showNavIndex];
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
    this.searchTeacher();
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
    //console.log('form发生了submit事件，携带数据为：', e.detail.value);
    // 关闭筛选菜单
    this.setData({
      formData: e.detail.value,
      showNavIndex: '',
      pxopen: false,
    });
    this.searchTeacher();
  },
  /* 
   * 重置form表单
   */
  formReset(e) {
    //console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.data.selected[this.data.showNavIndex] = {};
    //重新赋值全局变量
    this.setData({
      selected: this.data.selected,
      formData: e.detail.value,
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
    /* 静态测试数据
    var teacherList = [{
        'id': 1,
        avatar: "../../image/avatar_01.png",
        gender: "../../image/gender_2.png",
        distance: "0.77km",
        teacher: "李老师",
        university: "北京外国语大学",
        education: "本科",
        graduation: "大学生/毕业生",
        grade: "音乐",
        taught: "钢琴 小提琴 尤克里里",
        auth: "已认证",
        price: "500",
        pricetime: "小时"
      },
      {
        'id': 2,
        avatar: "../../image/avatar_01.png",
        teacher: "张老师",
        gender: "../../image/gender_2.png",
        distance: "0.77km",
        university: "澳大利亚美利坚合众国外国语工程总设计部位专攻英语大学",
        education: "本科",
        graduation: "专职教师",
        grade: "小学",
        taught: "语文 英语",
        auth: "已认证",
        price: "200",
        pricetime: "45分钟"
      },
    ];
    this.setData({
      teacherList: teacherList
    })
    //*/
    //* 动态读取数据
    this.searchTeacherBase();
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
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    });
    this.setData({
      currentPage: this.data.currentPage + 1,
    });
    this.searchTeacher();
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 2000);
    //console.log('onPullDownRefresh', new Date());
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({
      currentPage: this.data.currentPage + 1,
    });
    this.searchTeacher();
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
        //console.log(res, new Date())
      }
    })
  },

  /**
   * 自定义查询老师列表的处理函数
   */
  searchTeacher: function() {
    var p = {};
    p['order'] = this.data.menu[0];
    //if (this.data.menu[1] != '科目') {
    var gradeTaught = this.data.menu[1].split(":");
    p['grade'] = this.data.menu[1] != '科目' ? gradeTaught[0] : '';
    p['taught'] = gradeTaught[1];
    //}
    p['area'] = this.data.menu[2] != '区域' ? this.data.menu[2] : '';
    p['form'] = this.data.formData;
    var that = this;
    if (this.data.menu[0] == '距离最近') {
      //获取地理位置
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          //console.log(res);
          //latitude longitude
          p['latitude'] = res.latitude;
          p['longitude'] = res.longitude;
          that.searchTeacherBase(p);
        }
      })
    } else {
      this.searchTeacherBase(p);
    }
  },

  /**
   * 自定义查询老师列表的基础查询base处理函数
   */
  searchTeacherBase: function(p) {
    //console.log(p);
    if (p == undefined) {
      p = {};
    }
    //* 动态读取数据
    var that = this;
    wx.request({
      url: serverUrl + 'teacher/list/' + that.data.currentPage + '/' + that.data.pageSize,
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
          //console.log(that.data.listBottom);
          return;
        }
        for (var x in list) {
          list[x]['avatar'] = srcUrl + list[x]['avatar'];
          if (list[x]['grade']) {
            list[x]['grade'] = list[x]['grade'].replace(/,/g, ' ');
          }
          if (list[x]['taught']) {
            list[x]['taught'] = list[x]['taught'].replace(/,/g, ' ');
          }
          list[x]['gender'] = cd.dataDict.genderPic[list[x]['gender']];
          if (p.latitude) {
            list[x]['distance'] = util.distance(p.latitude, p.longitude, list[x]['latitude'], list[x]['longitude']);
          }
          list[x]['distance'] = '-';
        }
        //console.log(list)
        //console.log(p.latitude);
        if (p.latitude == undefined) {
          //获取地理位置
          wx.getLocation({
            type: 'wgs84',
            success: function(res) {
              //console.log(res);
              for (var x in list) {
                list[x]['distance'] = util.distance(res.latitude, res.longitude, list[x]['latitude'], list[x]['longitude']);
              }
              that.setTeacherList(list);
            }
          })
        } else {
          that.setTeacherList(list);
        }

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
  setTeacherList: function(list) {
    //把已加载的数据与新数据拼接
    var teacherList = this.data.teacherList;
    if (this.data.currentPage > 0 && teacherList != null) {
      //console.log("teacherList : " + teacherList)
      list = teacherList.concat(list);
    } else {
      teacherList = list;
    }
    this.setData({
      teacherList: list
    })
  },

})