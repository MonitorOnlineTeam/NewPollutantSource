export const before = '/newApi/rest/PollutantSourceApi';
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
    // 删除文件
    DeleteAttach: before + '/UploadApi/DeleteAttach',
  },
  PollutantApi: {

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
    GetDataForSingleEnt: `${before}/EnterpriseApi/GetTyEntAndPoint`
  },

  // 首页Api
  HomeApi: {

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
  // ExportApi: {
  //   // 行政区企业或监测点详情导出
  //   ExportEntOrPointDetail: before + '/EnterpriseApi/ExportEntOrPointDetail',
  //   // 导出年度考核企业列表
  //   ExportAnnualAssessmentEnt: before + '/EnterpriseApi/ExportAnnualAssessmentEnt',
  //   // 导出-各种类型数据列表(废水)
  //   ExportAllTypeDataListWater: before + '/MonBasicDataApi/ExportAllTypeDataListWater',
  //   // 导出-各种类型数据列表(废气)
  //   ExportAllTypeDataListGas: before + '/MonBasicDataApi/ExportAllTypeDataListGas',
  //   // 导出历史数据报表
  //   ExportAllTypeDataList: before + '/MonBasicDataApi/ExportAllTypeDataList',
  //   // 站点日报报表导出
  //   GetReportExcel: before + '/MonBasicDataApi/GetReportExcel',
  //   // 汇总报表导出
  //   GetSummaryReportExcel: before + '/MonBasicDataApi/GetSummaryReportExcel',
  //   // 异常数据查询导出-排口
  //   ExportExceptionPointList: before + '/ExceptionDataApi/ExportExceptionPointList',
  //   // 异常数据查询导出-师一级
  //   ExportExceptionList: before + '/ExceptionDataApi/ExportExceptionList',
  //   // 缺失数据导出
  //   ExportMissDataList: before + '/ExceptionDataApi/ExportMissDataList',
  //   // 导出超标数据
  //   ExportOverDataList: before + '/OverDataApi/ExportOverDataList',
  //   // 导出超标次数
  //   ExportOverStandardNum: before + '/OverDataApi/ExportOverStandardNum',

  //   // 缺失数据报警导出
  //   ExportDefectDataSummary: before + '/ExceptionAlarmApi/ExportDefectDataSummary',
  //   // 缺失数据报警详情导出
  //   ExportDefectPointDetail: before + '/ExceptionAlarmApi/ExportDefectPointDetail',
  //   // 导出-缺失数据报警详情
  //   ExportDefectPointDetailRate: before + '/ExceptionAlarmApi/ExportDefectPointDetailRate',
  //   // 超标报警审核率导出
  //   ExportAlarmVerifyRate: before + '/OverAlarmApi/ExportAlarmVerifyRate',
  //   // 超标报警审核率详细导出
  //   ExportAlarmVerifyRateDetail: before + '/OverAlarmApi/ExportAlarmVerifyRateDetail',
  //   // 导出超标报警核实率
  //   ExportAlarmManagementRate: before + '/OverAlarmApi/ExportAlarmManagementRate',
  //   // 超标报警核实率详细导出
  //   ExportAlarmManagementRateDetail: before + '/OverAlarmApi/ExportAlarmManagementRateDetail',
  //   // 超标报警处置详细导出
  //   ExportAlarmManagementDetail: before + '/OverAlarmApi/ExportAlarmManagementDetail',
  //   // 异常数据报警导出
  //   ExportExceptionAlarmListForRegion:
  //     before + '/ExceptionAlarmApi/ExportExceptionAlarmListForRegion',
  //   // 异常数据查询导出
  //   ExportExceptionList: before + '/ExceptionDataApi/ExportExceptionList',
  //   // 导出-行政区下传输有效率
  //   ExportTransmissionEfficiencyForRegion:
  //     before + '/TransmissionEfficiencyApi/ExportTransmissionEfficiencyForRegion',
  //   // 导出-企业下传输有效率
  //   ExportTransmissionEfficiencyForEnt:
  //     before + '/TransmissionEfficiencyApi/ExportTransmissionEfficiencyForEnt',
  //   // 导出-根据数据类型查询排放量--师一级
  //   ExportEmissionsListForRegion: before + '/EmissionsApi/ExportEmissionsListForRegion',
  //   // 导出-根据数据类型查询排放量--企业一级
  //   ExportEmissionsListForEnt: before + '/EmissionsApi/ExportEmissionsListForEnt',
  //   // 导出-根据数据类型查询排放量--排口一级
  //   ExportEmissionsListForPoint: before + '/EmissionsApi/ExportEmissionsListForPoint',
  //   // 导出-废水、废气排放量时间段对比---师一级
  //   ExportEmissionsListForRegionComparison:
  //     before + '/EmissionsApi/ExportEmissionsListForRegionComparison',
  //   // 导出-废水、废气排放量时间段对比---企业一级
  //   ExportEmissionsListForEntComparison:
  //     before + '/EmissionsApi/ExportEmissionsListForEntComparison',
  //   // 导出-废水、废气排放量时间段对比---排口一级
  //   ExportEmissionsListForPointComparison:
  //     before + '/EmissionsApi/ExportEmissionsListForPointComparison',
  //   // 导出-异常数据报警响应率--师一级
  //   ExportExceptionAlarmRateListForRegion:
  //     before + '/ExceptionResponseRateApi/ExportExceptionAlarmRateListForRegion',
  //   // 导出-异常数据报警响应率--排口一级
  //   ExportExceptionAlarmRateListForPoint:
  //     before + '/ExceptionResponseRateApi/ExportExceptionAlarmRateListForPoint',
  //   // 停运导出
  //   ExportStopList: before + '/OutputStopApi/ExportStopList',
  //   // 导出 - 异常数据报告
  //   ExportExceptionReported: before + '/ExceptionDataApi/ExportExceptionReported',
  //   // 超标报警核实率导出
  //   ExportAlarmVerifyRate: before + '/OverAlarmApi/ExportAlarmVerifyRate',
  //   // 缺失数据导出
  //   ExportMissDataList: before + '/ExceptionDataApi/ExportMissDataList',
  //   // 导出排放标准
  //   ExportDischargeStandValue: before + '/MonitorPointApi/ExportDischargeStandValue',
  //   // 超标分析报表导出
  //   ExportOverDataAnalysisList: before + '/OverDataApi/ExportOverDataAnalysisList',
  //   // 超标报警核实详细导出
  //   ExportAlarmVerifyDetail: before + '/AlarmVerifyManageApi/ExportAlarmVerifyDetail',
  //   // 异常数据报警导出 - 师下所有企业数据
  //   ExportExceptionAlarmListForEnt: before + '/ExceptionAlarmApi/ExportExceptionAlarmListForEnt',
  //   // 站点统计（企业或者空气站）导出
  //   ExportPointSummary: before + '/MonitorPointApi/ExportPointSummary',
  //   // 数据不可信导出
  //   ExportUnTrustedList: before + '/MonBasicDataApi/ExportUnTrustedList',

  //   //
  // },

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
  /*资产管理 Api */
  AssetManagementApi: {
    //交接和报告
    //列表
    GetProjectReportList: before + '/CTBaseDataApi/GetProjectReportList',
    //编辑
    GetCTProjectList: before + '/CTBaseDataApi/AddOrUpdProjectReportInfo',
    //导出
    ExportProjectReportList: before + '/CTBaseDataApi/ExportProjectReportList'

  },
  /*********** 成套 ***********/


  //通用 Api
  CtCommonApi: {

    //站点信息
    GetEntAndPointList: before + '/CTBaseDataApi/GetEntAndPointList',
    //项目列表
    GetCTProjectList: before + '/CTBaseDataApi/GetCTProjectList',
  },
  //项目执行进度 Api
  ProjectExecuProgressApi: {
    //获取服务派单信息
    GetServiceDispatch: before + '/CTBaseDataApi/GetServiceDispatch',
    //服务填报内容 要加载的项
    GetServiceDispatchTypeAndRecord: before + '/CTBaseDataApi/GetServiceDispatchTypeAndRecord',
    //服务填报内容  服务报告
    GetAcceptanceServiceRecord: before + '/CTBaseDataApi/GetAcceptanceServiceRecord',
    //服务填报内容  工作记录
    GetWorkRecord: before + '/CTBaseDataApi/GetWorkRecord',
    //服务填报内容  勘查信息、 项目交接单、安装报告、72小时调试检测、比对监测报告、验收资料等
    GetPublicRecord: before + '/CTBaseDataApi/GetPublicRecord',
    //服务填报内容  安装照片
    GetInstallationPhotosRecord: before + '/CTBaseDataApi/GetInstallationPhotosRecord',
    //服务填报内容  参数设置照片
    GetParameterSettingsPhotoRecord: before + '/CTBaseDataApi/GetParameterSettingsPhotoRecord',
    //服务填报内容  配合检查
    GetCooperateRecord: before + '/CTBaseDataApi/GetCooperateRecord',
    //服务填报内容  维修记录
    GetRepairRecord: before + '/CTBaseDataApi/GetRepairRecord',
    //服务派单信息 导出
    ExportServiceDispatch: before + '/CTBaseDataApi/ExportServiceDispatch',
  },
  //资产管理 Api
  CtAssetManagementApi: {
    //添加或修改监测点
    AddOrEditCommonPointList: before + '/CTBaseDataApi/AddOrEditCommonPointList',
    //获取行业和监测点类型信息
    GetPointIndustryList: before + '/CTBaseDataApi/GetPointIndustryList',
    // 获取监测点，系统信息，系统变更信息仪表信息，仪表变更信息
    GetCEMSSystemList: before + '/CTBaseDataApi/GetCEMSSystemList',
    // 添加或修改系统型号
    AddOrEditCEMSSystem: before + '/CTBaseDataApi/AddOrEditCEMSSystem',
    //添加或修改系统更换记录
    AddOrEditCEMSSystemChange: before + '/CTBaseDataApi/AddOrEditCEMSSystemChange',
    // 添加或修仪表信息
    AddOrEditEquipment: before + '/CTBaseDataApi/AddOrEditEquipment',
    // 添加或修仪仪表更换记录
    AddOrEditEquipmentChange: before + '/CTBaseDataApi/AddOrEditEquipmentChange',
    // 监测点排序
    PointSort: before + '/CTBaseDataApi/PointSort',
    //修改成套项目信息
    UpdateCTProject: before + '/CTBaseDataApi/UpdateCTProject',
    //获取成套项目与站点管理关系
    GetrojectPointRelationList: before + '/CTBaseDataApi/GetrojectPointRelationList',
    //添加成套项目与站点关联关系
    AddProjectPointRelation: before + '/CTBaseDataApi/AddProjectPointRelation',
    //项目列表 导出
    ExportCTProjectList: before + '/CTBaseDataApi/ExportCTProjectList',
  },
};

export const UPLOAD = {};
