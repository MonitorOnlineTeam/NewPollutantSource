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

// 根据污染物code获取name
export const getPollutantNameByCode = {
  '01': '实测烟尘',
  zs01: '折算烟尘',
  '02': '实测SO₂',
  zs02: '折算SO₂',
  '03': '实测NOx',
  zs03: '折算NOx',
  s01: '氧含量',
  s03: '烟气温度',
  s08: '烟气静压',
  s05: '烟气湿度',
  s02: '流速',
  b02: '流量',
};

// 根据污染物code获取颜色
export const getColorByName = {
  实测烟尘: '#38a2da',
  折算烟尘: '#32c5e9',
  '实测SO₂': '#e062ae',
  '折算SO₂': '#e690d1',
  实测NOx: '#8279ea',
  折算NOx: '#9D97F6',
  氧含量: '#9fe6b8',
  烟气温度: '#ffdb5c',
  烟气静压: '#ff9f7f',
  // 烟气湿度: '#c23531',
  烟气湿度: '#13c2c2',
  流速: '#c4ccd3',
  流量: '#61a0a8',
};

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
  // 虚假标记异常识别: 疑似机组停运未及时上报、疑似机组停运虚假标记、疑似超过标准标记数据无效
  7.1: [
    '928ec327-d30d-4803-ae83-eab3a93538c1',
    '3568b3c6-d8db-42f1-bbff-e76406a67f7f',
    '6675e28e-271a-4fb7-955b-79bf0b858e8e',
  ],
  //疑似行业数据波动范围异常
  8.1: ['b9601a0f-22af-4a07-927f-82d6369f2e12'],
  // 疑似恒定值微小波动、疑似零值微小波动、
  8.2: ['cda1f2e2-ec5f-425b-93d2-94ba62b17146', '0fa091a3-7a19-4c9e-91bd-c5a4bf2e9827'],
  // 疑似设备或工控机断电
  8.3: ['178fd470-ca31-480a-835a-3322fd57a4f0'],
};

const ModalName = {
  与其他监测数据趋势一致: '疑似替换分析仪监测样气',
  与其他监测数据高度一致: '疑似借用其他监测设备数据',
  与本设备历史数据高度一致: '疑似借用本设备历史数据',
  多个污染物数据趋势一致: '疑似引用错误原始信号值',
  颗粒物浓度波动异常: '疑似修改颗粒物斜率截距',
  超过预设值波动变小: '疑似使用随机数产生数据',
  超过预设值有规律波动: '疑似按预设公式处理数据',
  超过预设值数据恒定: '疑似超过预设值数据恒定',
  气态污染物波动大幅减小: '疑似修改分析仪量程',
  超标时数据异常陡降: '疑似远程控制监测数据',
  疑似采样管线断开: '疑似监测样品为空气',
  气态污染物异常陡降: '疑似监测样品混入氮气',
  湿度异常陡降: '疑似监测样品混入氧混合气',
  疑似采样管线不密封: '疑似监测样品混入空气',
  烟气排放量数值异常: '疑似修改烟道截面积',
  折算浓度异常: '疑似修改标准过量空气系数',
  污染物排放量异常: '疑似修改速度场系数',
  计算公式或备案参数异常: '疑似计算公式或备案参数错误',
  机组停运未做停运标识: '疑似机组停运未及时上报',
  疑似数据标记异常: '疑似超过排放限值标记数据无效',
  停运标记不符合停运特征: '疑似机组停运错误标记',
  数据零值微小波动: '零值微小波动',
  数据恒定值微小波动: '恒定值微小波动',
  设备或工控机断电: '疑似设备或工控机断电',
  数据波动范围超行业特征: '疑似行业数据波动范围异常',
};

export const ModalNameConversion = name => {
  // if (ModalName[name]) {
  //   return ModalName[name];
  // }
  return name;
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
