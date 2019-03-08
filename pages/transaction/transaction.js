//初始化可接受科目选择
let subjectDataInit = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //从端取数据
    var teacherDetail = { 
      avatar: "../../image/avatar_01.png",
      teacherName: "张老师",
      genderPic: "../../image/gender_1.png",
      distance: "0.77km",
      university: "澳大利亚美利坚合众国外国语工程总设计部位专攻英语大学",
      lastLongin: "3分钟前",
      graduation: "专职教师",
      grade: "初中",
      subject: ["语文", "英语"],
      auth: "已认证",
      price: "￥300/小时 起",
    };
    this.setData({
      teacherDetail: teacherDetail,
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
