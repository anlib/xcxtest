const util = require('../../../../utils/util.js');
const md5 = require('../../../../utils/md5.js');

/* 
 * 动态读取数据
 */
function teacherList(p, serverUrl, that, pageSize, currentPage) {
  //console.log('teacherList{p}:'); console.log(p);
  if (!p) {
    return;
  }
  if (!currentPage)  currentPage = 1;
  var myThis = this;
  wx.request({
    url: serverUrl + 'teacher/list/' + currentPage + '/' + pageSize,
    method: 'POST',
    data: p,
    contentType: 'application/json;charset=utf-8',
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      //console.log("teacherList{res.data}:");
      //console.log(res.data);
      var list = res.data;
      //如果没数据
      if (!list[0]) {
        //console.log('没数据');
        that.setData({
          listBottom: true,
        })
        return false;
      } else {
        myThis.setTeacherList(list, that);
      }
    }
  })
}

/* 
 * set data teacherList
 */
function setTeacherList(list, that) {
  //把已加载的数据与新数据拼接
  var teacherList = that.data.teacherList;
  if (that.data.currentPage > 0 && teacherList != null) {
    list = teacherList.concat(list);
  }
  that.setData({
    teacherList: list
  })
}

/* 
 * 动态读取本登录用户数据（Teacher）
 */
function appjsTeacher(openid, serverUrl, otherThis) {
  var p = {
    'openid': openid,
    'lastlongin': util.formatDateTime(new Date())
  };
  //console.log('appjs Teacher{p}:', p);
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
      //如果没数据
      if (!list[0]) {
        //console.log('没数据');
        that.insertTeacher(p, serverUrl, otherThis);
        return;
      } else {
        //缓存用户信息
        wx.setStorageSync("teacherDetail", list[0]);
        //设置本地session为md5的openid
        wx.setStorageSync('sessionOpenid', md5.hex_md5(md5.hex_md5(openid + otherThis.globalData.salt)));
        //更新登录时间
        that.updateTeacher(p, serverUrl);
      }
    }
  })
}

/* 
 * 动态读取数据
 */
function getOneTeacher(p, serverUrl, appjsThis) {
  //console.log('search Teacher{p}:', p);
  if (!p) {
    return;
  }
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
      //console.log("getOne Teacher{res.data}:");
      //console.log(res.data);
      var list = res.data;
      //如果没数据
      if (!list[0]) {
        //console.log('没数据');
        return;
      } else {
        //缓存用户信息
        wx.setStorageSync("teacherDetail", list[0]);
        //设置本地session为md5的openid
        wx.setStorageSync('sessionOpenid', md5.hex_md5(md5.hex_md5(openid + otherThis.globalData.salt)));
      }
    }
  })
}

/*
 * 新增老师
 */
function insertTeacher(p, serverUrl, otherThis) {
  if (p == undefined) {
    return;
  }
  var that = this;
  //* 动态读取数据
  wx.request({
    url: serverUrl + 'teacher/add',
    method: 'POST',
    data: p,
    contentType: 'application/json;charset=utf-8',
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      that.getOneTeacher(p, serverUrl, otherThis) 
    }
  })
}
/*
 * 更新老师资料
 */
function updateTeacher(p, serverUrl) {
  //console.log('updateTeacher:');
  //console.log(p); //需要id为条件的；
  if (p == undefined) {
    return;
  }
  //* 动态读取数据
  wx.request({
    url: serverUrl + 'teacher/update',
    method: 'POST',
    data: p,
    contentType: 'application/json;charset=utf-8',
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      //console.log(res);
    }
  })
}

/* 
 * 动态读取数据
 */
function getOneTeacher(p, serverUrl, appjsThis) {
  //console.log('search Teacher{p}:', p);
  if (!p) {
    return;
  }
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
      //console.log("getOne Teacher{res.data}:", res.data);
      var list = res.data;
      //如果没数据
      if (!list[0]) {
        //console.log('没数据');
        return;
      } else {
        wx.setStorageSync("teacherDetail", list[0]);
        //设置本地session为md5的openid
        wx.setStorageSync('sessionOpenid', md5.hex_md5(md5.hex_md5(openid + otherThis.globalData.salt)));
      }
    }
  })
}

//这样暴露接口，这里不暴露是不能引用的，
module.exports = {
  teacherList: teacherList,
  appjsTeacher: appjsTeacher,
  insertTeacher: insertTeacher,
  updateTeacher: updateTeacher,
  setTeacherList: setTeacherList
}