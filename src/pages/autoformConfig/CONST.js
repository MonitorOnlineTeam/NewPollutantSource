export const DATASPURCE_SELECT_OPTIONS_CONST = {
  WidgetTypeArr: [
    { TypeValue: '文本框', TypeName: '文本框' },
    { TypeValue: '下拉列表框', TypeName: '下拉列表框' },
    { TypeValue: '日期框', TypeName: '日期框' },
    //{TypeValue: '时间框',TypeName: '时间框'},
    { TypeValue: '单选', TypeName: '单选' },
    { TypeValue: '多选', TypeName: '多选' },
    { TypeValue: '多选下拉列表', TypeName: '多选下拉列表' },
    //{TypeValue: '下拉列表树',TypeName: '下拉列表树'},
    { TypeValue: '下拉搜索树', TypeName: '下拉搜索树' },
    { TypeValue: '多选下拉搜索树', TypeName: '多选下拉搜索树' },
    //{TypeValue: '下拉表格',TypeName: '下拉表格'},
    //{TypeValue: '搜索表格框',TypeName: '搜索表格框'},
    { TypeValue: '数字', TypeName: '数字' },
    { TypeValue: '经度', TypeName: '经度' },
    { TypeValue: '纬度', TypeName: '纬度' },
    { TypeValue: '坐标集合', TypeName: '坐标集合' },
    { TypeValue: '上传', TypeName: '上传' },
    //{TypeValue: '富文本',TypeName: '富文本'},
    //{TypeValue: '密码框',TypeName: '密码框'},
    //{TypeValue: '地图',TypeName: '地图'},
    //{TypeValue: '三级行政区下拉框',TypeName: '三级行政区下拉框'}
  ],
  conditionTypeArr: [
    { TypeValue: '$=', TypeName: '相等' },
    { TypeValue: '$ne', TypeName: '不等' },
    { TypeValue: '$like', TypeName: '模糊匹配' },
    { TypeValue: '$gte', TypeName: '大于等于' },
    { TypeValue: '$gt', TypeName: '大于' },
    { TypeValue: '$lte', TypeName: '小于等于' },
    { TypeValue: '$lt', TypeName: '小于' },
    { TypeValue: '$nin', TypeName: '不包含' },
    { TypeValue: '$in', TypeName: '包含' }
  ],
  queryConditionTypeArr: [
    { TypeValue: '文本框', TypeName: '文本框' },
    { TypeValue: '下拉列表框', TypeName: '下拉列表框' },
    //{ TypeValue: '下拉列表树', TypeName: '下拉列表树' },
    //{ TypeValue: '下拉搜索树', TypeName: '下拉搜索树' },
    { TypeValue: '日期框', TypeName: '日期框' },
    { TypeValue: '单选', TypeName: '单选' },
    { TypeValue: '多选', TypeName: '多选' },
    { TypeValue: '下拉多选', TypeName: '下拉多选' },
    //{ TypeValue: '数字范围', TypeName: '数字范围' },
    //{ TypeValue: '下拉搜索表格', TypeName: '下拉搜索表格' },
    { TypeValue: '三级行政区下拉框', TypeName: '三级行政区下拉框' },
    { TypeValue: '日期范围', TypeName: '日期范围' },
    //{ TypeValue: '监控目标', TypeName: '监控目标' },
    { TypeValue: '监测点', TypeName: '监测点' }
  ],
  SearchTypeArr: [
    { TypeName: '不查询', TypeValue: 0 },
    { TypeName: '列表头部显示', TypeValue: 1 },
    { TypeName: '特殊位置显示', TypeValue: 2 }
  ],
  FormatType: [
    { TypeName: '不格式化', TypeValue: '' },
    { TypeName: '进度条', TypeValue: '进度条' },
    { TypeName: '标签', TypeValue: '标签' },
    { TypeName: '小圆点', TypeValue: '小圆点' },
    { TypeName: '超链接', TypeValue: '超链接' }
  ],
  AlignType: [
    { TypeName: '左对齐', TypeValue: 'left' },
    { TypeName: '右对齐', TypeValue: 'right' }
  ],
  MulType: [
    { TypeName: '无', TypeValue: 0 },
    { TypeName: '单选', TypeValue: 1 },
    { TypeName: '多选', TypeValue: 2 }
  ],
  foreignTypeArr: [
    { TypeName: '无', TypeValue: '0' },
    { TypeName: '表连接', TypeValue: '1' },
    { TypeName: '枚举', TypeValue: '2' }
  ],
  foreignRelTypeArr: [
    { TypeName: '左连接', TypeValue: 'left join' },
    { TypeName: '右连接', TypeValue: 'right join' },
    { TypeName: '内连接', TypeValue: 'inner join' }
  ],
  importTypeArr: [
    { TypeName: '不导入', TypeValue: '0' },
    { TypeName: '导入', TypeValue: '1' },
    { TypeName: '导入并校验重复', TypeValue: '2' }
  ],
  ValidateArray: [
    { TypeValue: "'number'", TypeName: "'数字'" },
    { TypeValue: "'double'", TypeName: "'数字或小数'" },
    { TypeValue: "'isHourRange'", TypeName: "'小时数'" },
    { TypeValue: "'maxLength[]'", TypeName: '最大长度[数值自行填写]' },
    { TypeValue: "'minLength[]'", TypeName: '最小长度[数值自行填写]' },
    { TypeValue: "'rangeLength[-]'", TypeName: '长度范围[最小值-最大值]' },
    { TypeValue: "'phone'", TypeName: '电话号码' },
    { TypeValue: "'mobile'", TypeName: '手机号码' },
    { TypeValue: "'email'", TypeName: '邮箱' },
    { TypeValue: "'fax'", TypeName: '传真' },
    { TypeValue: "'ZIP'", TypeName: '邮政编码' },
    { TypeValue: "'chinese'", TypeName: '汉字' },
    { TypeValue: "'isLongitude'", TypeName: '经度' },
    { TypeValue: "'isLatitude'", TypeName: '纬度' },
    { TypeValue: "'idcard'", TypeName: '中国居民身份证' },
    { TypeValue: "'QQ'", TypeName: 'QQ号码' },
    { TypeValue: "'mail'", TypeName: '邮箱' },
    { TypeValue: "'loginName'", TypeName: '只允许汉字、英文字母、数字及下划线' },
    { TypeValue: "'isExistDiy[]'", TypeName: '校验是否重复，需要填写校验服务地址例如：/conn1/isEqule?key=@@value，@@value为占位符，实际传递的为当前输入框值' },
    { TypeValue: "'enumValue'", TypeName: "'枚举值'" },
    { TypeValue: "'judge'", TypeName: "'中文字符，以及中文字符'" },
    { TypeValue: "'judgenumber'", TypeName: "'数字和横杠'" },
    { TypeValue: "'ip'", TypeName: "'IP'" },
    { TypeValue: "'port'", TypeName: "'端口'" },
    { TypeValue: "'require'", TypeName: "'必填'" }
  ]
}