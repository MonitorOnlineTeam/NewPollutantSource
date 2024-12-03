export default {
  isShowBreadcrumb: true, // 是否显示面包屑
  mapCenter: [115.801757, 27.707438],
  // theme: 'dark',
  middlePageOpenMode: 'single', // 'single' or 'tabs'
  defaultSelectPollutantCode: 2, // 默认选中的污染物类型
  // isCarbon: true, // 是否是碳排放系统
  // 控制企业管理操作按钮显示 licence: 排污许可证，QR：二维码，unit：机组，operationTask: 运维任务，standingBook: 排放源清单台账，ElectronicFence: 电子围栏
  entShowBtns: ['licence', 'QR',  'operationTask',  'electronicFence'],
  // 是否开启加解密
  isEncryption: false,
  // 免登录账号信息
  autoLoginUserInfo: { username: 'system', password: 'P@ssw0rd_!@#$%' },
};
