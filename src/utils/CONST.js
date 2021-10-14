export const QCATypes = {
  "3101": "零点核查", "3102": "量程核查", "3104": "线性核查", "3105": "盲样核查", "3103": "响应时间核查",
}

// export const gasPollutantList = [
//   { value: "a21026", label: "SO2", },
//   { value: "a21002", label: "NOx", },
//   { value: "a19001", label: "O2", },
//   { value: "n00000", label: "N2", },
// ]

export const gasPollutantList = [
  // { value: "a21026", label: "SO2", },
  // { value: "a21002", label: "NOx", },
  { value: "a05001", label: "CO₂", },// 二氧化碳
  { value: "a19001", label: "O₂", }, // 氧气
  { value: "n00000", label: "N₂", },
]

export const DatabaseVersion = [
  { "value": "SQLSERVER", "key": "0" },
  { "value": "ORACLE", "key": "1" },
  { "value": "MYSQL", "key": "2" },
]


//菜单管理-类型
export const MenuTarget = [{
  TypeValue: 'Iframe',
  TypeName: '页面',
  Desc: '配置url地址，以iframe形式加载页面'
}, {
  TypeValue: 'Open',
  TypeName: '脚本&页面',
  Desc: '此配置可配置带onclik的脚本事件：alert("11");|url,后面的url链接会在相应的iframe中加载。'
}, {
  TypeValue: 'href',
  TypeName: '链接地址',
  Desc: '配置url地址，以ajaxload的形式加载配置的链接地址。'
}, {
  TypeValue: 'System',
  TypeName: '系统节点',
  Desc: '平台通过此配置加载功能菜单(集成项目中至少有一个系统配置节点)'
}, {
  TypeValue: 'SSO',
  TypeName: '单点登陆',
  Desc: '正在开发中'
}]
