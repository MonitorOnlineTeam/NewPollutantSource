export const allSysList = [
  {
    key: '监控预警',
    value: '/systemDashboard/Monitoring',
    title: '污染源监测监控',
    ID: '179c308a-a895-4a7a-9c40-4f30dd5ff0bc',
  },
  {
    key: '异常数据识别',
    value: '/SystemDashboard/AbnormalIdentify',
    title: '污染源异常数据识别',
    ID: 'f6eb76ab-ce0b-4cfb-8626-2e0ec4435ec3',
  },
  {
    key: '智慧运维',
    value: '/SystemDashboard/Operation',
    title: '污染源智慧运维',
    ID: '70748d49-ce43-4a68-ab27-6795b9934893',
  },
  {
    key: '安装调试',
    value: '/SystemDashboard/CT',
    title: '污染源安装调试',
    ID: '5c751d3e-4b5d-4e1e-ade4-eb35253ca748',
  },
  {
    key: '监督核查',
    value: '/SystemDashboard/SupervisionVerifica',
    title: '污染源监督核查',
    ID: 'f4da6d42-4282-48de-88c4-c7c8434ebdb4',
  },
  {
    key: '动态质控',
    value: '/SystemDashboard/QualityControl',
    title: '污染源动态质控',
    ID: '3e5dec12-e8af-4733-8954-29045e74c76e',
  },
];

// 解决经纬度一样时出现重叠的情况
export const adjustDuplicateCoordinates = (data, fixedValue = 0.00004) => {
  // 记录坐标出现次数的字典
  const coordsCount = {};

  // 遍历数据数组
  data.forEach(item => {
    const lat = item.position.latitude;
    const long = item.position.longitude;
    const key = `${lat},${long}`;

    // 检查坐标是否已记录
    if (coordsCount[key]) {
      // 增加出现次数
      coordsCount[key]++;
      // 修改坐标值
      item.position.latitude = (lat + coordsCount[key] * fixedValue).toFixed(6);
      item.position.longitude = (long + coordsCount[key] * fixedValue).toFixed(6);
    } else {
      // 记录坐标首次出现
      coordsCount[key] = 1;
    }
  });

  // 返回修改后的数据
  return data;
};

// [
//   {
//       "ID": "99dbc722-033f-481a-932a-3c6436e17245",
//       "Name": "智慧运维管理平台",
//       "MenuImg": "运维",
//       "TipsName": "接口数据ReactShow",
//       "CodeList": "",
//       "Url": null
//   },
//   {
//       "ID": "0d4ad7f1-3a05-42ad-9860-c150ee8c270e",
//       "Name": "异常数据智能精准识别系统",
//       "MenuImg": "应急",
//       "TipsName": "异常数据智能精准识别系统V1.0",
//       "CodeList": "",
//       "Url": null
//   },
//   {
//       "ID": "140496b1-ab85-474a-9278-3ca7c6df3f9b",
//       "Name": "设备调试及售后服务管理平台",
//       "MenuImg": "一企一档",
//       "TipsName": "设备调试及售后服务管理平台ReactShow",
//       "CodeList": "",
//       "Url": null
//   },
//   {
//       "ID": "179c308a-a895-4a7a-9c40-4f30dd5ff0bc",
//       "Name": "污染源监测监控软件",
//       "MenuImg": "监控",
//       "TipsName": "污染源监测监控软件产品ReactShow",
//       "CodeList": "",
//       "Url": null
//   },
//   {
//       "ID": "5c751d3e-4b5d-4e1e-ade4-eb35253ca748",
//       "Name": "污染源安装调试软件",
//       "MenuImg": "权限",
//       "TipsName": "污染源安装调试软件产品ReactShow",
//       "CodeList": "",
//       "Url": null
//   },
//   {
//       "ID": "70748d49-ce43-4a68-ab27-6795b9934893",
//       "Name": "污染源智慧运维软件",
//       "MenuImg": "可视化",
//       "TipsName": "污染源智慧运维软件产品ReactShow",
//       "CodeList": "",
//       "Url": null
//   },
//   {
//       "ID": "f6eb76ab-ce0b-4cfb-8626-2e0ec4435ec3",
//       "Name": "污染源异常数据识别软件",
//       "MenuImg": "扬尘",
//       "TipsName": "污染源异常数据识别软件产品ReactShow",
//       "CodeList": "",
//       "Url": null
//   },
//   {
//       "ID": "f4da6d42-4282-48de-88c4-c7c8434ebdb4",
//       "Name": "污染源监督核查软件",
//       "MenuImg": "质控",
//       "TipsName": "污染源监督核查软件产品ReactShow",
//       "CodeList": "",
//       "Url": null
//   }
// ]

import moment from 'moment';
const currentYear = moment().year(); // 获取当前年份
export const dateRangeList = [
  {
    key: '本月',
    value: [moment().startOf('month'), moment()],
  },
  {
    key: '本年',
    value: [moment().startOf('year'), moment()],
  },
  {
    key: '去年',
    value: [
      moment()
        .startOf('year')
        .subtract(1, 'year'),
      moment()
        .subtract(1, 'year')
        .endOf('year'),
    ],
  },
  {
    key: '前年',
    value: [
      moment()
        .startOf('year')
        .subtract(2, 'year'),
      moment()
        .subtract(2, 'year')
        .endOf('year'),
    ],
  },
  {
    key: '上半年',
    value: [moment(`${currentYear}-01-01`).startOf('year'), moment(`${currentYear}-06-30`)],
  },
  {
    key: '下半年',
    value: [
      moment()
        .startOf('year')
        .add(6, 'month'),
      moment().endOf('year'),
    ],
  },
  {
    key: '第一季度',
    value: [
      moment(`${currentYear}-01-01`).startOf('quarter'),
      moment(`${currentYear}-03-31`).endOf('quarter'),
    ],
  },
  {
    key: '第二季度',
    value: [
      moment(`${currentYear}-04-01`).startOf('quarter'),
      moment(`${currentYear}-06-30`).endOf('quarter'),
    ],
  },
  {
    key: '第三季度',
    value: [
      moment(`${currentYear}-07-01`).startOf('quarter'),
      moment(`${currentYear}-09-30`).endOf('quarter'),
    ],
  },
  {
    key: '第四季度',
    value: [
      moment(`${currentYear}-10-01`).startOf('quarter'),
      moment(`${currentYear}-12-31`).endOf('quarter'),
    ],
  },
];


export const fontSizeFn = size => {
  const scale = document.documentElement.clientWidth / 1680;
  return size * scale;
};