export const before = '/rest/PollutantSourceApi';
export const API = {
  //
  systemApi: {
    // 获取系统配置
    GetSystemConfigInfo: before + '/ConfigureApi/GetSystemConfigInfo',
    // 获取权限菜单
    GetSysMenuByUserID: before + '/MenuApi/GetSysMenuByUserID',
    // 获取中间页系统列表
    GetSysList: before + '/MenuApi/GetSysList',
    // 手机下载特殊情况
    IfSpecial: before + '/ConfigureApi/IfSpecial',
  },
  autoFormApi: {
    // 获取已配置的数据源
    GetDBSourceTree: before + '/AutoFormConfigApi/GetDBSourceTree',
    // 获取数据库连接配置
    GetDBSourceList: before + '/AutoFormConfigApi/GetDBSourceList',
    // 添加修改数据库连接配置
    SaveDbSource: before + '/AutoFormConfigApi/SaveDbSource',
    // 添加保存字段
    SaveField: before + '/AutoFormConfigApi/SaveField',
    // 删除数据库连接配置
    DelDbSource: before + '/AutoFormConfigApi/DelDbSource',
    // 获取数据源树
    GetTables: before + '/AutoFormConfigApi/GetTables',
    // 获取字段配置信息
    GetCfgFiledsDataFromDbByTableName:
      before + '/AutoFormConfigApi/GetCfgFiledsDataFromDbByTableName',
    // 根据表id获取数据源基础信息
    TableConfig: before + '/AutoFormConfigApi/TableConfig',
    // 根据表名返回该表的主键
    GetPkByTableName: before + '/AutoFormConfigApi/GetPkByTableName',
    // 验证数据源ID是否存在
    ConfigIDisExisti: before + '/AutoFormConfigApi/ConfigIDisExisti',
    // 数据源基础信息添加
    TableConfigAdd: before + '/AutoFormConfigApi/TableConfigAdd',
    // 返回没有配置到数据源中的表字段
    GetNotinCfgField: before + '/AutoFormConfigApi/GetNotinCfgField',
    // 编辑数据源配置
    SaveFieldsConfig: before + '/AutoFormConfigApi/SaveFieldsConfig',
    // 查询列表按钮配置
    GetButtonsByConfigID: before + '/AutoFormConfigApi/GetButtonsByConfigID',
    // 获取页面的配置信息
    GetTableExtend: before + '/AutoFormConfigApi/GetTableExtend',
    // 保存按钮配置
    SaveCfgButtons: before + '/AutoFormConfigApi/SaveCfgButtons',
    // 保存页面样式和脚本配置
    SaveTableExtend: before + '/AutoFormConfigApi/SaveTableExtend',
    // 数据源基础信息修改
    TableConfigUpdate: before + '/AutoFormConfigApi/TableConfigUpdate',
    // 删除配置表、字段、扩展信息
    DeleteTreeConfig: before + '/AutoFormConfigApi/DeleteTreeConfig',
    // 添加子菜单
    AddMenuManagement: before + '/AutoFormConfigApi/AddMenuManagement',
    // 菜单修改
    UpdateMenuManagement: before + '/AutoFormConfigApi/UpdateMenuManagement',
    // 菜单管理删除
    DelectMenuManagement: before + '/AutoFormConfigApi/DelectMenuManagement',
    // 获取菜单列表
    GetMenuInfos: before + '/AutoFormConfigApi/GetMenuInfos',
    // 导出数据源配置
    ExportConsoleConfig: before + '/AutoFormConfigApi/ExportConsoleConfig',
    // 导入数据源配置
    ImportConsoleConfig: before + '/AutoFormConfigApi/ImportConsoleConfig',
    // ------------------------------------------------------------------------------------------------

    // 分页获取列表数据
    GetListPager: before + '/AutoFormDataApi/GetListPager',
    // 获取页面配置信息
    GetPageConfigInfo: before + '/AutoFormDataApi/GetPageConfigInfo',
    // 获取列表字段列配置
    GetListColumns: before + '/AutoFormDataApi/GetListColumns',
    // 数据添加
    PostAutoFromDataAdd: before + '/AutoFormDataApi/PostAutoFromDataAdd',
    // 数据编辑
    PostAutoFromDataUpdate: before + '/AutoFormDataApi/PostAutoFromDataUpdate',
    // 数据删除
    PostAutoFromDataDelete: before + '/AutoFormDataApi/PostAutoFromDataDelete',
    // 获取编辑或添加页面表单
    GetFormData: before + '/AutoFormDataApi/GetFormData',
    // 生成导出模板
    ExportTemplet: before + '/AutoFormDataApi/ExportTemplet',
    // 导出数据
    ExportDataExcel: before + '/AutoFormDataApi/ExportDataExcel',
    // 导入数据
    ImportDataExcel: before + '/AutoFormDataApi/ImportDataExcel',
    // 校验数据重复
    VerificationData: before + '/AutoFormDataApi/VerificationData',
  },
  // 通用Api
  commonApi: {
    // 获取企业+排口
    GetEntAndPoint: before + '/EnterpriseApi/GetEntAndPoint',
    // 获取系统污染物
    GetPollutantTypeList: before + '/MonitorPollutantApi/GetPollutantTypeList',
    // 根据mn号获取站点下的所有污染物因子
    GetPollutantListByDgimn: before + '/MonitorPollutantApi/GetPollutantListByDgimn',
    // 获取污染物列表（单站多参，多站多参）
    GetAirOrDustPollutantAQI: before + '/MonitorPollutantApi/GetAirOrDustPollutantAQI',
    // 获取污染物因子 数据一览的表头
    GetPollutantTypeCode: before + '/MonitorPollutantApi/GetPollutantTypeCode',
    // 获取污染物列表
    GetPollutantCodeList: before + '/MonitorPollutantApi/GetPollutantCodeList',
    // 根据企业类型查询监测因子
    GetPollutantByType: before + '/MonitorPollutantApi/GetPollutantByType',
    // 获取关注程度
    GetAttentionDegreeList: before + '/RegionApi/GetAttentionDegreeList',
    // 获取行业树
    GetIndustryTree: before + '/AutoFormDataApi/GetIndustryTree',
    // 根据行政区查询空气站列表
    GetStationByRegion: before + '/AirStationApi/GetStationByRegion',
    // 根据排口获取标准污染物列表
    GetStandardPollutantsByDgimn: before + '/StandardLibraryApi/GetStandardPollutantsByDgimn',
    // 获取附件ID获取所有附件
    GetAttachmentList: before + '/UploadApi/GetAttachmentList',
    // 文件上传
    UploadFiles: before + '/UploadApi/UploadFiles',

    //
  },
  UploadApi: {
    GetAttachmentList: before + '/UploadApi/GetAttachmentList',//获取附件ID获取所有附件
    DeleteAttach: before + '/UploadApi/DeleteAttach',//删除文件
    UploadFiles: before + '/UploadApi/UploadFiles',//上传文件
    UploadPicture: before + '/UploadApi/UploadPicture',//上传图片
  },
  PollutantApi: {
    // 根据MN号获取污染物类型并获取污染物
    GetPollutantByDGIMN: before + '/MonitorPollutantApi/GetPollutantByDGIMN',
    // 根据MN号获取监测点污染物类型下的关联的污染物
    GetMonitorRelationPollutantByDGIMN:
      before + '/MonitorPollutantApi/GetMonitorRelationPollutantByDGIMN',
  },
  LoginApi: {
    // 登录
    Login: before + '/LoginApi/Login',
    //  重置密码
    ResetPwd: before + '/LoginApi/ResetPwd',
    // 验证旧密码是否一致
    VertifyOldPwd: before + '/LoginApi/VertifyOldPwd',
    // 修改密码
    ChangePwd: before + '/LoginApi/ChangePwd',
    // 获取手机验证码
    GetVerificationCode: before + '/LoginApi/GetVerificationCode',
    // 获取token
    getToken: '/rest/PollutantSourceOAuth/connect/token',
  },
  // 行政区
  RegionApi: {
    // 获取行政区详细信息及层级关系
    GetRegionInfoByTree: before + '/RegionApi/GetRegionInfoByTree',
    // 根据行政区查询企业
    GetEntByRegion: before + '/EnterpriseApi/GetEntByRegion',
    // 行政区企业或监测点详情
    GetEntOrPointDetail: before + '/EnterpriseApi/GetEntOrPointDetail',
    // 根据行政区和关注程度查询企业
    GetEntByRegionAndAtt: before + '/EnterpriseApi/GetEntByRegionAndAtt',
    // 获取行政区
    GetRegions: before + '/RegionApi/GetRegions',
    // 获取所有省份及第一个省份下的市县
    GetXuRegions: before + '/RegionApi/GetXuRegions',
  },
  // BaseDataApi
  BaseDataApi: {
    // 年度考核列表
    GetAnnualAssessmentEntList: before + '/EnterpriseApi/GetAnnualAssessmentEntList',
    // 企业排放量列表
    GetEmissionEntList: before + '/EnterpriseApi/GetEmissionEntList',
    // 企业排放列表导出
    ExportEmissionEnt: before + '/EnterpriseApi/ExportEmissionEnt',
    // 企业排放量设置参与不参与
    UpdateEntFlag: before + '/EnterpriseApi/UpdateEntFlag',

    // 排放标准查询
    GetDischargeStandValue: before + '/MonitorPointApi/GetDischargeStandValue',

    // 异常标准查询
    GetExceptionStandValue: before + '/MonitorPointApi/GetExceptionStandValue',
    // 异常标准导出
    ExportExceptionStandValue: before + '/MonitorPointApi/ExportExceptionStandValue',
    // 根据企业Code获取监测点信息
    GetPointByEntCode: before + '/MonitorPointApi/GetPointByEntCode',
    // 待选监测点列表
    GetEmissionEntAndPoint: before + '/MonitorPointApi/GetEmissionEntAndPoint',
    // 添加停产
    AddOutputStop: before + '/OutputStopApi/AddOutputStop',
    // 修改停产
    UpdateOutputStop: before + '/OutputStopApi/UpdateOutputStop',
    // 删除停产
    DeleteOutputStopById: before + '/OutputStopApi/DeleteOutputStopById',
    // 根据条件将污染物设置为监测中或未监测
    UsePollutant: before + '/StandardLibraryApi/UsePollutant',
    // 是否考核此污染物
    UseStatisti: before + '/StandardLibraryApi/UseStatisti',
    // 获取监测污染物详情
    GetMonitorPointPollutantDetails: before + '/StandardLibraryApi/GetMonitorPointPollutantDetails',
    // 更新污染物设置标准
    EditMonitorPointPollutant: before + '/StandardLibraryApi/EditMonitorPointPollutant',
    // 添加企业排放量
    AddEmissionEnt: before + '/EnterpriseApi/AddEmissionEnt',
    // 待选考核企业列表
    GetAnnualAssessmentEntAndPoint: before + '/EnterpriseApi/GetAnnualAssessmentEntAndPoint',
    // 获取企业厂界信息
    GetEnterpriseCorporationCode: before + '/EnterpriseApi/GetEnterpriseCorporationCode',
    // 企业统计
    GetEntSummary: before + '/EnterpriseApi/GetEntSummary',
    // 停运列表
    GetStopList: before + '/OutputStopApi/GetStopList',
    // 删除考核企业
    DeleteAnnualAssessmentEntByID: before + '/EnterpriseApi/DeleteAnnualAssessmentEntByID',
    // 添加考核企业
    AddAnnualAssessmentEnt: before + '/EnterpriseApi/AddAnnualAssessmentEnt',
    // 删除企业排放量
    DeleteEmissionEntByID: before + '/EnterpriseApi/DeleteEmissionEntByID',
    // 一企一档企业查询
    GetEntRecordData: before + '/EnterpriseApi/GetEntRecordData',
    // 获取知识库数据
    GetKnowledgeBaseList: before + '/KnowledgeBase/GetKnowledgeBaseList',
    // 修改知识库查看或下载次数
    UpdateKnowledgeBaseViewCount: before + '/KnowledgeBase/UpdateKnowledgeBaseViewCount',

    //唐银项目获取治理设备
    GetTyMonitoringSituation: before + '/EnterpriseApi/GetTyMonitoringSituation',
    //唐银项目首页环保点位
    GetTyMonitorpollutantValues: `${before}/EnterpriseApi/GetTyMonitorpollutantValues`,
    //唐银项目获取地图图例
    Getlegends: `${before}/EnterpriseApi/GetTyMonitorpollutants`,
    //唐银项目所有点位监控信息 - 单个企业
    GetDataForSingleEnt: `${before}/EnterpriseApi/GetTyEntAndPoint`,
  },
  // 质控Api
  QualityControlApi: {
    // 发送质控命令
    SendQCACheckCMD: before + '/QCRemote/SendQCACheckCMD',

    // 获取零点核查结果
    GetZeroDataList: before + '/ZeroCheck/GetZeroDataList',
    // 导出零点核查
    ExportZeroDataList: before + '/ZeroCheck/ExportZeroDataList',
    // 获取质控日志和质控过程
    GetQCProcessData: before + '/QCProcess/GetQCProcessData',
    // 获取量程核查
    GetRangeDataList: before + '/RangeCheck/GetRangeDataList',
    // 导出量程核查
    ExportRangeDataList: before + '/RangeCheck/ExportRangeDataList',
    // 获取盲样核查数据
    GetSampleDataList: before + '/SampleCheck/GetSampleDataList',
    // 导出盲样核查
    ExportSampleDataList: before + '/SampleCheck/ExportSampleDataList',
    // 获取线性核查数据
    GetLinearDataList: before + '/LinearCheck/GetLinearDataList',
    // 导出线性核查
    ExportLinearDataList: before + '/LinearCheck/ExportLinearDataList',
    // 获取响应时间核查结果
    GetResponseDataList: before + '/ResponseTimeCheck/GetResponseDataList',
    // 导出响应时间核查
    ExportResponseDataList: before + '/ResponseTimeCheck/exportResponseDataList',
    // 获取示值误差核查结果
    GetErrorValueDataList: before + '/ErrorValueCheck/GetErrorValueDataList',
    // 导出示值误差核查
    ExportErrorValueDataList: before + '/ErrorValueCheck/ExportErrorValueDataList',

    // 获取标气下拉框
    GetQCGasBottle: before + '/QCAStandardGas/GetQCGasBottle',
    // 获取标气瓶子对应关系设置列表
    GetQCGasBottleList: before + '/QCAStandardGas/GetQCGasBottleList',
    // 编辑标气瓶子对应标气
    EditQCGasBottle: before + '/QCAStandardGas/EditQCGasBottle',
    // 获取质控污染物
    GetQCAPollutantByDGIMN: before + '/QCAStandardGas/GetQCAPollutantByDGIMN',
    // 添加标气方案及详细数据
    AddOrUpdGasProInfo: before + '/QCAStandardGas/AddOrUpdGasProInfo',
    // 获取标气方案列表
    GetGasProList: before + '/QCAStandardGas/GetGasProList',
    // 获取标气方案详情
    GetGasProInfo: before + '/QCAStandardGas/GetGasProInfo',
    // 删除标气方案
    DeleteGasProOne: before + '/QCAStandardGas/DeleteGasProOne',

    // 获取质控仪数据(获取单个质控基本信息)
    GetQCAnalyzerAndPoint: before + '/QCAnalyzerManagement/GetQCAnalyzerAndPoint',
    // 质控基本信息与关联信息添加
    AddQCAnalyzerAndPoint: before + '/QCAnalyzerManagement/AddQCAnalyzerAndPoint',
    // 获取盲样核查范围
    GetSampleRangeFlow: before + '/QCAnalyzerManagement/GetSampleRangeFlow',
    // 质控报警类型列表
    GetAlarmType: before + '/QCAlarmApi/GetAlarmType',
    // 获取报警数据
    GetAlarmDataList: before + '/QCAlarmApi/GetAlarmDataList',
    // 导出报警数据列表
    ExportGetAlarmDataList: before + '/QCAlarmApi/ExportGetAlarmDataList',

    // 获取运维人列表
    GetOperatorList: before + '/QCAOperator/GetOperatorList',
    // 导出运维人列表
    ExportOperaPerson: before + '/QCAOperator/ExportOperaPerson',
    // 获取运维人详情
    GetOperatorOne: before + '/QCAOperator/GetOperator',
    // 删除已上传照片
    DelOperatorPhoto: before + '/QCAOperator/DelOperatorPhoto',
    // 添加运维人
    AddOperator: before + '/QCAOperator/AddOperator',
    // 编辑运维人员
    UpdOperator: before + '/QCAOperator/UpdOperator',
    // 删除运维人
    DelOperator: before + '/QCAOperator/DelOperator',
    // 获取标准气管理
    GetQCStandard: before + '/QCAStandardGas/GetQCStandard',
    // 导出标准气信息
    ExportQCStandard: before + '/QCAStandardGas/ExportQCStandard',

    // 获取质控方案
    GetQCAPlanList: before + '/QCCheckConfig/GetQCAPlanList',
    // 参数备案列表
    GetQCPlanDetailsFile: before + '/QCCheckConfig/GetQCPlanDetailsFile',
    // 添加或修改质控方案
    AddOrUpdQCPlan: before + '/QCCheckConfig/AddOrUpdQCPlan',
    // 应用方案
    ApplyQCPlan: before + '/QCCheckConfig/ApplyQCPlan',
    // 方案删除
    DelQCPlan: before + '/QCCheckConfig/DelQCPlan',
    // 质控核查 质控核查设置 列表
    GetCycleQualityControlList: before + '/QCCheckConfig/GetCycleQualityControlList',
    // 添加或修改周期质控配置
    AddOrUpdCycleQualityControl: before + '/QCCheckConfig/AddOrUpdCycleQualityControl',
    //删除周期质控配置
    DeleteCycleQualityControl: before + '/QCCheckConfig/DeleteCycleQualityControl',
    // 下发周期质控配置
    SendQCCycleCmd: before + '/QCCheckConfig/SendQCCycleCmd',
    // 查询质控日志
    GetQCDetailRecord: before + '/QCRecord/GetQCDetailRecord',
    // 查询质控日志
    GetQCLog: before + '/QCRecord/GetQCRecord',
    // 获取质控仪状态
    GetQCAStatus: before + '/QCStatus/GetQCAStatus',

    // 更改质控标准要求
    UpdQCStandard: before + '/QCStandard/UpdQCStandard',
  },
  // 点位API
  PointApi: {
    // 添加监测点信息
    AddPoint: before + '/MonitorPointApi/AddPoint',
    // 删除监测点（支持批量）
    DeletePoints: before + '/MonitorPointApi/DeletePoints',
    // 更新监测点信息
    UpdatePoint: before + '/MonitorPointApi/UpdatePoint',
    // 获取企业下各个排口的二维码
    CreateQRCode: before + '/MonitorPointApi/CreateQRCode',
    // 根据批量监控目标id获取监测点（删除监控目标用）
    queryPointForTarget: before + '/MonitorPointApi/queryPointForTarget',
    // 站点统计（企业或者空气站
    GetPointSummary: before + '/MonitorPointApi/GetPointSummary',
    // 获取站点详情
    GetPointModelInfo: before + '/MonitorPointApi/GetPointModelInfo',
    // 获取监测点列表
    GetViewPoint: before + '/MonitorPointApi/GetViewPoint',
    // 根据DGIMN查询单个站点详情
    GetMonitorPointList: before + '/MonitorTargetApi/GetMonitorPointList',
  },
  // 仪器信息
  InstrumentApi: {
    // 获取站点仪器信息
    GetPointInstrument: before + '/InstrumentApi/GetPointInstrument',
    // 获取仪器信息列表
    GetInstrumentNameList: before + '/InstrumentApi/GetInstrumentNameList',
    // 获取仪器厂商列表
    GetInstrumentFactoryList: before + '/InstrumentApi/GetInstrumentFactoryList',
    // 获取仪器分析方法
    GetInstrumentFactoryMethod: before + '/InstrumentApi/GetInstrumentFactoryMethod',
    // 获取仪器监测项目
    GetInstrumentMonitorItem: before + '/InstrumentApi/GetInstrumentMonitorItem',
    // 添加仪器与站点关系
    AddInstrumentPointRelation: before + '/InstrumentApi/AddInstrumentPointRelation',
    // 删除站点仪器对应关系
    DeleteInstrumentPointRelation: before + '/InstrumentApi/DeleteInstrumentPointRelation',
  },

  // 动态管控服务Api
  DymaicControlApi: {
    // 获取系统工况参数
    GetProcessFlowTable: before + '/DymaicParameter/GetProcessFlowTable',
    // 动态管控 参数备案 列表
    GetParameterFilingList: before + '/DymaicParameter/GetParameterFilingList',
    // 获取仪器列表
    GetParaPollutantCodeList: before + '/DymaicParameter/GetParaPollutantCodeList',
    // 获取参数码表
    GetParaCodeList: before + '/DymaicParameter/GetParaCodeList',
    // 添加或修改参数备案列表
    AddOrUpdParameterFiling: before + '/DymaicParameter/AddOrUpdParameterFiling',
    // 删除参数备案列表
    DeleteParameterFiling: before + '/DymaicParameter/DeleteParameterFiling',
    // 参数备案
    UpdateApproveState: before + '/DymaicParameter/UpdateApproveState',
    // 查询历史参数列表
    GetHistoryParaCodeList: before + '/DymaicParameter/GetHistoryParaCodeList',
    // 获取历史工况参数
    GetProcessFlowTableHistoryDataList:
      before + '/DymaicParameter/GetProcessFlowTableHistoryDataList',
    // 获取关键参数
    GetParameterSnapshot: before + '/DymaicParameter/GetParameterSnapshot',
    // 数据提取
    SendGetDataCMD: before + '/DymaicParameter/SendGetDataCMD',
    // 获取数据可视化列表
    GetVisualizationChartList: before + '/DymaicData/GetVisualizationChartList',
    // 获取数据监控 - 污染物信息
    GetProcessFlowChartStatus: before + '/DymaicData/GetProcessFlowChartStatus',
  },
  // 大气站api
  AirDataApi: {
    // 获取数据获取率 - 表头
    GetDataAcquisitionRateColumn: before + '/AcquisitionRate/GetDataAcquisitionRateColumn',
    // 获取数据获取率 - table数据
    GetDataAcquisitionRate: before + '/AcquisitionRate/GetDataAcquisitionRate',
    // 气象图数据
    GetMeteData: before + '/AirAnalysis/GetMeteData',
    // 单站多参、多站多参获取数据
    GetAirPointData: before + '/AirAnalysis/GetAirPointData',
    // 空气质量日排名
    GetAirDayDataRank: before + '/AirAnalysis/GetAirDayDataRank',
    // 获取累计综合空气质量排名
    GetCumulativeAirRank: before + '/AirAnalysis/GetCumulativeAirRank',
    // 导出 - 累计综合空气质量排名
    ExportCumulativeAirRank: before + '/AirAnalysis/ExportCumulativeAirRank',
    // 获取优良天数报表
    GetExcellentDays: before + '/AirAnalysis/GetExcellentDays',
    // 导出优良天数报表
    ExportExcellentDays: before + '/AirAnalysis/ExportExcellentDays',
    // 获取六参数
    GetPolRoseMapData: before + '/AirAnalysis/GetPolRoseMapData',
    // 导出空气质量日排名
    ExportAirDayDataRank: before + '/AirAnalysis/ExportAirDayDataRank',
    // 单站多参、多站多参导出
    ExportAirPointData: before + '/AirAnalysis/ExportAirPointData',
    // 获取污染玫瑰图数据
    GetRoseMapData: before + '/AirAnalysis/GetRoseMapData',
    // 克里金差值图 - 空气质量排名
    GetAirHourDataRank: before + '/AirAnalysis/GetAirHourDataRank',
    // 月份AQI分析
    GetMonthAQIData: before + '/MonAirAQIData/GetMonthAQIData',
    // 月份首要污染物分析
    GetMonthAQIPrimaryPol: before + '/MonAirAQIData/GetMonthAQIPrimaryPol',
    // 获取污染日历数据
    GetDayAQIPolCalendar: before + '/MonAirAQIData/GetDayAQIPolCalendar',
    // 目标考核台账
    GetTargetAssessmentData: before + '/MonAirAQIData/GetTargetAssessmentData',
    // 导出-空气站优良统计
    ExportCityStationAQI: before + '/MonAirAQIData/ExportCityStationAQI',
    // 空气站优良统计
    GetCityStationAQI: before + '/MonAirAQIData/GetCityStationAQI',
    // 导出-获取AQI监测点数据报表
    ExportGetAirQualityDayReport: before + '/MonAirAQIData/ExportGetAirQualityDayReport',
    // 获取AQI监测点数据报表
    GetAirQualityDayReport: before + '/MonAirAQIData/GetAirQualityDayReport',
    // 统计AQI
    CalculationAQIData: before + '/MonAirAQIData/CalculationAQIData',

    // 获取综合指数年报
    GetYearComposite: before + '/ComparisonComposite/GetYearComposite',
    // 获取综合指数范围同比报表
    GetTimeSlotCompositeCompare: before + '/ComparisonComposite/GetTimeSlotCompositeCompare',
    // 综合指数范围同比报表 - 导出
    ExportTimeSlotCompositeCompareNum:
      before + '/ComparisonComposite/ExportTimeSlotCompositeCompareNum',
    // 导出-多时间段对比综合指数
    ExportTimeComparisonCompositeNum:
      before + '/ComparisonComposite/ExportTimeComparisonCompositeNum',
    // 导出综合指数年报
    ExportYearCompositeNum: before + '/ComparisonComposite/ExportYearCompositeNum',
    // 获取多时间段对比综合指数
    GetTimeComparisonComposite: before + '/ComparisonComposite/GetTimeComparisonComposite',
    // 导出-时间段综合指数
    ExportTimeSlotCompositeNum: before + '/ComparisonComposite/ExportTimeSlotCompositeNum',
    // 获取时间段综合指数
    GetTimeSlotComposite: before + '/ComparisonComposite/GetTimeSlotComposite',
    // 导出-月综合指数报表
    ExportMonthCompositeNum: before + '/ComparisonComposite/ExportMonthCompositeNum',
    // 获取月综合指数
    GetMonthComposite: before + '/ComparisonComposite/GetMonthComposite',
    //
  },
  // 碳排放
  CO2EmissionsApi: {
    // 获取缺省值码表
    GetCO2EnergyType: before + '/AccountingMode/GetCO2EnergyType',
    // 获取温室气体排放量总和
    GetCO2TableSum: before + '/AccountingMode/GetCO2TableSum',
    // 二氧化碳物料衡算法(热电) -排放量查询
    GetCO2SumData: before + '/AccountingMode/GetCO2SumData',
    // 二氧化碳物料衡算法（水泥） -排放量查询
    GetCO2CementSumData: before + '/AccountingMode/GetCO2CementSumData',
    // 二氧化碳物料衡算法（钢铁） -排放量查询
    GetCO2SteelSumData: before + '/AccountingMode/GetCO2SteelSumData',
    // 计算公式
    CalGHGData: before + '/AccountingMode/CalGHGData',
    // 判断当前企业月份核算边界是否存在重复数据
    JudgeIsRepeat: before + '/AccountingMode/JudgeIsRepeat',
    // 获取不确定性码表信息
    GetUnceratianData: before + '/AccountingMode/GetUnceratianData',
    // 不确定性计算公式
    CalUnceratianData: before + '/AccountingMode/CalUnceratianData',
    // 获取机组信息
    GetCrewInfo: before + '/AccountingMode/GetCrewInfo',
    // 添加机组信息
    AddCrewInfo: before + '/AccountingMode/AddCrewInfo',
    // 删除机组
    DeleteCrewInfo: before + '/AccountingMode/DeleteCrewInfo',
    // 修改机组
    UpdateCrewInfo: before + '/AccountingMode/UpdateCrewInfo',
    // 温室气体配额消耗预警
    GetCO2QuotaAlarm: before + '/GreenhouseGasAnalysis/GetCO2QuotaAlarm',
    // 温室气体线性回归分析
    GetCO2LinearAnalysis: before + '/GreenhouseGasAnalysis/GetCO2LinearAnalysis',
    // 月度排放量比较
    GetCO2MonthDischarge: before + '/GreenhouseGasAnalysis/GetCO2MonthDischarge',
    // 获取温室气体排放报告
    GetCO2ReportList: before + '/GreenhouseGasAnalysis/GetCO2ReportList',
    // 生成温室气体排放报告
    DoReportCO2: before + '/GreenhouseGasAnalysis/DoReportCO2',
    // 获取柱状体详细数据
    GetCO2QuotaList: before + '/GreenhouseGasAnalysis/GetCO2QuotaList',
    // 监测数据比对分析报表
    GetComparisonOfMonData: before + '/AccountingMode/GetComparisonOfMonData',
    //  获取监测数据线性回归分析报表
    GetCO2LinearAnalysisOther: before + '/AccountingMode/GetCO2LinearAnalysisOther',
  },
  // 用户权限
  AuthorityApi: {
    // 获取角色详情及层级关系
    GetRoleInfoByTree: before + '/RoleApi/GetRoleInfoByTree',
    // 获取单个角色信息
    GetRoleInfoByID: before + '/RoleApi/GetRoleInfoByID',
    // 获取角色树
    GetRolesTreeAndObj: before + '/RoleApi/GetRolesTreeAndObj',
    // 获取当前角色的菜单
    GetMenuByRoleID: before + '/RoleApi/GetMenuByRoleID',
    // 获取当前角色的用户
    GetUserByRoleId: before + '/RoleApi/GetUserByRoleId',
    // 获取当前角色的菜单
    GetMenuByRoleID: before + '/RoleApi/GetMenuByRoleID',
    // 获取根节点下拉选择权限（角色）
    GetParentTree: before + '/RoleApi/GetParentTree',
    // 获取角色树
    GetRolesTree: before + '/RoleApi/GetRolesTree',
    // 新增角色信息
    InsertRoleInfo: before + '/RoleApi/InsertRoleInfo',
    // 删除角色信息
    DelRoleInfo: before + '/RoleApi/DelRoleInfo',
    // 修改角色信息
    UpdRoleInfo: before + '/RoleApi/UpdRoleInfo',
    // 给角色添加用户（可批量）
    InsertRoleByUser: before + '/RoleApi/InsertRoleByUser',
    // 获取部门区域过滤
    GetGroupRegionFilter: before + '/ConfigureApi/GetGroupRegionFilter',
    // 新报警设置 包含部门和角色（列表）
    GetAlarmPushDepOrRole: before + '/AuthorizeApi/GetAlarmPushDepOrRole',

    // 获取部门详细信息及层级关系
    GetDepInfoByTree: before + '/DepartmentApi/GetDepInfoByTree',
    // 获取部门树(带根结点)
    GetDepartTreeAndObj: before + '/DepartmentApi/GetDepartTreeAndObj',
    // 获取单个部门信息
    GetDepartInfoByID: before + '/DepartmentApi/GetDepartInfoByID',
    // 获取当前部门的用户
    GetUserByDepID: before + '/DepartmentApi/GetUserByDepID',
    // 获取当前部门选择的排口
    GetPointByDepID: before + '/DepartmentApi/GetPointByDepID',
    // 获取部门树
    GetDepartmentTree: before + '/DepartmentApi/GetDepartmentTree',
    // 新增部门信息
    InsertDepartInfo: before + '/DepartmentApi/InsertDepartInfo',
    // 删除部门信息
    DelDepartInfo: before + '/DepartmentApi/DelDepartInfo',
    // 修改部门信息
    UpdDepartInfo: before + '/DepartmentApi/UpdDepartInfo',
    // 给部门添加用户（可批量）
    InsertDepartByUser: before + '/DepartmentApi/InsertDepartByUser',
    // 获取当前部门的行政区
    GetRegionByDepID: before + '/DepartmentApi/GetRegionByDepID',
    // 给当前部门添加排口权限
    InsertPointFilterByDepID: before + '/AuthorizeApi/InsertPointFilterByDepID',
    // 给当前角色添加菜单权限
    InsertMenuByRoleID: before + '/AuthorizeApi/InsertMenuByRoleID',
    // 插入角色或部门报警权限关联
    InsertAlarmPushAuthor: before + '/AuthorizeApi/InsertAlarmPushAuthor',
    // 获取角色或部门报警权限数据
    GetAlarmPushAuthor: before + '/AuthorizeApi/GetAlarmPushAuthor',
    // 报警关联  选择
    InsertAlarmDepOrRole: before + '/AuthorizeApi/InsertAlarmDepOrRole',
    // 给部门添加行政区
    InsertRegionByUser: before + '/DepartmentApi/InsertRegionByUser',
    // 获取系统菜单名称
    GetMenuByLoginUser: before + '/MenuApi/GetMenuByLoginUser',
    // 获取菜单列表层级关系
    GetRoleMenuTree: before + '/MenuApi/GetRoleMenuTree',

    // 获取所有用户
    GetAllUser: before + '/UserApi/GetAllUser',
    // 给用户添加角色和部门
    InsertRoleDepForUser: before + '/UserApi/InsertRoleDepForUser',
    // 获取用户角色
    GetRoleByUserID: before + '/UserApi/GetRoleByUserID',
    // 获取用户部门
    GetDepByUserID: before + '/UserApi/GetDepByUserID',
    // 删除用户（假删除）
    DelUserAndRoleDep: before + '/UserApi/DelUserAndRoleDep',
    // 获取当前用户的按钮权限
    GetButtonByUserID: before + '/UserApi/GetButtonByUserID',
    // 获取所有部门和角色
    GetUserRolesGroupList: before + '/UserApi/GetUserRolesGroupList',
    // // 获取用户信息
    // GetUserList: before + '/UserApi/GetUserList',
  },
  // 监控Api
  MonitorDataApi: {
    // 获取各种类型数据列表
    GetAllTypeDataList: before + '/MonBasicDataApi/GetAllTypeDataList',
    // 获取各种类型数据列表(废水)
    GetAllTypeDataListWater: before + '/MonBasicDataApi/GetAllTypeDataListWater',
    // 获取各种类型数据列表(废气)
    GetAllTypeDataListGas: before + '/MonBasicDataApi/GetAllTypeDataListGas',
    // 获取小时数据一览
    AllTypeSummaryList: before + '/MonBasicDataApi/AllTypeSummaryList',
    // 原始数据包
    GetOriginalData: before + '/MonBasicDataApi/GetOriginalData',
    // 月站点平均值分析
    GetMonthPoint: before + '/MonBasicDataApi/GetMonthPoint',
    // 数据不可信列表
    GetUnTrustedList: before + '/MonBasicDataApi/GetUnTrustedList',
    // 获取异常数据记录汇总
    GetExceptionModel: before + '/ExceptionDataApi/GetExceptionModel',
    // 获取异常数据列表
    GetExceptionData: before + '/ExceptionDataApi/GetExceptionData',
    // 异常数据查询-师一级
    GetExceptionList: before + '/ExceptionDataApi/GetExceptionList',
    // 异常数据查询-排口
    GetExceptionPointList: before + '/ExceptionDataApi/GetExceptionPointList',
    // 获取缺失数据
    GetMissDataList: before + '/ExceptionDataApi/GetMissDataList',
    // 获取超标数据记录汇总
    GetOverModel: before + '/OverDataApi/GetOverModel',
    // 获取超标记录详细
    GetOverData: before + '/OverDataApi/GetOverData',
    // 超标次数查询
    GetOverStandardNum: before + '/OverDataApi/GetOverStandardNum',
    // 查询超标数据
    GetOverDataList: before + '/OverDataApi/GetOverDataList',
    // 超标分析报表列表
    GetOverDataAnalysisList: before + '/OverDataApi/GetOverDataAnalysisList',
    // 发送反控命令 - 数据提取（分钟、小时、日）
    SendSupplementMsg: before + '/DataQualityApi/SendSupplementMsg',
    // 获取数据补遗列表
    GetDataOrReferenceData: before + '/DataQualityApi/GetDataOrReferenceData',
    // 获取模板数据(参比数据)
    UploadTemplateAutoReference: before + '/DataQualityApi/UploadTemplateAutoReference',
    // 数据审核接口。带Wry的接口参数IsWry传true，否则传false
    GetAllTypeDataForFlag: before + '/DataQualityApi/GetAllTypeDataForFlag',
    // 修改标识 污染源
    UpdateDataWryFlag: before + '/DataQualityApi/UpdateDataWryFlag',
    // 修改标识 大气站
    UpdateDataAirFlag: before + '/DataQualityApi/UpdateDataAirFlag',
    // 导出数据审核接口。带Wry的接口参数IsWry传true，否则传false
    ExportAllTypeDataForFlag: before + '/DataQualityApi/ExportAllTypeDataForFlag',

    // 异常数据报告查询
    GetExceptionReportedList: before + '/ExceptionDataApi/GetExceptionReportedList',

    //
  },
  // 电力Api
  ElectricEnergyApi: {
    // 电力实时数据一览
    GetElectricRealTimeData: before + '/EnergyOverSee/GetElectricRealTimeData',
    // 获取监测同比分析数据--功率相关
    GetPowerWork: before + '/EnergyOverSee/GetPowerWork',
    // 获取电能环比
    GetPowerCompare: before + '/EnergyOverSee/GetPowerCompare',
    // 获取电能趋势
    GetPowerTrend: before + '/EnergyOverSee/GetPowerTrend',
  },
  // 报警Api
  AlarmApi: {
    // 右上角小铃铛 - 推送消息
    GetAlarmNotices: before + '/AlarmMessagesApi/GetAlarmNotices',
    // 获取异常报警列表
    GetDataExceptionAlarmPageList: before + '/AlarmMessagesApi/GetDataExceptionAlarmPageList',
    // 缺失数据报警
    GetDefectDataSummary: before + '/ExceptionAlarmApi/GetDefectDataSummary',
    // 缺失数据报警详情
    GetDefectPointDetail: before + '/ExceptionAlarmApi/GetDefectPointDetail',
    // 缺失数据报警详情
    GetDefectPointDetailRate: before + '/ExceptionAlarmApi/GetDefectPointDetailRate',
    //  超标报警审核率
    GetAlarmVerifyRate: before + '/OverAlarmApi/GetAlarmVerifyRate',
    // 超标报警审核率详细
    GetAlarmVerifyRateDetail: before + '/OverAlarmApi/GetAlarmVerifyRateDetail',
    // 超标报警核实率
    GetAlarmManagementRate: before + '/OverAlarmApi/GetAlarmManagementRate',
    // 超标报警核实率详细
    GetAlarmManagementRateDetail: before + '/OverAlarmApi/GetAlarmManagementRateDetail',
    // 超标报警处置详细
    GetAlarmManagementDetail: before + '/OverAlarmApi/GetAlarmManagementDetail',
    // 异常数据报警
    GetExceptionAlarmListForRegion: before + '/ExceptionAlarmApi/GetExceptionAlarmListForRegion',
    // 实时报警
    GetRealAlarmDataList: before + '/AlarmMessagesApi/GetRealAlarmDataList',
    //
    GetAlarmDealType: before + '/AlarmVerifyManageApi/GetAlarmDealType',
    // 运维报警核实关联
    GetOverToExamineOperation: before + '/AlarmVerifyManageApi/GetOverToExamineOperation',
    // 获取报警异常记录
    GetLocalMemoryExceptionProcessing:
      before + '/AlarmVerifyManageApi/GetLocalMemoryExceptionProcessing',
    // 报警核实添加
    AlarmVerifyAdd: before + '/AlarmVerifyManageApi/AlarmVerifyAdd',
    // 查看某个排口下处置后的报警信息
    GetAlarmRecordDetails: before + '/AlarmVerifyManageApi/GetAlarmRecordDetails',
    // 超标报警核实详细
    GetAlarmVerifyDetail: before + '/AlarmVerifyManageApi/GetAlarmVerifyDetail',
    // 异常数据报警 - 师下所有企业数据
    GetExceptionAlarmListForEnt: before + '/ExceptionAlarmApi/GetExceptionAlarmListForEnt',
    // 获取报警记录
    GetAlarmRecord: before + '/AlarmVerifyManageApi/GetAlarmAndExDetail',

    // GetDefectPointDetail: before + '/ExceptionAlarmApi/GetDefectPointDetail',
  },
  // 统计分析Api
  StatisticAnalysisApi: {
    // 获取行政区下传输有效率
    GetTransmissionEfficiencyForRegion:
      before + '/TransmissionEfficiencyApi/GetTransmissionEfficiencyForRegion',
    // 获取企业下传输有效率
    GetTransmissionEfficiencyForEnt:
      before + '/TransmissionEfficiencyApi/GetTransmissionEfficiencyForEnt',
    // 获取排口下传输有效率
    GetTransmissionEfficiencyForPoint:
      before + '/TransmissionEfficiencyApi/GetTransmissionEfficiencyForPoint',
    // --------------------------------------------------------------------------------
    // 根据数据类型查询排放量-师一级
    GetEmissionsListForRegion: before + '/EmissionsApi/GetEmissionsListForRegion',
    // 根据数据类型查询排放量--企业一级
    GetEmissionsListForEnt: before + '/EmissionsApi/GetEmissionsListForEnt',
    // 根据数据类型查询排放量--排口一级
    GetEmissionsListForPoint: before + '/EmissionsApi/GetEmissionsListForPoint',
    //  排放量变化趋势--查询企业、排口、因子
    GetEmissionsEntPointPollutant: before + '/EmissionsApi/GetEmissionsEntPointPollutant',
    // 排放量变化趋势
    GetEmissionsTrendList: before + '/EmissionsApi/GetEmissionsTrendList',
    // 废水、废气排放量时间段对比---师一级
    GetEmissionsListForRegionComparison:
      before + '/EmissionsApi/GetEmissionsListForRegionComparison',
    // 废水、废气排放量时间段对比---企业一级
    GetEmissionsListForEntComparison: before + '/EmissionsApi/GetEmissionsListForEntComparison',
    // 废水、废气排放量时间段对比---排口一级
    GetEmissionsListForPointComparison: before + '/EmissionsApi/GetEmissionsListForPointComparison',
    // 异常数据报警响应率--排口一级
    GetExceptionAlarmRateListForPoint:
      before + '/ExceptionResponseRateApi/GetExceptionAlarmRateListForPoint',
    // 异常数据报警响应率--师一级
    GetExceptionAlarmRateListForRegion:
      before + '/ExceptionResponseRateApi/GetExceptionAlarmRateListForRegion',
    // 异常记录详情
    GetExceptionReportedView: before + '/ExceptionResponseRateApi/GetExceptionReportedView',
    // 获取特征污染物排放量
    GetFeaturesPolEmissionsList: before + '/EmissionsApi/GetFeaturesPolEmissionsList',
    // 获取企业排放量数据
    GetEmissionsListForUnitTime: before + '/EmissionsApi/GetEmissionsListForUnitTime',
    // 企业日排放量分组统计
    GetEmissionsListForEntDay: before + '/EmissionsApi/GetEmissionsListForEntDay',
    // 废气、废水排放量环比---排口一级
    GetEmissionsListForPointChain: before + '/EmissionsApi/GetEmissionsListForPointChain',
    // 废气、废水排放量环比---企业一级
    GetEmissionsListForEntChain: before + '/EmissionsApi/GetEmissionsListForEntChain',
    // 废气、废水排放量环比---师一级
    GetEmissionsListForRegionChain: before + '/EmissionsApi/GetEmissionsListForRegionChain',
    // 废气、废水排放量同比---排口一级
    GetEmissionsListForPointYear: before + '/EmissionsApi/GetEmissionsListForPointYear',
    // 废气、废水排放量同比---企业一级
    GetEmissionsListForEntYear: before + '/EmissionsApi/GetEmissionsListForEntYear',
    // 废气、废水排放量同比---师一级
    GetEmissionsListForRegionYear: before + '/EmissionsApi/GetEmissionsListForRegionYear',

    //
    // GetTransmissionEfficiencyForRegion: before + '/TransmissionEfficiencyApi/GetTransmissionEfficiencyForRegion',
  },
  // 首页Api
  HomeApi: {
    //  运维 - 异常报警及响应情况
    GetAlarmAnalysisInfo: before + '/HomePage/GetAlarmAnalysisInfo',
    // 运维 - 智能预警
    GetIntelligentEarlyWarning: before + '/HomePage/GetIntelligentEarlyWarning',
    // 当月超标报警统计
    OverStandardAlarmStatistics: before + '/HomePage/OverStandardAlarmStatistics',
    // 获取排污许可情况数据 - 一年
    GetAllMonthPDPermitByPollutant: before + '/HomePage/GetAllMonthPDPermitByPollutant',
    // 报警信息
    GetOverAndWarningData: before + '/HomePage/GetOverAndWarningData',
    // 智能监控 -【工作台】获取排口状态【排口数量、正常运行个数、超标、异常、关停】
    GetStatisticsPointStatus: before + '/HomePage/GetStatisticsPointStatus',
    // 获取企业或排口的联网率和传输有效率
    GetRateStatisticsByEntOrPoint: before + '/HomePage/GetRateStatisticsByEntOrPoint',
    // 年度排放量对比
    GetGHGandEmissionContrast: before + '/HomePage/GetGHGandEmissionContrast',
    // 华能北京热电
    GetGHGandEmissionContrastOther: before + '/HomePage/GetGHGandEmissionContrastOther',
    // 运维 - 任务数量统计
    GetTaskStatistics: before + '/HomePageApi/GetTaskStatistics',
  },
  // 应急Api
  EmergencyApi: {
    // 获取值班人员和值班领导信息
    GetDutyPerson: before + '/Base/GetDutyPerson',
    // 获取接警任务列表
    GetDutyList: before + '/Base/GetDutyList',
    // 获取接警任务详细信息 - 一条
    GetDutyOne: before + '/Base/GetDutyOne',
    // 设置为当前处置中
    SetIsCurrent: before + '/Base/SetIsCurrent',
    // 保存甄别数据
    Screening: before + '/Base/Screening',
    // 获取码表信息
    GetInfoSources: before + '/Base/GetInfoSources',
    // 保存涉事企业
    SetSensitiveOrEnt: before + '/Base/SetSensitiveOrEnt',
    // 删除涉事企业及敏感点
    DelSensitiveOrEnt: before + '/Base/DelSensitiveOrEnt',
    // 获取保存的涉事企业
    GetRelationTable: before + '/Base/GetRelationTable',
    // 获取步骤条信息(1敏感目标，2涉事企业，3音视频材料，4应急预案，5救援队，6专家，7物资，8装备，9车辆，10现场调查，11处置，12快报)
    GetStepBar: before + '/Base/GetStepBar',
    // 获取列表数据(1敏感目标，2涉事企业，3音视频材料，4应急预案，5救援队，6专家，7物资，8装备，9车辆，10现场调查，11处置，12快报)
    GetListTable: before + '/Base/GetListTable',
    // 启动预案
    StartPlan: before + '/Base/StartPlan',
    // 添加或修改关联表的数据并且与主表关联(10现场调查，11处置，12快报,13采样因子,14监测点,15采样记录)
    AddOrUpdSampling: before + '/Base/AddOrUpdSampling',
    // 删除记录(13采样因子,14监测点,15采样记录)
    DelRecord: before + '/Base/DelRecord',
    // 结束任务
    EndRecord: before + '/Base/EndRecord',
    // 获取值班人员和值班领导的接口
    GetDutyUser: before + '/Base/GetDutyUser',
    // 换班接口
    ShiftChangeDuty: before + '/Base/ShiftChangeDuty',
  },
  // 报表Api
  ReportApi: {
    // 站点日报查询
    GetDayReport: before + '/MonBasicDataApi/GetDayReport',
    // 站点月报查询
    GetMonthReport: before + '/MonBasicDataApi/GetMonthReport',
    // 站点年报查询
    GetYearReport: before + '/MonBasicDataApi/GetYearReport',
    // 汇总日报表
    GetSummaryDayReport: before + '/MonBasicDataApi/GetSummaryDayReport',
    // 汇总周报
    GetSummaryWeekReport: before + '/MonBasicDataApi/GetSummaryWeekReport',
    // 汇总月报
    GetSummaryMonthReport: before + '/MonBasicDataApi/GetSummaryMonthReport',
    // 汇总年报
    GetSummaryYearReport: before + '/MonBasicDataApi/GetSummaryYearReport',
    // 汇总季报
    GetSummaryQuarterReport: before + '/MonBasicDataApi/GetSummaryQuarterReport',
    // 报表表头
    GetPointPollutantColumnByDGIMN: before + '/MonBasicDataApi/GetPointPollutantColumnByDGIMN',
    //
  },
  // 导出Api
  ExportApi: {
    // 行政区企业或监测点详情导出
    ExportEntOrPointDetail: before + '/EnterpriseApi/ExportEntOrPointDetail',
    // 导出年度考核企业列表
    ExportAnnualAssessmentEnt: before + '/EnterpriseApi/ExportAnnualAssessmentEnt',
    // 导出-各种类型数据列表(废水)
    ExportAllTypeDataListWater: before + '/MonBasicDataApi/ExportAllTypeDataListWater',
    // 导出-各种类型数据列表(废气)
    ExportAllTypeDataListGas: before + '/MonBasicDataApi/ExportAllTypeDataListGas',
    // 导出历史数据报表
    ExportAllTypeDataList: before + '/MonBasicDataApi/ExportAllTypeDataList',
    // 站点日报报表导出
    GetReportExcel: before + '/MonBasicDataApi/GetReportExcel',
    // 汇总报表导出
    GetSummaryReportExcel: before + '/MonBasicDataApi/GetSummaryReportExcel',
    // 异常数据查询导出-排口
    ExportExceptionPointList: before + '/ExceptionDataApi/ExportExceptionPointList',
    // 异常数据查询导出-师一级
    ExportExceptionList: before + '/ExceptionDataApi/ExportExceptionList',
    // 缺失数据导出
    ExportMissDataList: before + '/ExceptionDataApi/ExportMissDataList',
    // 导出超标数据
    ExportOverDataList: before + '/OverDataApi/ExportOverDataList',
    // 导出超标次数
    ExportOverStandardNum: before + '/OverDataApi/ExportOverStandardNum',

    // 缺失数据报警导出
    ExportDefectDataSummary: before + '/ExceptionAlarmApi/ExportDefectDataSummary',
    // 缺失数据报警详情导出
    ExportDefectPointDetail: before + '/ExceptionAlarmApi/ExportDefectPointDetail',
    // 导出-缺失数据报警详情
    ExportDefectPointDetailRate: before + '/ExceptionAlarmApi/ExportDefectPointDetailRate',
    // 超标报警审核率导出
    ExportAlarmVerifyRate: before + '/OverAlarmApi/ExportAlarmVerifyRate',
    // 超标报警审核率详细导出
    ExportAlarmVerifyRateDetail: before + '/OverAlarmApi/ExportAlarmVerifyRateDetail',
    // 导出超标报警核实率
    ExportAlarmManagementRate: before + '/OverAlarmApi/ExportAlarmManagementRate',
    // 超标报警核实率详细导出
    ExportAlarmManagementRateDetail: before + '/OverAlarmApi/ExportAlarmManagementRateDetail',
    // 超标报警处置详细导出
    ExportAlarmManagementDetail: before + '/OverAlarmApi/ExportAlarmManagementDetail',
    // 异常数据报警导出
    ExportExceptionAlarmListForRegion:
      before + '/ExceptionAlarmApi/ExportExceptionAlarmListForRegion',
    // 异常数据查询导出
    ExportExceptionList: before + '/ExceptionDataApi/ExportExceptionList',
    // 导出-行政区下传输有效率
    ExportTransmissionEfficiencyForRegion:
      before + '/TransmissionEfficiencyApi/ExportTransmissionEfficiencyForRegion',
    // 导出-企业下传输有效率
    ExportTransmissionEfficiencyForEnt:
      before + '/TransmissionEfficiencyApi/ExportTransmissionEfficiencyForEnt',
    // 导出-根据数据类型查询排放量--师一级
    ExportEmissionsListForRegion: before + '/EmissionsApi/ExportEmissionsListForRegion',
    // 导出-根据数据类型查询排放量--企业一级
    ExportEmissionsListForEnt: before + '/EmissionsApi/ExportEmissionsListForEnt',
    // 导出-根据数据类型查询排放量--排口一级
    ExportEmissionsListForPoint: before + '/EmissionsApi/ExportEmissionsListForPoint',
    // 导出-废水、废气排放量时间段对比---师一级
    ExportEmissionsListForRegionComparison:
      before + '/EmissionsApi/ExportEmissionsListForRegionComparison',
    // 导出-废水、废气排放量时间段对比---企业一级
    ExportEmissionsListForEntComparison:
      before + '/EmissionsApi/ExportEmissionsListForEntComparison',
    // 导出-废水、废气排放量时间段对比---排口一级
    ExportEmissionsListForPointComparison:
      before + '/EmissionsApi/ExportEmissionsListForPointComparison',
    // 导出-异常数据报警响应率--师一级
    ExportExceptionAlarmRateListForRegion:
      before + '/ExceptionResponseRateApi/ExportExceptionAlarmRateListForRegion',
    // 导出-异常数据报警响应率--排口一级
    ExportExceptionAlarmRateListForPoint:
      before + '/ExceptionResponseRateApi/ExportExceptionAlarmRateListForPoint',
    // 停运导出
    ExportStopList: before + '/OutputStopApi/ExportStopList',
    // 导出 - 异常数据报告
    ExportExceptionReported: before + '/ExceptionDataApi/ExportExceptionReported',
    // 超标报警核实率导出
    ExportAlarmVerifyRate: before + '/OverAlarmApi/ExportAlarmVerifyRate',
    // 缺失数据导出
    ExportMissDataList: before + '/ExceptionDataApi/ExportMissDataList',
    // 导出排放标准
    ExportDischargeStandValue: before + '/MonitorPointApi/ExportDischargeStandValue',
    // 超标分析报表导出
    ExportOverDataAnalysisList: before + '/OverDataApi/ExportOverDataAnalysisList',
    // 超标报警核实详细导出
    ExportAlarmVerifyDetail: before + '/AlarmVerifyManageApi/ExportAlarmVerifyDetail',
    // 异常数据报警导出 - 师下所有企业数据
    ExportExceptionAlarmListForEnt: before + '/ExceptionAlarmApi/ExportExceptionAlarmListForEnt',
    // 站点统计（企业或者空气站）导出
    ExportPointSummary: before + '/MonitorPointApi/ExportPointSummary',
    // 数据不可信导出
    ExportUnTrustedList: before + '/MonBasicDataApi/ExportUnTrustedList',
    // 导出历史工况参数
    ExportProcessFlowTableHistoryDataList:
      before + '/DymaicData/ExportProcessFlowTableHistoryDataList',

    //
  },
  // 新疆Api
  XJApi: {
    // 获取行政区与师的关系
    GetMonitorRegionDivision: before + '/RegionApi/GetMonitorRegionDivision',
  },
  // 视频Api
  VideoApi: {
    // 获取摄像头列表
    GetVideoList: before + '/VideoApi/GetVideoList',
    // 获取萤石云视频相关参数
    GetCameraMonitorUrl: before + '/VideoApi/GetCameraMonitorUrl',
    // 判断序列号是否正确
    IsTrueSerialNumber: before + '/VideoApi/IsTrueSerialNumber',
    // 删除摄像头和它与排口的关系表
    DeleteCamera: before + '/VideoApi/DeleteCamera',
    // 添加摄像头与排口关系表
    AddCameraMonitor: before + '/VideoApi/AddCameraMonitor',
    // 添加视频
    AddVideoDevice: before + '/VideoApi/AddVideoDevice',
    // 删除单个设备
    DeleteVideoDeviceOne: before + '/VideoApi/DeleteVideoDeviceOne',
    // 获取单个设备信息
    GetVideoDeviceOne: before + '/VideoApi/GetVideoDeviceOne',
    // 更新单个设备信息
    UpdateVideoDeviceOne: before + '/VideoApi/UpdateVideoDeviceOne',
    // 获取乐橙云KitToken
    GetLeChengKITToken: before + '/VideoApi/GetLeChengKITToken',
    // 获取首页视频列表
    GetHomePageVideo: before + '/VideoApi/GetHomePageVideo',
    // 获取视频接入方式
    GetVideoInputType: before + '/VideoApi/GetVideoInputType',
    // --------------------------------------------------------
    // 获取海康平台实时视频播放地址
    GetPreviewURL: before + '/VideoApi/PreviewURL',
    // 获取海康平台历史视频播放地址
    GetPlaybackURL: before + '/VideoApi/PlaybackURL',
    // 海康云台操作
    PTZControl: before + '/VideoApi/PTZControl',
  },
  // 异常数据识别模型Api
  AbnormalIdentifyModel: {
    // 获取模型列表
    GetMoldList: before + '/MoldV2/GetMoldList',
    // 模型开启、关闭
    SetMoldStatus: before + '/MoldV2/SetMoldStatus',
    // 获取模型配置
    GetModelInfoAndParams: before + '/WarningV2/GetModelInfoAndParams',
    // 获取模型配置关联排口
    GetModelRelationDGIMN: before + '/WarningV2/GetModelRelationDGIMN',
    // 保存模型基础配置
    SaveModelInfoAndParams: before + '/WarningV2/SaveModelInfoAndParams',
    // 根据MN获取模型选配数据
    GetDataAttributeAndPointList: before + '/MoldV2/GetDataAttributeAndPointList',
    // 添加关联模型选配
    AddDataAttributeAndPoint: before + '/MoldV2/AddDataAttributeAndPoint',
    // 获取辅助分析数据
    GetAllTypeDataListForModel: before + '/WarningV2/GetAllTypeDataListForModel',
    // 获取直方图
    StatisPolValueNumsByDGIMN: before + '/WarningV2/StatisPolValueNumsByDGIMN',
    // 获取波动范围及点位参数信息
    GetPointParamsRange: before + '/WarningV2/GetPointParamsRange',
    // 重新生成正常范围
    RegenerateNomalRangeTime: before + '/WarningV2/RegenerateNomalRangeTime',
    // 线性相关系数
    StatisLinearCoefficient: before + '/WarningV2/StatisLinearCoefficient',
    // 历史数据综合评价/统计分析
    GetHistoricalDataEvaluation: before + '/MoldV2/GetHistoricalDataEvaluation',
    // 获取数据现象
    GetHourDataForPhenomenon: before + '/WarningV2/GetHourDataForPhenomenon',


    /*实时数据异常识别及管理*/
    //异常线索清单
    //线索分析
    GetClueDatas: before + '/Clue/GetClueDatas', //工作台信息
    //生成核查任务
    GetWaitCheckDatas: before + '/Clue/GetWaitCheckDatas', //获取生产核查任务信息
    GetPreTakeFlagDatas: before + '/Clue/GetPreTakeFlagDatas', //获取庄家意见信息
    GetPlanDatas: before + '/Clue/GetPlanDatas', //获取已有方案信息
    GetCheckRoleDatas: before + '/Clue/GetCheckRoleDatas', //获取核查角色
    AddPlanTask: before + '/Clue/AddPlanTask', //生成核查任务
    //核查任务管理
    //待核查任务 已核查任务
    GetCheckedList: before + '/Clue/GetCheckedList', //获取待核查或已核查任务信息
    GetCheckedView: before + '/Clue/GetCheckedView', //核查详情

  },
  // 唐银钢铁Api
  TYGTApi: {
    // 获取排放源下设施列表(治理设施,生产,环保点位) InstallationType: 1=治理设施,2=生产,3=环保点位
    GetInstallationByEmission: before + '/EmissionDataApi/GetInstallationByEmission',
    // 关联排放源设施
    SetInstallation: before + '/EmissionDataApi/SetInstallation',
    // 添加排放源
    AddEmission: before + '/EmissionDataApi/AddEmission',
    // 排放源删除
    DeleteEmission: before + '/EmissionDataApi/DeleteEmission',
    // 删除治理设施和生产设施
    DeleteInstallation: before + '/EmissionDataApi/DeleteInstallation',
    // 根基点位查询治理设施和生产设施
    GetFacByPoint: before + '/EmissionsApi/GetFacByPoint',
    // 根据DGIMN，设施，参数查询数据
    GetDataByParams: before + '/EmissionsApi/GetDataByParams',
  },
  // console Api
  ConsoleApi: {
    // 获取采集服务配置及基本信息
    GetConsulConfig: '/DataCollect/api/DataCollectSet/GetConsulConfig',
    // 更新采集服务操作
    UpdateConsulConfig: '/DataCollect/api/DataCollectSet/UpdateConsulConfig',
    // 获取采集连接数详情
    GetRemotePoint: '/DataCollect/api/DataCollectSet/GetRemotePoint',
    // 重启联网scoket
    RestartCollect: '/DataCollect/api/DataCollectSet/RestartCollect',
    // 获取排口信息
    GetPoint: '/DataCollect/api/DataCollectSet/GetPoint',
    // 获取协议列表
    GetAnayticeList: '/DataCollect/api/DataCollectSet/GetAnayticeList',
    // 获取定时任务配置
    GetStatisSet: '/DataStatis/api/StatisSet/GetStatisSet',
    // 设置定时任务配置
    ModifyStatisTask: '/DataStatis/api/StatisSet/ModifyStatisTask',
    // 重启定时任务
    Restart: '/DataStatis/api/StatisSet/Restart',
    // 获取转发服务配置及基本信息
    GetTransmitSet: '/DataTransmit/api/DataTransmitSet/GetTransmitSet',
    // 修改转发配置
    ModifyTransmitSet: '/DataTransmit/api/DataTransmitSet/ModifyTransmitSet',
    // 重启转发服务
    RestartTransmit: '/DataTransmit/api/DataTransmitSet/RestartTransmit',
  },
};

export const UPLOAD = {};
