function followList() {
  //list赋值
  var followList = [{
      id: 1,
      followed: 1,
      avatar: "../../image/avatar_01.png",
      teacherName: "张老师",
      genderPic: "../../image/gender_1.png",
      university: "澳大利亚美利坚合众国外国语工程总设计部位专攻英语大学",
      education: "本科",
      graduation: "专职教师",
      grade: "初中",
      subject: ["语文", "英语"],
      auth: "已认证",
      link: false,
    },
    {
      id: 2,
      followed: 1,
      avatar: "../../image/avatar_01.png",
      genderPic: "../../image/gender_2.png",
      teacherName: "李老师",
      university: "北京外国语大学",
      education: "本科",
      graduation: "大学生/毕业生",
      grade: "音乐",
      subject: ["钢琴", "小提琴", "尤克里里"],
      auth: "已认证",
      link: "13000000000",
    },
    {
      id: 3,
      followed: 1,
      avatar: "../../image/avatar_01.png",
      teacherName: "张老师",
      genderPic: "../../image/gender_1.png",
      university: "澳大利亚美利坚合众国外国语工程总设计部位专攻英语大学",
      education: "本科",
      graduation: "专职教师",
      grade: "小学",
      subject: ["语文", "英语"],
      auth: "已认证",
      link: "13000000000",
    },
    {
      id: 4,
      followed: 1,
      avatar: "../../image/avatar_01.png",
      teacherName: "张老师",
      genderPic: "../../image/gender_1.png",
      university: "澳大利亚美利坚合众国外国语工程总设计部位专攻英语大学",
      education: "本科",
      graduation: "专职教师",
      grade: "小学",
      subject: ["语文", "英语"],
      auth: "已认证",
      link: "13000000000",
    },
    {
      id: 5,
      followed: 0,
      avatar: "../../image/avatar_01.png",
      teacherName: "张老师",
      genderPic: "../../image/gender_1.png",
      university: "澳大利亚美利坚合众国外国语工程总设计部位专攻英语大学",
      education: "本科",
      graduation: "专职教师",
      grade: "小学",
      subject: ["语文", "英语"],
      auth: "已认证",
      link: "13000000000",
    },
  ];
  return followList;
}

/* 
 * 选择器 （性别，城市）
 */
function linkTa(e, that) {
  var id = e.currentTarget.dataset.id;
  var index = e.currentTarget.dataset.index;
  console.log('发送选择改变，id携带值为', id);
  console.log('发送选择改变，index携带值为', index);
  //post 后端 
  //waiting
  //var data = {};
  //data[index]['id'] = id;
  //设置全局变量
  //this.setData(data);
}

//这样暴露接口，这里不暴露是不能引用的，
module.exports = {
  followList: followList,
  linkTa: linkTa
}