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

//性别选择
genderArray = ['男', '女'];
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


//供选择的可授科目
subjectDataInit = [{
    "i": "小学",
    "v": [{
        'name': '数学',
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
    }],
  },
];
//menutop 获取地区
menuAreaData = ["不限", "东城", "西城", "崇文", "宣武", "朝阳", "丰台", "石景山", "海淀", "门头沟", "房山", "通州", "顺义", "昌平", "大兴", "怀柔", "平谷", "密云", "延庆"];
//menutop 获取老师类型
menuGender = ["男", "女"];
menuExperience = ["5年以下", "5-10年", "10年以上"];

//data dict
dataDict = {
  gender: {
    1: "男",
    2: "女"
  },
  genderPic: {
    "男": "../../image/gender_1.png",
    "女": "../../image/gender_2.png"
  },
  graduation: {
    1: "专职教师",
    2: "大学生/毕业生"
  },
  education: {
    1: "大专",
    2: "本科",
    3: '研究生',
    4: '博士'
  },
  auth: {
    0: "未认证",
    1: "已认证"
  },
};
//课时费
priceData = [
  ['0', '50', '100', '200', '300', '400', '500', '700', '1000', '2000', '5000', '10000+'],
  ["小时", "45分钟"]
];
//可预约授课时间
scheduleData = [
  ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  ["全天", "上午", "下午", "晚上"]
];
//自定义底部菜单显示文字
bottomData = {
  'bottomDataOne': '关注',
  'bottomDataTwo': '微信',
  'bottomDataThree': '电话'
};
//自定义底部菜单显示文字 isMyself
bottomDataisMyself = {
  'bottomDataOne': '',
  'bottomDataTwo': '首页',
  'bottomDataThree': '我的'
};
//评价星星显示图
scoreImgList = {
  1: 'gray',
    2: 'gray',
      3: 'gray',
        4: 'gray',
          5: 'gray'
};
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

function menuOrder() {
  return menuOrder;
}

function menuSubjectData() {
  return menuSubjectData;
}

function menuAreaData() {
  return menuAreaData;
}

function menuGender() {
  return menuGender;
}

function menuExperience() {
  return menuExperience;
}

function dataDict() {
  return dataDict;
}

function priceData() {
  return priceData;
}

function scheduleData() {
  return scheduleData;
}

function genderArray() {
  return genderArray;
}

function subjectDataInit() {
  return subjectDataInit;
}
function bottomData() {
  return bottomData;
}
function bottomDataisMyself() {
  return bottomDataisMyself;
}
function scoreImgList() {
  return scoreImgList;
}

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
  priceData: priceData,
  scheduleData: scheduleData,
  genderArray: genderArray,
  subjectDataInit: subjectDataInit,
  bottomData: bottomData,
  bottomDataisMyself: bottomDataisMyself,
  scoreImgList: scoreImgList,
  
}