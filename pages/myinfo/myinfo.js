const app = getApp();
const serverUrl = app.globalData.serverUrl; //初始服务器地址
const srcUrl = app.globalData.srcUrl; //初始服务器地址
const followList = require('../module/follow/follow.js');
//初始化可接受科目选择
let subjectDataInit = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    motto: '微信遮罩层显示',
    flag: 0,
    myFlag: 0, //身份设置，初始:0,老师1,学生2
    flagName: {
      '0': '我的',
      1: '完善资料',
      2: '完善资料',
      //3: '我的',
      11: '设置姓名',
      12: '可授科目',
      13: '可授课时间',
      123: '我的关注',
    },
    //生日设置选择
    birthday: '请输入您的年龄',
    startDay: '1900-01-01',
    today: '2019-02-19',
    //性别选择
    genderArray: ['男', '女'],
    genderSelected: null,
    //城市选择
    region: ['请选择', '', ''], //默认城市
    subjectData: subjectDataInit,
    subjectNext: null,
    //可预约授课时间
    scheduleData: [
      ['周一', '周二'],
      ["全天", "上午", "下午", "晚上"]
    ],
    //课时费
    priceData: [
      ['0', '50', '100', '200', '300', '400', '500', '700', '1000', '2000', '5000', '10000+'],
      ["小时", "45分钟"]
    ],
    priceDataIndex: [3, 0],
  },

  /**
   * //前端选择显示内容
   */
  setFlag: function(e) {
    // get code wating 
    var flag = parseInt(e.currentTarget.dataset.flag);
    //初始页面选择身份url跳转
    var flagData = e.currentTarget.dataset.flagdata;
    if (flagData == 'first') {
      //post set 后端 选择身份 
    }
    if (flagData == 'teacherBase') {
      //post set 后端 完善老师资料
      flag = 3;
    }

    this.setData({
      flag: flag
    });
    wx.setNavigationBarTitle({
      title: this.data.flagName[flag]
    });
  },

  /*
  * 取消可授科目
   */
  subjectCancel: function(e) {
    this.setData({
      subjectData: subjectDataInit,
      flag: parseInt(e.currentTarget.dataset.flag),
    })
  },
  /*
 * 完成并提交可授科目的选择
  */
  subjectcommit: function (e) {
    var items = this.data.subjectData;
    //console.log(items)
    // 循环取出为true subjectData;
    var subjectPost = [];
    var subjectPostLength = 0;
    for (var index in items) {
      var item = items[index]['v'];
      var itemI = items[index]['i'];
      for (var idx in item) {
        if (item[idx].checked == true) {
          if (subjectPost[itemI] == undefined){
            subjectPost[itemI] = {};
            subjectPostLength++;
          }
          subjectPost[itemI][idx] = item[idx].name;
        }
      }
    }
    //
    var subjectValue = '';
    var num = 0;
    for (var index in subjectPost) {
      subjectValue += index;
      for (var idx in subjectPost[index]) {
        subjectValue += ' ' + subjectPost[index][idx];
      }
      if (num != subjectPostLength - 1) {
        subjectValue += ',';
      }
      num++;
    }
    console.log(subjectValue);
    //post 后端 subjectPost
    //waiting code

    this.setData({
      subjectValue: subjectValue,
      flag: parseInt(e.currentTarget.dataset.flag),
    })
  },
  /* 
   * 提交form
   */
  formSubmit(e) {
    //console.log(e)
    // post 提交 e.detail.value 到后端
    //console.log('form发生了submit事件，携带数据为：', e.detail.value);
    //console.log('flag：', e.detail.target.dataset.flag);
    var flag = this.data.myFlag;
    if (e.detail.target.dataset.flag) {
      flag = parseInt(e.detail.target.dataset.flag);
    }
    this.setData({
      flag: flag,
      formData: e.detail.value
    });
  },
  /* 
   * 重置form表单
   */
  formReset(e) {
    //重新赋值全局变量
    //console.log(this.data.myFlag)
    this.setData({
      flag: this.data.myFlag,
    })
  },

  //选择checkbox
  checkboxChange(e) {
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var subjectNext = this.data.subjectNext;
    var items = this.data.subjectData[subjectNext]['v'];
    var values = e.detail.value
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false
      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].name === values[j]) {
          items[i].checked = true
          break
        }
      }
    }
    //console.log(items)
    this.data.subjectData[subjectNext]['v'] = items;
    this.setData({
      subjectData: this.data.subjectData
    })
  },

  /* 
   * 日期选择
   */
  bindDateChange(e) {
    //post 后端
    this.setData({
      birthday: e.detail.value
    })
  },

  /* 
   * 选择器 （性别，城市）
   */
  bindPickerChange(e) {
    console.log('picker发送选择改变，genderSelected携带值为', e.detail.value);
    console.log('picker发送选择改变，region携带值为', e.currentTarget.dataset.type);
    var type = e.currentTarget.dataset.type;
    var value = e.detail.value;
    //post 后端 
    //waiting
    var data = {};
    data[type] = value;
    //设置全局变量
    this.setData(data);
  },

  /**
   * 选择科目二级菜单
   */
  selectNext: function(e) {
    //console.log(e.currentTarget.dataset.flag);
    //console.log(e.currentTarget.dataset.nav);
    this.setData({
      flag: e.currentTarget.dataset.flag,
      //给下一级赋值(value)并携带父节点值(per)
      subjectNext: e.currentTarget.dataset.nav,
    });
  },

  /**
     * 自定义查询老师的处理函数
     */
  searchTeacher: function (p) {
    //console.log(p);
    if (p == undefined) { p = {}; }
    //* 动态读取数据
    var that = this;
    wx.request({
      url: serverUrl + 'teacher/list/1/1',
      method: 'POST',
      data: p,
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data);
        var list = res.data;
        //console.log(list[0]);
        //如果没数据
        if (!list[0]) {
          //console.log('没数据');
          return;
        }
        for (var x in list) {
          var id = list[x]['id'];
          var myFlag = list[x]['myflag'];
        }
        if (id) {
          that.getTeacher(id);
        }
        that.setData({
          myFlag: myFlag,
        })
      }
    })
  },

  getTeacher: function (id) {
    //* 动态读取数据
    var that = this;
    wx.request({
      url: serverUrl + 'teacher/id/' + id,
      method: 'GET',
      data: {},
      success: function (res) {
        console.log(res.data);
        var dt = res.data['teacher'][0];
        var myFlag = dt['myflag'];
        console.log(dt);
        that.setData({
          teacherDetail: dt,
          myFlag: myFlag,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //get 后端 身份 选择值

    var openid = app.globalData.openid;
    console.log(openid);
    if (!openid){
      wx.showToast({
        title: "需要微信登录授权",
        duration: 9999999,
        mask: true,
      })
      return;
    }
    var p = {};
    p['openid'] = openid;
    this.searchTeacher(p);
    var myFlag = this.data.myFlag;
    //从端取数据
    subjectDataInit = [
      {
        "i": "小学",
        "v": [{
          'name': '数学',
          'checked': true,
        },
        {
          'name': '英语',
        },
        {
          'name': '语文',
        }
        ],
      },
      {
        "i": "初中",
        "v": [{
          'name': '数学',
        },
        {
          'name': '英语',
        },
        {
          'name': '语文',
        },
        {
          'name': '物理',
        },
        {
          'name': '化学',
        },
        {
          'name': '地理',
        },
        {
          'name': '历史',
        }
        ],
      }, 
      {
        "i": "高中",
        "v": [{
          'name': '数学',
        }
        ],
      },
    ];
    var teacherDetail = { 
      avatar: "../../image/avatar_01.png",
      teacherName: "张老师",
      graduation: "大学生/毕业生",
      auth: "已认证",
      genderPic: "../../image/gender_1.png",
      distance: "0.77km",
      score: 4.5,
      lastLongin: "7分钟前",
      price: "￥300/小时 起",
    };
    var flag = myFlag;
    if (flag == 123){
      teacherDetail = followList.followList(this);
    }
    //console.log(flag)
    //console.log(subjectDataInit)
    this.setData({
      flag: flag,
      myFlag: myFlag,
      subjectData: subjectDataInit,
      teacherDetail: teacherDetail,
    });
    //设置抬头标题
    //console.log(this.data.flagName)
    //console.log(flag)
    wx.setNavigationBarTitle({
      title: this.data.flagName[flag]
    });
  },

  /* 
   * 联系TA
   */
  linkTa(e) {
    console.log('发送选择改变，id携带值为', e.currentTarget.dataset.id);
    var back = followList.linkTa(e, this);

  },

})
