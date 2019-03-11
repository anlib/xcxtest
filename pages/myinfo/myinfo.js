const app = getApp();
const serverUrl = app.globalData.serverUrl; //初始服务器地址
const srcUrl = app.globalData.srcUrl; //初始服务器地址
const cd = require('../module/common/config-data.js');
const paymentUrl = require('../module/common/config-wechat').paymentUrl

//初始化可接受科目选择
let subjectDataInit = cd.subjectDataInit;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    srcUrl: srcUrl,
    id: null, //老师id
    motto: '微信遮罩层显示',
    flag: -1, //页面显示标识，和后端数据没关系
    //myflag: 0, //注册流程状态，初始:0,老师1,学生2
    flagName: {
      '-1': '我的',
      '0': '我的',
      1: '完善资料',
      111: '完善资料', //我的资料进行修改
      2: '完善资料',
      3: '我的',
      11: '设置姓名',
      12: '可授科目',
      13: '可授课时间',
      123: '我的关注',
    },
    //生日设置选择
    birthday: '请输入您的年龄',
    startDay: '1900-01-01',
    today: Date.today,
    genderArray: cd.genderArray, //性别选择
    genderSelected: null,
    //城市选择
    region: ['请选择', '', ''], //默认城市
    subjectData: subjectDataInit,
    subjectNext: null,
    //可预约授课时间
    scheduleData: cd.scheduleData,
    //课时费
    priceData: cd.priceData,
    //priceDataIndex: [3, 0],
    pricedf: '每课时费用(人民币)',
    followCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //get 后端 身份 选择值
    var openid = app.globalData.openid;
    //console.log(openid);
    if (!openid) {
      return;
    }
    var p = {
      'openid': openid
    };
    //从后端读出老师资料，赋值flag前台展示标识
    this.searchTeacher(p);
    //设置抬头标题
    //console.log(flag)
    wx.setNavigationBarTitle({
      title: this.data.flagName[this.data.flag]
    });
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
      var p = {
        'id': this.data.id,
        'myflag': flag
      };
      this.updateTeacher(p);
    }
    if (flagData == 'teacherBase') {
      //console.log(flag)
      if (flag == 1) { //第一次修改
        //post set 后端完善老师资料状态
        var p = {
          'id': this.data.id,
          'myflag': 3
        };
        this.updateTeacher(p);
      }
      flag = 3;
    }
    if (e.currentTarget.dataset.myflag) {
      var myflag = e.currentTarget.dataset.myflag;
    } else {
      var myflag = this.data.myflag;
    }
    this.setData({
      flag: flag,
      myflag: myflag
    });
    wx.setNavigationBarTitle({
      title: this.data.flagName[this.data.flag]
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
  subjectcommit: function(e) {
    var items = this.data.subjectData;
    console.log(items)
    // 循环取出为true subjectData;
    var grade = new Array();
    var taught = new Array();
    var subjectPost = [];
    var subjectPostLength = 0;
    for (var index in items) {
      var item = items[index]['v'];
      var itemI = items[index]['i'];
      for (var idx in item) {
        if (item[idx].checked == true) {
          if (subjectPost[itemI] == undefined) {
            subjectPost[itemI] = {};
            subjectPostLength++;
          }
          grade.push(itemI);
          taught.push(item[idx].name);
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
    //console.log(subjectValue);
    //console.log('-----------------grade');
    //console.log(grade);
    var n = []; //临时数组
    for (var i = 0; i < grade.length; i++) {
      if (n.indexOf(grade[i]) == -1) n.push(grade[i]);
    }
    grade = n.join(',');
    var n = [];
    for (var i = 0; i < taught.length; i++) {
      if (n.indexOf(taught[i]) == -1) n.push(taught[i]);
    }
    taught = n.join(',');
    //post 后端 subjectPost
    if (subjectValue) {
      // post 提交 e.detail.value 到后端
      console.log(this.data.myflag);
      var p = {
        'id': this.data.id,
        'grade': grade,
        'taught': taught,
        'gradetaught': subjectValue
      };
      this.updateTeacher(p);
    }
    this.setData({
      subjectValue: subjectValue,
      flag: parseInt(e.currentTarget.dataset.flag),
    })
  },
  /* 
   * 提交form
   */
  //修改姓名
  formSubmitName(e) {
    //console.log(e)
    //console.log('form发生了submit事件，携带数据为：', e.detail.value);
    if (e.detail.value) {
      // post 提交 e.detail.value 到后端
      //console.log(this.data.myflag);
      var p = {
        'id': this.data.id,
        'teacher': e.detail.value.name
      };
      this.updateTeacher(p);
    }
    //console.log('flag：', e.detail.target.dataset.flag);
    var flag = this.data.myflag;
    if (e.detail.target.dataset.flag) {
      flag = parseInt(e.detail.target.dataset.flag);
    }
    this.setData({
      flag: flag,
      formDataName: e.detail.value.name
    });
  },
  //修改可授时间
  formSubmitTime(e) {
    //console.log(e)
    //console.log('form发生了submit事件，携带数据为：', e.detail.value);
    if (e.detail.value) {
      // post 提交 e.detail.value 到后端
      var p = {
        'id': this.data.id,
        'teachtime': e.detail.value.teachTime
      };
      this.updateTeacher(p);
    }
    //console.log('flag：', e.detail.target.dataset.flag);
    var flag = this.data.myflag;
    if (e.detail.target.dataset.flag) {
      flag = parseInt(e.detail.target.dataset.flag);
    }
    //console.log(this.data.myflag);
    this.setData({
      flag: flag,
      formDataTime: e.detail.value.teachTime
    });
  },

  /* 
   * 重置form表单
   */
  formReset(e) {
    //重新赋值全局变量
    //console.log(this.data.myflag)
    this.setData({
      flag: this.data.myflag,
      formDataName: this.data.formDataName,
      formDataTime: this.data.formDataTime,      
    })
  },

  /* 
   * 日期选择
   */
  bindDateChange(e) {
    //post 后端
    //console.log(e.detail.value);
    if (e.detail.value) {
      // post 提交 e.detail.value 到后端
      //console.log(this.data.myflag);
      var p = {
        'id': this.data.id,
        'birthday': e.detail.value
      };
      this.updateTeacher(p);
    }

    this.setData({
      birthday: e.detail.value
    })
  },

  //选择checkbox
  checkboxChange(e) {
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    //console.log(e.detail.value);
    //if (e.detail.value) {
    // post 提交 e.detail.value 到后端
    //  console.log(this.data.myflag);
    //  var p = { 'id': this.data.id, 'checkbox': e.detail.value };
    //  this.updateTeacher(p);
    //}

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
   * 选择器 （性别，城市）
   */
  bindPickerChange(e) {
    //console.log('picker发送选择改变，genderSelected携带值为', e.detail.value);
    //console.log('picker发送选择改变，region携带值为', e.currentTarget.dataset.type);
    var type = e.currentTarget.dataset.type;
    var value = e.detail.value;
    var input = e.currentTarget.dataset.input;
    //post 后端 
    if (e.detail.value) {
      // post 提交 e.detail.value 到后端
      //console.log(this.data.myflag);
      var p = {
        'id': this.data.id
      };
      if (input == 'gender') {
        p['gender'] = this.data.genderArray[value];
      } else if (input == 'area') {
        p['city'] = value[1];
        p['area'] = value[2];
      } else if (input == 'price') {
        //console.log(value);
        p['price'] = this.data.priceData[0][value[0]];
        p['pricetime'] = this.data.priceData[1][value[1]];
      }
      this.updateTeacher(p);
    }
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
  searchTeacher: function(p) {
    //console.log('searchTeacher{p}:'); console.log(p);
    if (!p) {
      return;
    }
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
      success: function(res) {
        //console.log("searchTeacher{res.data}:");
        //console.log(res.data);
        var list = res.data;
        //如果没数据
        if (!list[0]) {
          //console.log('没数据');
          that.insertTeacher(p);
          return;
        } else {
          //Teacher - data 赋值 coding wating
          var teacherDetail = list[0];
          var genderSelected = null;
          if (teacherDetail['gender'] == '男') {
            genderSelected = 0;
          } else if (teacherDetail['gender'] == '女') {
            genderSelected = 1;
          }
          //console.log(teacherDetail['gender']);          
          teacherDetail['genderPic'] = cd.dataDict.genderPic[teacherDetail['gender']];
          var region = ['', teacherDetail['city'], teacherDetail['area']];
          var pricedf = that.data.pricedf;
          if (teacherDetail['price']) {
            pricedf = '￥' + teacherDetail['price'] + '元/' + teacherDetail['pricetime'];
          }
          //console.log(pricedf);
          that.followCount(list[0]['id']);//被关注数
          that.followList(list[0]['id']);//显示5个关注
          that.scoreCount(list[0]['id']);//评论数
          that.certificateList(list[0]['id']);  //证书数       
          that.setData({
            formDataName: teacherDetail['teacher'],
            formDataTime: teacherDetail['teachtime'],
            subjectValue: teacherDetail['gradetaught'],
            birthday: teacherDetail['birthday'],
            genderSelected: genderSelected,
            region: region,
            pricedf: pricedf,
            id: list[0]['id'],
            flag: list[0]['myflag'],
            myflag: list[0]['myflag'],
            teacherDetail: teacherDetail,
          })
        }
      }
    })
  },

  /*
   * 关注数量
   */
  followCount: function(id) {
    var p = {
      "touserid": id
    }
    //console.log(p);
    var that = this;
    wx.request({
      url: serverUrl + 'teacherFollow/count',
      method: 'POST',
      data: p,
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        //console.log(res.data);
        var list = res.data;
        //如果没数据
        if (!list[0]) {
          //console.log('没数据');
          return false;
        } else {
          //console.log(list[0]['count']);
          that.data.teacherDetail['followCount'] = list[0]['count'];
          that.setData({
            teacherDetail: that.data.teacherDetail
          })
        }
      }
    })
  },

  /*
   * 5个关注
   */
  followList: function(id) {
    var p = {
      "touserid": id
    }
    var that = this;
    wx.request({
      url: serverUrl + 'teacherFollow/list/1/5',
      method: 'POST',
      data: p,
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        //console.log(res.data);
        var list = res.data;
        //如果没数据
        if (!list[0]) {
          //console.log('没数据');
          return false;
        } else {
          var ids = [];
          for (var x in list) {
            ids.push(list[x]['fromuserid']);
          }
          var p = {
            "ids": ids
          }
          //console.log(p);
          that.teacherList(p);
        }
      }
    })
  },

  /*
   * 展示5个关注
   */
  teacherList: function(p) {
    if (!p) {
      return;
    }
    var that = this;
    wx.request({
      url: serverUrl + 'teacher/list/1/5',
      method: 'POST',
      data: p,
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        //console.log("teacherList{res.data}:");
        //console.log(res.data);
        var list = res.data;
        //如果没数据
        if (!list[0]) {
          //console.log('没数据');
          return false;
        } else {
          var teacherFollow = res.data;
          for (var x in teacherFollow) {
            teacherFollow[x]['avatar'] = srcUrl + teacherFollow[x]['avatar'];
          }
          that.setData({
            teacherFollow: teacherFollow,
          })
        }
      }
    })
  },

  /*
   * 评价数量
   */
  scoreCount: function (id) {
    var p = {
      "listpid": id
    }
    //console.log(p);
    var that = this;
    wx.request({
      url: serverUrl + 'teacherScore/count',
      method: 'POST',
      data: p,
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data);
        var list = res.data;
        //如果没数据
        if (!list[0]) {
          //console.log('没数据');
          return false;
        } else {
          //console.log(list[0]['count']);
          that.data.teacherDetail['scoreCount'] = list[0]['count'];
          that.setData({
            teacherDetail: that.data.teacherDetail
          })
        }
      }
    })
  },

  /*
   * 评价数量
   */
  certificateList: function (id) {
    //从后端取数据
    var that = this;
    wx.request({
      url: serverUrl + 'teacherCertificate/pid/' + id,
      method: 'POST',
      data: {},
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        var certificateList = new Array();
        for (var i = 0; i < res.data.length && i < 3; i++) {
          certificateList[i] = new Array();
          certificateList[i] = srcUrl + res.data[i]['certificate'] + '.jpg';
        }
        that.data.teacherDetail['certificateCount'] = res.data.length;
        that.data.teacherDetail['certificateList'] = certificateList;
        console.log(that.data.teacherDetail);
        that.setData({
          teacherDetail: that.data.teacherDetail
        })
      }
    })
  },

  /*
   * 新增老师
   */
  insertTeacher: function(p) {
    //console.log(p);
    if (p == undefined) {
      return;
    }
    //* 动态读取数据
    var that = this;
    wx.request({
      url: serverUrl + 'teacher/add',
      method: 'POST',
      data: p,
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        //console.log("insertTeacher res.data");
        //console.log(res.data);
        that.setData({
          id: res.data['insertId'],
          flag: 0,
        })
      }
    })
  },

  /*
   * 更新老师资料
   */
  updateTeacher: function(p) {
    //console.log('updateTeacher:');
    //console.log(p); //需要id为条件的；
    if (p == undefined) {
      return;
    }
    //* 动态读取数据
    var that = this;
    wx.request({
      url: serverUrl + 'teacher/update',
      method: 'POST',
      data: p,
      contentType: 'application/json;charset=utf-8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        //console.log("update res.data");
        //console.log(res.data);
        //that.setData({
          //flag: res.data['myflag'],
          //myflag: res.data['myflag'],
        //})
      }
    })
  },

  /* 
   * 图片预览
   */
  previewImage(e) {
    const current = e.target.dataset.src;
    var certificateList = this.data.teacherDetail['certificateList'];
    wx.previewImage({
      current,
      urls: certificateList
    })
  },

  //微信支付，暂时不做
  requestPayment() {
    const self = this

    self.setData({
      loading: true
    })

    // 此处需要先调用wx.login方法获取code，然后在服务端调用微信接口使用code换取下单用户的openId
    // 具体文档参考https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html?t=20161230#wxloginobject
    app.getUserOpenId(function(err, openid) {
      if (!err) {
        wx.request({
          url: paymentUrl,
          data: {
            openid
          },
          method: 'POST',
          success(res) {
            console.log('unified order success, response is:', res)
            const payargs = res.data.payargs
            wx.requestPayment({
              timeStamp: payargs.timeStamp,
              nonceStr: payargs.nonceStr,
              package: payargs.package,
              signType: payargs.signType,
              paySign: payargs.paySign
            })

            self.setData({
              loading: false
            })
          }
        })
      } else {
        console.log('err:', err)
        self.setData({
          loading: false
        })
      }
    })
  }

})