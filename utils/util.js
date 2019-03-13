/*
 * 返回时间格式为 2019-02-01 01:01
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDateTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/*
 * 自定义 两个经度纬度距离
 */
function distance(la1, lo1, la2, lo2) {
  var La1 = la1 * Math.PI / 180.0;
  var La2 = la2 * Math.PI / 180.0;
  var La3 = La1 - La2;
  var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
  s = s * 6378.137; //地球半径
  s = Math.round(s * 10000) / 10000;
  //console.log("计算结果", s)
  s = s.toFixed(2) //保留小数点后面两位
  return s
}
/**
  * 返回前一页
  */
function goBack () {
  wx.navigateBack({
    delta: 1
  })
}

/* 
 * 用联系TA的微信
 */
function wechatTa(tel) {
  console.log('发送选择改变，tel携带值为' + tel);
 
}

/* 
 * 用联系TA的电话
 */
function phoneTa(phone) {
  console.log('发送选择改变，phone携带值为' + phone);
    wx.makePhoneCall({
      phoneNumber: phone,
      success() {
        console.log('成功拨打电话')
      }
    })

}

/*
 * 返回接口给应用程序
 */
module.exports = {
  formatDateTime: formatDateTime,
  formatTime: formatTime,
  distance: distance,
  goBack: goBack,
  wechatTa: wechatTa,
  phoneTa: phoneTa,
}