export const INDUSTRYS = {
  'cement': 2,
  'electricity': 1,
  'steel': 3,
}
// { name: '远程监控', value: MonVolume },
//       { name: '生产报表', value: ReportVolume },
//       { name: '发票或结算确认单', value: Consumption },
export const GET_SELECT_LIST = [
  { "key": '1', "value": "远程监控" },
  { "key": '2', "value": "生产报表" },
  { "key": '3', "value": "发票或结算确认单" },
];

export const maxWait = 500;


export const SUMTYPE = {
  cement: {
    '化石燃料燃烧': 'w-foss',
    '替代': 'w-af',
    '工业生产过程': 'w-pd',
    '电力': 'w-dis',
    '热力': 'w-hd',
    '碳酸盐分解': 'w-cb',
    '生料': 'w-nf',
    '协同处置废弃物': 'w-cd',
  },
  electricity: {
    '化石燃料燃烧': 'p-foss',
    '脱硫过程': 'p-dp',
    '电力': 'p-pd',
  }
}

export const SELECT_TYPE = {
  cement: {
    '替代': 'T',
  }
}