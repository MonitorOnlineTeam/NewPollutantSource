export const menuList = [
  {
    "name": "基础信息配置",
    "path": "/console/baseConfig",
    "icon": "FundViewOutlined",
    "breadcrumbNames": "基础信息配置",
    "children": [
      {
        "name": "常规配置",
        "path": "/console/baseConfig/normal",
        "icon": "16/16",
        "breadcrumbNames": "基础信息配置/常规配置",
      },
      {
        "name": "数据库配置",
        "path": "/console/baseConfig/database",
        "icon": "16/16",
        "breadcrumbNames": "基础信息配置/数据库配置",
      },
      {
        "name": "数据采集",
        "path": "/console/baseConfig/collect",
        "icon": "16/16",
        "breadcrumbNames": "基础信息配置/数据采集",
      },
      {
        "name": "数据转发",
        "path": "/console/baseConfig/dataForwarding",
        "icon": "16/16",
        "breadcrumbNames": "基础信息配置/数据转发",
      },
      {
        "name": "定时任务",
        "path": "/console/baseConfig/crontab",
        "icon": "16/16",
        "breadcrumbNames": "基础信息配置/定时任务",
      },
    ]
  }
]

export function getMenuList(target, init = []) {
  target.forEach(item => {
    init.push(item);
    item.children && getMenuList(item.children, init);
  });
  return init;
}

export const CONST = {
  // 协议
  agreement: [
    {
      key: '标准协议',
      value: 'StandardAgreement'
    },
    {
      key: '质控212协议',
      value: 'QCAQuality212Collection'
    },
    {
      key: '大气标准协议',
      value: 'AirStandardAgreement'
    },
    {
      key: '空气质量协议-标况',
      value: 'AirQualityJZ'
    },
    {
      key: '空气质量协议-实况',
      value: 'AirQualityJR'
    },
  ]
}