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
    }
  })
}
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
 * 动态读取数据
 */
function searchTeacher(p, serverUrl, appjsThis) {
  //console.log('searchTeacher{p}:'); console.log(p);
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
      //console.log("searchTeacher{res.data}:");
      //console.log(res.data);
      var list = res.data;
      //如果没数据
      if (!list[0]) {
        //console.log('没数据');
        that.insertTeacher(p, serverUrl);
        return;
      } else {
        wx.setStorageSync("teacherDetail", list[0]);
        appjsThis.globalData.teacherDetail = list[0];
        that.updateTeacher(p, serverUrl);
      }
    }
  })
}

/*
 * 新增老师
 */
function insertTeacher(p, serverUrl) {
  if (p == undefined) {
    return;
  }
  //* 动态读取数据
  wx.request({
    url: serverUrl + 'teacher/add',
    method: 'POST',
    data: p,
    contentType: 'application/json;charset=utf-8',
    header: {
      'Content-Type': 'application/json'
    },
  })
}

//这样暴露接口，这里不暴露是不能引用的，
module.exports = {
  teacherList: teacherList,
  searchTeacher: searchTeacher,
  insertTeacher: insertTeacher,
  updateTeacher: updateTeacher,
  setTeacherList: setTeacherList
}