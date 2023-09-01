export const ChartDefaultSelected = {
  // 疑似监测样品为空气
  '9104ab9f-d3f3-4bd9-a0d9-898d87def4dd': ['实测NOx'],
  // 疑似监测样品混入氮气
  '1fed575c-48d7-4eef-9266-735fe4bbdb2a': ['实测NOx'],
  // 疑似监测样品混入空气
  '5520e6f2-ac4a-4f24-bafd-48746a13f4a4': ['实测NOx'],
  // 疑似监测样品混入氧混合气
  '1b9afa8d-1200-4fb1-aab0-a59936c3f22d': ['实测NOx'],
  // 疑似人为修改过量空气系数
  '3d209ce2-da92-44c4-916b-8874d05da558': ['实测SO₂'],
  // 疑似人为修改速度场系数
  'ce61d9a9-5d0d-4b66-abbd-72a89e823ee2': ['实测SO₂'],
  // 疑似人为修改颗粒物斜率截距
  '5bfd23c7-03da-4f4b-a258-a9c618774ab9': ['实测烟尘'],
  // 疑似超过预设值数据恒定
  '1a606047-6f21-4357-a459-03ef7788e09a': ['实测SO₂', '实测NOx'],
  // 疑似使用随机数产生数据
  '39680c93-e03f-42cf-a21f-115255251d4e': ['实测SO₂', '实测NOx'],
  // 疑似按预设公式处理数据
  '983cd7b9-55e1-47f3-b369-2df7bc0a6111': ['实测SO₂', '实测NOx'],
  // 疑似篡改分析仪量程
  '069ab699-428a-4f4b-8df7-915d6b4f3215': ['实测SO₂', '实测NOx'],
  'ab2bf5ec-3ade-43fc-a720-c8fd92ede402': ['实测SO₂', '实测NOx'],
  // 疑似机组停运未及时上报
  '928ec327-d30d-4803-ae83-eab3a93538c1': ['实测NOx'],
  // 疑似机组停运虚假标记
  '3568b3c6-d8db-42f1-bbff-e76406a67f7f': ['实测NOx'],
};

export const checkType = {
  1: '工况正常',
  2: '核实有异常',
  3: '待核实',
};

// 全企业波动范围默认污染物
export const PollutantListConst = [
  { PollutantName: '实测烟尘', PollutantCode: '01' },
  { PollutantName: '实测SO₂', PollutantCode: '02' },
  { PollutantName: '实测NOx', PollutantCode: '03' },
  { PollutantName: '烟气温度', PollutantCode: 's03' },
  { PollutantName: '烟气静压', PollutantCode: 's08' },
  { PollutantName: '烟气湿度', PollutantCode: 's05' },
  { PollutantName: '流速', PollutantCode: 's02' },
  { PollutantName: '氧含量', PollutantCode: 's01' },
  { PollutantName: '流量', PollutantCode: 'b02' },
];

export const ModelNumberIdsDatas = {
  all: [],
  // 波动范围异常分析：疑似篡改分析仪量程、疑似人为修改颗粒物斜率截距
  2.2: ['069ab699-428a-4f4b-8df7-915d6b4f3215', '5bfd23c7-03da-4f4b-a258-a9c618774ab9'],
  // 样气异常识别:疑似监测样品为空气,疑似监测样品混入氮气,疑似监测样品混入空气,疑似监测样品混入氧混合气
  4.1: [
    '9104ab9f-d3f3-4bd9-a0d9-898d87def4dd',
    '1fed575c-48d7-4eef-9266-735fe4bbdb2a',
    '5520e6f2-ac4a-4f24-bafd-48746a13f4a4',
    '1b9afa8d-1200-4fb1-aab0-a59936c3f22d',
  ],
  // 参数变化识别：疑似人为修改烟道截面积、疑似人为修改过量空气系数、疑似人为修改速度场系数、疑似计算公式错误
  5.1: [
    'c934b575-a357-4a2c-b493-02849ce9cee3',
    '3d209ce2-da92-44c4-916b-8874d05da558',
    'ce61d9a9-5d0d-4b66-abbd-72a89e823ee2',
    'a59cce2a-8558-4c42-8a45-4d8402e4b29d',
  ],
  // 模拟监测数据:  疑似超过预设值数据恒定、疑似疑似使用随机数产生数据、疑似按预设公式处理数据、疑似远程控制监测数据
  5.2: [
    '1a606047-6f21-4357-a459-03ef7788e09a',
    '39680c93-e03f-42cf-a21f-115255251d4e',
    '983cd7b9-55e1-47f3-b369-2df7bc0a6111',
    'b52087fb-563c-4939-a11f-f86b10da63c1',
  ],
  // 多排放源数据一致性分析: 疑似借用其他合格监测设备数据、疑似替换分析仪监测样气
  6.1: ['c0af25fb-220b-45c6-a3de-f6c8142de8f1', 'ab2bf5ec-3ade-43fc-a720-c8fd92ede402'],
  // 同一排放源时间序列数据相似分析： 疑似借用本设备合格历史数据
  6.2: ['d5dea4cc-bd6c-44fa-a122-a1f44514b465'],
  // 多组分数据相关性分析: 疑似引用错误、虚假原始信号值
  6.3: ['f021147d-e7c6-4c1d-9634-1d814ff9880a'],
  // 虚假标记异常识别: 疑似机组停运未及时上报、疑似机组停运虚假标记、疑似超过标准标记数据无效、疑似恒定值微小波动、疑似零值微小波动
  7.1: [
    '928ec327-d30d-4803-ae83-eab3a93538c1',
    '3568b3c6-d8db-42f1-bbff-e76406a67f7f',
    '6675e28e-271a-4fb7-955b-79bf0b858e8e',
    'cda1f2e2-ec5f-425b-93d2-94ba62b17146',
    '0fa091a3-7a19-4c9e-91bd-c5a4bf2e9827',
  ],
};

// export const ChartDefaultSelected = {/*  */
//   // 疑似监测样品为空气
//   '9104ab9f-d3f3-4bd9-a0d9-898d87def4dd': [
//     {
//       PollutantCode: '03',
//       PollutantName: '实测NOx',
//     },
//   ],
//   // 疑似监测样品混入氮气
//   '1fed575c-48d7-4eef-9266-735fe4bbdb2a': [
//     {
//       PollutantCode: '03',
//       PollutantName: '实测NOx',
//     },
//   ],
//   // 疑似监测样品混入空气
//   '5520e6f2-ac4a-4f24-bafd-48746a13f4a4': [
//     {
//       PollutantCode: '03',
//       PollutantName: '实测NOx',
//     },
//   ],
//   // 疑似监测样品混入氧混合气
//   '1b9afa8d-1200-4fb1-aab0-a59936c3f22d': [
//     {
//       PollutantCode: '03',
//       PollutantName: '实测NOx',
//     },
//   ],
//   // 疑似人为修改过量空气系数
//   '3d209ce2-da92-44c4-916b-8874d05da558': [
//     {
//       PollutantCode: '02',
//       PollutantName: '实测SO₂',
//     },
//   ],
//   // 疑似人为修改速度场系数
//   'ce61d9a9-5d0d-4b66-abbd-72a89e823ee2': [
//     {
//       PollutantCode: '02',
//       PollutantName: '实测SO₂',
//     },
//   ],
//   // 疑似人为修改颗粒物斜率截距
//   '5bfd23c7-03da-4f4b-a258-a9c618774ab9': [
//     {
//       PollutantCode: '01',
//       PollutantName: '实测烟尘',
//     },
//   ],
//   // 疑似超过预设值数据恒定
//   '1a606047-6f21-4357-a459-03ef7788e09a': [
//     {
//       PollutantCode: '02',
//       PollutantName: '实测SO₂',
//     },
//     {
//       PollutantCode: '03',
//       PollutantName: '实测NOx',
//     },
//   ],
//   // 疑似使用随机数产生数据
//   '39680c93-e03f-42cf-a21f-115255251d4e': [
//     {
//       PollutantCode: '02',
//       PollutantName: '实测SO₂',
//     },
//     {
//       PollutantCode: '03',
//       PollutantName: '实测NOx',
//     },
//   ],
//   // 疑似按预设公式处理数据
//   '983cd7b9-55e1-47f3-b369-2df7bc0a6111': [
//     {
//       PollutantCode: '02',
//       PollutantName: '实测SO₂',
//     },
//     {
//       PollutantCode: '03',
//       PollutantName: '实测NOx',
//     },
//   ],
//   // 疑似篡改分析仪量程
//   '069ab699-428a-4f4b-8df7-915d6b4f3215': [
//     {
//       PollutantCode: '02',
//       PollutantName: '实测SO₂',
//     },
//     {
//       PollutantCode: '03',
//       PollutantName: '实测NOx',
//     },
//   ],
//   // 疑似机组停运未及时上报
//   '928ec327-d30d-4803-ae83-eab3a93538c1': [
//     {
//       PollutantCode: '03',
//       PollutantName: '实测NOx',
//     },
//   ],
//   // 疑似机组停运虚假标记
//   '3568b3c6-d8db-42f1-bbff-e76406a67f7f': [
//     {
//       PollutantCode: '03',
//       PollutantName: '实测NOx',
//     },
//   ],
// };
