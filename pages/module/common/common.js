//index menuFirst
var menuFirst = ['综合排序', '科目', '区域', '筛选'];

//首页上部切换北京图片
var indexBackground = [{
    pic: '../../image/banner_01.png',
    url: '../myinfo/myinfo',
  },
  {
    pic: '../../image/banner_02.png',
    url: '../index/index',
  },
  {
    pic: '../../image/banner_03.png',
    url: '../logs/logs',
  }
];

//menutop 排序
var menuOrder = ["综合排序", "距离最近", "教学经验", "评价最高", "价格最低", "价格最高"];
//menutop 获取科目
var menuSubjectData = [{
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
];
//menutop 获取地区
menuAreaData = ["不限", "东城", "西城", "崇文", "宣武", "朝阳", "丰台", "石景山", "海淀", "门头沟", "房山", "通州", "顺义", "昌平", "大兴", "怀柔", "平谷", "密云", "延庆"];
//menutop 获取老师类型
menuGender = ["男", "女"];
menuExperience = ["5年以下", "5-10年", "10年以上"];

//data dict
dataDict = {
  gender: { 1: "男", 2: "女" },
  genderPic: { "男": "../../image/gender_1.png", "女": "../../image/gender_2.png" },
  graduation: { 1: "专职教师", 2: "大学生/毕业生" },
  education: { 1: "大专", 2: "本科", 3: '研究生', 4: '博士' },
  auth: { 0: "未认证", 1: "已认证"},
}

/* 
 * index background
 */
function indexBackground() {
  return indexBackground;
}
/* 
 * getMenuFirst
 */
function menuFirst() {
  return menuFirst;
}

function menuOrder() { return menuOrder; }
function menuSubjectData() { return menuSubjectData; }
function menuAreaData() { return menuAreaData; }
function menuGender() { return menuGender; }
function menuExperience() { return menuExperience; }
function dataDict() { return dataDict; }

//这样暴露接口，这里不暴露是不能引用的，
module.exports = {
  menuFirst: menuFirst,
  indexBackground: indexBackground,
  menuOrder: menuOrder,
  menuSubjectData: menuSubjectData,
  menuAreaData: menuAreaData,
  menuGender: menuGender,
  menuExperience: menuExperience,
  dataDict: dataDict,
  
}