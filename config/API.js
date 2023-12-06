import config from '@/config';
export const before = '/newApi/rest/PollutantSourceApi';
export const API = {
  //登录相关Api
  LoginApi: {
    Login: before + '/LoginApi/Login',//登录
    Token: '/newApi/rest/PollutantSourceOAuth/connect/token',//获取token
    VertifyOldPwd: before + '/LoginApi/VertifyOldPwd', //验证密码是否一致
    ChangePwd: before + '/LoginApi/ChangePwd', //修改密码
  },
  //系统配置相关Api
  SystemApi: {
    GetSystemConfigInfo: before + '/ConfigureApi/GetSystemConfigInfo',//系统相关配置
    IfSpecial: before + '/ConfigureApi/IfSpecial',//手机下载特殊情况(如果配置文件中IfSpecial字段有值直接用该字段地址，不用从上面接中取数据)
  },
  //菜单相关Api
  MenuApi: {
    GetSysMenuByUserId: before + '/MenuApi/GetSysMenuByUserId',//获取权限菜单
  },
  //autoform相关Api
  AutoFormApi: {
    GetListPager: before + '/AutoFormDataApi/GetListPager',//获取列表数据
    GetPageConfigInfo: before + '/AutoFormDataApi/GetPageConfigInfo', //获取autoform页面配置信息
    PostAutoFromDataAdd: before + '/AutoFormDataApi/PostAutoFromDataAdd',//添加数据
    PostAutoFromDataUpdate: before + '/AutoFormDataApi/PostAutoFromDataUpdate',//编辑数据
    PostAutoFromDataDelete: before + '/AutoFormDataApi/PostAutoFromDataDelete',//删除数据
    GetAutoFromAddView: before + '/AutoFormDataApi/GetAutoFromAddView',//获取添加页面表单元素
    GetAutoFromUpdateView: before + '/AutoFormDataApi/GetAutoFromUpdateView',//获取编辑页面表单元素
    GetFormData: before + '/AutoFormDataApi/GetFormData',//获取编辑或添加页面表单元素的值
    VerificationData: before + '/AutoFormDataApi/VerificationData',//校验重复数据
    ExportTemplet: before + '/AutoFormDataApi/ExportTemplet',//生成导出模板
    ExportDataExcel: before + '/AutoFormDataApi/ExportDataExcel',//导出数据
  },
  //附件相关Api
  UploadApi: {
    GetAttachmentList: before + '/UploadApi/GetAttachmentList',//获取附件ID获取所有附件
    DeleteAttach: before + '/UploadApi/DeleteAttach',//删除文件
    UploadFiles: before + '/UploadApi/UploadFiles',//上传文件
    UploadPicture: before + '/UploadApi/UploadPicture',//上传图片
  },
  //通用Api
  CommonApi: {
    GetNoFilterRegionList: before + '/RegionApi/GetNoFilterRegionList',//获取无权限过滤的行政区信息
    GetXuRegions: before + '/RegionApi/GetXuRegions',//获取所有省份及省份下的市县
    GetRegions: before + '/RegionApi/GetRegions', //获取行政区
    GetAttentionDegreeList: before + '/RegionApi/GetAttentionDegreeList',//获取关注程度
    GetNoFilterEntList: before + '/EnterpriseApi/GetNoFilterEntList',//获取无权限过滤的企业信息
    GetNoFilterPointByEntCode: before + '/EnterpriseApi/GetNoFilterPointByEntCode',//通过企业获取无权限过滤的监测点信息
    GetEntByRegion: before + '/EnterpriseApi/GetEntByRegion',//根据行政区查询企业
    GetEntByRegionAndAtt: before + '/EnterpriseApi/GetEntByRegionAndAtt', //获取行政区和关注程度查询企业
    GetEntAndPoint: before + '/EnterpriseApi/GetEntAndPoint',//获取企业和企业对应的排口信息
    GetPointByEntCode: before + '/MonitorPointApi/GetPointByEntCode',//根据企业编号与污染物编号查询排口
    GetPollutantCodeList: before + '/MonitorPollutantApi/GetPollutantCodeList',//根据污染物类型获取污染物
    GetPollutantTypeCode: before + '/MonitorPollutantApi/GetPollutantTypeCode',//获取数据一览表头，包括因子编码、因子名称、因子单位
    GetPollutantListByDgimn: before + '/MonitorPollutantApi/GetPollutantListByDgimn',//根据MN号获取污染物
    GetPollutantTypeList: before + '/MonitorPollutantApi/GetPollutantTypeList',//获取系统污染物类型信息
    GetPollutantByType: before + '/MonitorPollutantApi/GetPollutantByType', //根据企业类型查询监测因子
    GetStandardPollutantsByDgimn: before + '/StandardLibraryApi/GetStandardPollutantsByDgimn', //根据排口获取标准污染物列表
    GetPollutantTypeMonitoringCategoryInfo: before + '/BaseDataApi/GetPollutantTypeMonitoringCategoryInfo',//获取设备信息监测参数类型
    GeteTaskOrderTypeByPollutantType: before + '/OperationWorkbenchApi/GeteTaskOrderTypeByPollutantType', // 根据污染物类型获取表单类型
  },
  // 可视化看板Api 首页
  VisualKanbanApi: {
    GetVisualDashBoardOperatePointInfo: before + '/VisualDashBoardApi/GetVisualDashBoardOperatePointInfo',//获取运维信息总览信息
    GetOperationTaskStatisticsInfo: before + '/VisualDashBoardApi/GetOperationTaskStatisticsInfo',//获取近30日运维工单统计
    GetPlanOperationTaskCompleteRate: before + '/VisualDashBoardApi/GetPlanOperationTaskCompleteRate',//获取计划巡检完成率、校准完成率
    GetOperationCompleteRateRank: before + '/VisualDashBoardApi/GetOperationCompleteRateRank',//获取近30日运维排名信息
    GetSceneSignExceptionRate: before + '/VisualDashBoardApi/GetSceneSignExceptionRate',//获取现场打卡异常率
    GetVisualDashBoardEffectiveTransmissionRate: before + '/VisualDashBoardApi/GetVisualDashBoardEffectiveTransmissionRate',//有效传输率
    GetExceptionDataOverview: before + '/VisualDashBoardApi/GetExceptionDataOverview',//获取异常数据总览  获取超标报警核实率、异常报警响应率、缺失报警响应率、报警响应超时率.
    GetVisualDashBoardConsumablesStatisticsInfo: before + '/VisualDashBoardApi/GetVisualDashBoardConsumablesStatisticsInfo',//获取耗材统计信息
    GetConsumablesStatisticsInfo: before + '/VisualDashBoardApi/GetConsumablesStatisticsInfo',//获取耗材统计信息 详情
    ExportConsumablesStatisticsInfo: before + '/VisualDashBoardApi/ExportConsumablesStatisticsInfo',//导出耗材统计信息 详情
    GetEquipmentExceptionsOverview: before + '/VisualDashBoardApi/GetEquipmentExceptionsOverview',//获取设备异常总览 设备异常率、设备故障率、设备故障修复率
    GetMapPointList: before + '/VisualDashBoardApi/GetMapPointList',//获取地图数据
    GetOperatePointList: before + '/VisualDashBoardApi/GetOperatePointList',//获取运维信息总览 详情运维企业、监测点信息
    ExportOperatePointList: before + '/VisualDashBoardApi/ExportOperatePointList',//导出运维信息总览 详情运维企业、监测点信息
    GetOperationPlanTaskList: before + '/VisualDashBoardApi/GetOperationPlanTaskList',// 获取近30日运维工单统计 详情
    ExportOperationPlanTaskList: before + '/VisualDashBoardApi/ExportOperationPlanTaskList',// 导出近30日运维工单统计 详情
    GetVisualDashBoardNetworkingRate: before + '/VisualDashBoardApi/GetVisualDashBoardNetworkingRate',//获取实时联网率统计
    GetProviceNetworkingRate: before + '/VisualDashBoardApi/GetProviceNetworkingRate',// 获取省实时联网率
    GetCityNetworkingRate: before + '/VisualDashBoardApi/GetProviceNetworkingRate',// 获取市实时联网率
    GetPointNetworkingRate: before + '/VisualDashBoardApi/GetPointNetworkingRate',// 获取点位实时联网率
    ExportProviceNetworkingRate: before + '/VisualDashBoardApi/ExportProviceNetworkingRate',// 导出省实时联网率
    ExportCityNetworkingRate: before + '/VisualDashBoardApi/ExportCityNetworkingRate',// 导出市实时联网率
    ExportPointNetworkingRate: before + '/VisualDashBoardApi/ExportPointNetworkingRate',// 导出点位实时联网率
    GetEquipmentExecptionRateList: before + '/VisualDashBoardApi/GetEquipmentExecptionRateList',//获取省、市、企业监测点设备完好率
    ExportEquipmentExecptionRateList: before + '/VisualDashBoardApi/ExportEquipmentExecptionRateList',//导出省、市、企业监测点设备完好率
    GetEquipmentFailureRateList: before + '/VisualDashBoardApi/GetEquipmentFailureRateList',//获取省、市、企业监测点设备故障率
    ExportEquipmentFailureRateList: before + '/VisualDashBoardApi/ExportEquipmentFailureRateList',//导出省、市、企业监测点设备故障率
    GetEquipmentRepairRateList: before + '/VisualDashBoardApi/GetEquipmentRepairRateList',//获取省、市、企业监测点设备故障修复率
    ExportEquipmentRepairRateList: before + '/VisualDashBoardApi/ExportEquipmentRepairRateList',//获取省、市、企业监测点设备故障修复率

  },

  // 全过程监控Api
  WholeProcessMonitorApi: {
    /**监测数据总览**/
    /*数据总览*/
    AllTypeSummaryList: before + '/MonBasicDataApi/AllTypeSummaryList', //获取获取站点基本信息、在线状态、报警状态、最新一条小时监测数据，包括污染源、空气质量
    /*在线监测数据*/
    GetAllTypeDataList: before + '/MonitorPointApi/GetAllTypeDataList',//获取各种类型的数据列表（实时、分钟、小时、日均）

    /**质控数据总览**/
    /*有效传输率排名*/
    GetTransmissionEfficiencyRateList: before + '/StatisticAnalysisApi/GetTransmissionEfficiencyRateList',//获取省、市、监测点有效传输率统计信息
    ExportTransmissionEfficiencyRateList: before + '/StatisticAnalysisApi/ExportTransmissionEfficiencyRateList',//导出省、市级别有效传输率统计信息
    /*系统访问率*/
    GetSystemAccessRateList: before + '/StatisticAnalysisApi/GetSystemAccessRateList',//获取大区、服务区的系统访问率
    ExportSystemAccessRateList: before + '/StatisticAnalysisApi/ExportSystemAccessRateList',//导出大区、服务区的系统访问率
    GetUserAccessInfo: before + '/StatisticAnalysisApi/GetUserAccessInfo',//获取用户访问率
    ExportUserAccessInfo: before + '/StatisticAnalysisApi/ExportUserAccessInfo',//导出用户访问率
    GetIndustryAttributeInfo: before + '/StatisticAnalysisApi/GetIndustryAttributeInfo',//获取业务属性和行业属性
    ExportPlatformAnalysisReport: before + '/StatisticAnalysisApi/ExportPlatformAnalysisReport',//导出平台分析报告
    /*站点数据总览*/
    GetDayReport: before + '/StatisticAnalysisApi/GetDayReport',//获取站点日报报表
    GetMonthReport: before + '/StatisticAnalysisApi/GetMonthReport',//获取站点月报报表
    GetYearReport: before + '/StatisticAnalysisApi/GetYearReport',//获取站点年报报表
    GetReportExcel: before + '/StatisticAnalysisApi/GetReportExcel',//导出站点日报、月报、年报报表
    GetSummaryDayReport: before + '/StatisticAnalysisApi/GetSummaryDayReport',//获取站点汇总日报报表
    GetSummaryMonthReport: before + '/StatisticAnalysisApi/GetSummaryMonthReport',//获取站点汇总月报报表
    GetSummaryYearReport: before + '/StatisticAnalysisApi/GetSummaryYearReport',//获取站点汇总年报报表
    GetSummaryReportExcel: before + '/StatisticAnalysisApi/GetSummaryReportExcel',//导出站点汇总站点日报、月报、年报报表
  },

  //预测性维护Api
  PredictiveMaintenanceApi: {
    /**智慧运维**/
    /*运维日历*/
    GetCalendarInfo: before + '/WorkOrderApi/GetCalendarInfo', //获取日历上工单统计信息
    /*运维日志*/
    GetOperationLogsList: before + '/OperationLogsApi/GetOperationLogsList', //获取运维日志记录
    /*运维工单*/
    GetOperationTaskList: before + '/WorkOrderApi/GetOperationTaskList', //获取运维工单记录
    ExportOperationTaskList: before + '/WorkOrderApi/ExportOperationTaskList', //导出运维工单记录
    GetTaskDetails: before + '/WorkOrderApi/GetTaskDetails', //获取运维工单详情
    RejectTask: before + '/WorkOrderApi/RejectTask', //驳回任务
    GetOperationLogList: before + '/WorkOrderApi/GetOperationLogList', //获取运维记录
    PostRetransmission : before + '/WorkOrderApi/PostRetransmission', //任务转发
    //电子表单
    GetCemsCalibrationRecord: before + '/GasOperationFormApi/GetCemsCalibrationRecord', //获取单个任务的校准记录
    GetConsumablesReplaceRecordList: before + '/ConsumableMaterialApi/GetConsumablesReplaceRecordList', //获取易耗品更换记录
    GetFaultRecordForPCList: before + '/ConsumableMaterialApi/GetFaultRecordForPCList', //获取故障小时记录
    GetSparePartReplaceRecordList: before + '/ConsumableMaterialApi/GetSparePartReplaceRecordList', //获取备品备件更换记录
    GetStandardGasRepalceRecordList: before + '/ConsumableMaterialApi/GetStandardGasRepalceRecordList', //获取标气更换记录
    GetMaintainRecordList: before + '/GasOperationFormApi/GetMaintainRecordList', //获取保养记录
    GetShutdownRecordList: before + '/GasOperationFormApi/GetShutdownRecordList', //获取停机记录
    GetRepairRecordForPCList: before + '/GasOperationFormApi/GetRepairRecordForPCList', //获取维修记录
    GetDeviceExceptionRecordForPCList: before + '/GasOperationFormApi/GetDeviceExceptionRecordForPCList', //获取异常记录
    GetVerificationTestRecordList: before + '/GasOperationFormApi/GetVerificationTestRecordList', //获取单个CEMS校验测试记录
    GetReagentRepalceRecordList: before + '/ConsumableMaterialApi/GetReagentRepalceRecordList', //获取标液更换记录
    GetCooperationInspectionRecordForPCList: before + '/GasOperationFormApi/GetCooperationInspectionRecordForPCList', //获取配合检查记录
    GetRealtimeConsistencyRecordForPCList: before + '/GasOperationFormApi/GetRealtimeConsistencyRecordForPCList',//获取数据一致性记录(实时)
    GetHourDayConsistencyRecordForPCList: before + '/GasOperationFormApi/GetHourDayConsistencyRecordForPCList', //获取数据一致性记录(小时日)
    GetDetectionTimesRecordForPCList: before + '/GasOperationFormApi/GetDetectionTimesRecordForPCList', //获取上月委托第三方检测次数
    GetWaterCalibrationRecordForPCList: before + '/GasOperationFormApi/GetWaterCalibrationRecordForPCList', //获取废水校准记录
    GetStandardSolutionRecordForPCList: before + '/GasOperationFormApi/GetStandardSolutionRecordForPCList', //获取标准溶液核查记录
    GetWaterParametersChangeRecordForPCList: before + '/GasOperationFormApi/GetWaterParametersChangeRecordForPCList', //获取废水参数变动记录
    GetGasParametersChangeRecordForPCList: before + '/GasOperationFormApi/GetGasParametersChangeRecordForPCList', //获取废气参数变动记录
    GetWaterComparisonTestRecordForPCList: before + '/GasOperationFormApi/GetWaterComparisonTestRecordForPCList', //获取实际水样比对试验结果记录
    GetRecordAttachmentList: before + '/GasOperationFormApi/GetRecordAttachmentList', //获取运维表单图片信息
    /*运维记录*/
    GetOperationRecordListByDGIMN: before + '/WorkOrderApi/GetOperationRecordListByDGIMN', //获取运维记录
    ExportOperationRecordListByDGIMN: before + '/WorkOrderApi/ExportOperationRecordListByDGIMN', //导出运维记录
    GetTaskTypeList: before + '/WorkOrderApi/GetTaskTypeList', //获取运维工单类型
    /*工单进度*/
    GetWorkProgressList: before + '/WorkOrderApi/GetWorkProgressList', //获取指挥调度
    /*运维记录分析*/
    GetOperationRecordAnalyList: before + '/WorkOrderStatistics/GetOperationRecordAnalyList', //获取运维记录分析
    ExportOperationRecordAnalyInfo: before + '/WorkOrderStatistics/ExportOperationRecordAnalyInfo', //导出运维记录分析明细
    GetOperationRecordAnalyInfoList: before + '/WorkOrderStatistics/GetOperationRecordAnalyInfoList', //获取运维记录分析明细
    ExportOperationRecordAnaly: before + '/WorkOrderStatistics/ExportOperationRecordAnaly', //导出运维记录分析
    /*运维工单分析*/
    GetWorkOrderAnalysisList: before + '/WorkOrderStatistics/GetWorkOrderAnalysisList',//获取运维工单统计信息
    ExportWorkOrderAnalysisList: before + '/WorkOrderStatistics/ExportWorkOrderAnalysisList',//导出运维工单统计信息
    /*异常工单分析*/
    GetExceptionTaskOrderList: before + '/WorkOrderStatistics/GetExceptionTaskOrderList', //获取异常工单信息
    ExportExceptionTaskOrderList: before + '/WorkOrderStatistics/ExportExceptionTaskOrderList', //导出异常工单信息
    GetExceptionTaskOrderSignList: before + '/WorkOrderStatistics/GetExceptionTaskOrderSignList', //获取企业异常打卡信息（地图）
    /*运维到期提醒*/
    GetOperationExpireAnalysis: before + '/OperationExpireAnalysis/GetOperationExpireAnalysis',//运维到期点位统计
    ExportOperationExpireAnalysis: before + '/OperationExpireAnalysis/ExportOperationExpireAnalysis',//导出运维到期点位统计

    /**运维报告**/
    /*运维报告（word）*/
    GetOperationReportList: before + '/OperationExpireAnalysis/ExportOperationExpireAnalysis',//获取运维月度报告信息
    ExportOperationRepor: before + '/OperationExpireAnalysis/ExportOperationExpireAnalysis',//导出运维月度报告
  },
  //智能诊断Api
  IntelligentDiagnosis: {
    /**异常数据处置**/
    /*异常数据上报*/
    GetExceptionReportList: before + '/ExceptionResponseRateApi/GetExceptionReportList',//获取异常数据上报信息、企业异常记录
    AddOrUpdateExceptionReportInfo: before + '/ExceptionResponseRateApi/AddOrUpdateExceptionReportInfo',//添加更新异常数据上报信息
    DeleteExceptionReportInfo: before + '/ExceptionResponseRateApi/DeleteExceptionReportInfo',//删除异常数据上报信息
    /*设备故障反馈*/
    GetEquipmentFaultFeedbackList: before + '/ExceptionResponseRateApi/GetEquipmentFaultFeedbackList',//获取设备故障反馈信息
    ExportEquipmentFaultFeedbackList: before + '/ExceptionResponseRateApi/ExportEquipmentFaultFeedbackList',//导出设备故障反馈信息
    UpdateEquipmentFaultFeedbackStatus: before + '/ExceptionResponseRateApi/UpdateEquipmentFaultFeedbackStatus',//更新设备故障反馈信息
    /**异常数据分析**/
    /*超标数据分析*/
    GetOverDataList: before + '/WorkOrderStatistics/GetOverDataList', //获取超标数据信息
    ExportOverDataList: before + '/WorkOrderStatistics/ExportOverDataList', //导出超标数据信息
    GetOverStandardNum: before + '/WorkOrderStatistics/GetOverStandardNum', //获取超标次数
    ExportOverStandardNum: before + '/WorkOrderStatistics/ExportOverStandardNum', //导出超标次数
    /*超标数据报警*/
    GetOverToExamineOperation: before + '/ExceptionResponseRateApi/GetOverToExamineOperation',//获取超标核实类型
    GetAlarmVerifyRate: before + '/ExceptionResponseRateApi/GetAlarmVerifyRate',//获取超标数据信息
    ExportAlarmVerifyRate: before + '/ExceptionResponseRateApi/ExportAlarmVerifyRate',//导出超标数据信息
    GetAlarmVerifyRateDetail: before + '/ExceptionResponseRateApi/GetAlarmVerifyRateDetail',//获取超标数据信息详情
    ExportAlarmVerifyRateDetail: before + '/ExceptionResponseRateApi/ExportAlarmVerifyRate',//导出超标数据信息
    GetAlarmVerifyDetail: before + '/ExceptionResponseRateApi/GetAlarmVerifyDetail',//获取超标数据报警次数详情
    ExportAlarmVerifyDetail: before + '/ExceptionResponseRateApi/ExportAlarmVerifyDetail',//导出超标数据报警次数详情
    /*缺失数据分析*/
    GetMissDataList: before + '/ExceptionDataApi/GetMissDataList',//获取缺失数据信息
    ExportMissDataList: before + '/ExceptionDataApi/ExportMissDataList',//导出缺失数据信息
    GetMissDataResponseRateList: before + '/ExceptionDataApi/GetMissDataResponseRateList',//获取缺失数据响应和响应率信息
    ExportExceptionReportedList: before + '/ExceptionDataApi/ExportExceptionReportedList',//导出缺失数据响应和响应率信息
    /*异常数据分析*/

    /*异常数据报警*/
    GetProvinceExceptionDataAlaramList: before + '/ExceptionDataApi/GetProvinceExceptionDataAlaramList',//获取省级异常数据报警信息
    ExportProvinceExceptionDataAlaramList: before + '/ExceptionDataApi/ExportProvinceExceptionDataAlaramList',//导出异常数据报警信息
    GetCityExceptionDataAlaramList: before + '/ExceptionDataApi/GetCityExceptionDataAlaramList',//获取市级异常数据报警信息
    ExportCityExceptionDataAlaramList: before + '/ExceptionDataApi/ExportProvinceExceptionDataAlaramList',//导出市级异常数据报警信息
    GetEntExceptionDataAlaramList: before + '/ExceptionDataApi/GetEntExceptionDataAlaramList',//获取企业异常数据报警信息
    ExportEntExceptionDataAlaramList: before + '/ExceptionDataApi/ExportEntExceptionDataAlaramList',//导出企业异常数据报警信息
    /*停运记录分析*/
    GetStopList: before + '/OutputStopApi/GetStopList',//获取停运记录
    ExportStopList: before + '/OutputStopApi/GetStopList',//导出停运记录
    /*企业异常记录*/
    ExportExceptionReportList: before + '/OutputStopApi/ExportExceptionReportList',//获取企业异常记录
    /**异常规则信息**/
    /*监测标准设置*/
    GetMonitorPointPollutantDetails: before + '/StandardLibraryApi/GetMonitorPointPollutantDetails',//获取监测污染物详情
    UsePollutant: before + '/StandardLibraryApi/UsePollutant',//修改污染物监测状态
    UseStatisti: before + '/StandardLibraryApi/UseStatisti',//修改污染物是否考核
    EditMonitorPointPollutant: before + '/StandardLibraryApi/EditMonitorPointPollutant',//更新污染物设置标准
    /*排放标准记录*/
    GetDischargeStandValue: before + '/MonitorPointApi/GetDischargeStandValue',//获取排放标准记录
    ExportDischargeStandValue: before + '/MonitorPointApi/ExportDischargeStandValue',//导出排放标准记录
    /*排放标准记录*/
    GetExceptionStandValue: before + '/MonitorPointApi/GetExceptionStandValue',//获取异常标准记录
    ExportExceptionStandValue: before + '/MonitorPointApi/ExportExceptionStandValue',//导出异常标准记录

  },
  //异常数据模型分析 Api
  AbnormalModelAnalysisApi: {
    /*异常精准识别核实率*/
    GetModelWarningCheckedForRegion: before + '/Warning/GetModelWarningCheckedForRegion', //行政区 列表
    GetModelWarningCheckedForCity: before + '/Warning/GetModelWarningCheckedForCity',   //市 列表
    GetModelWarningCheckedForEnt: before + '/Warning/GetModelWarningCheckedForEnt',   //企业 列表
    GetModelWarningCheckedForPoint: before + '/Warning/GetModelWarningCheckedForPoint', //监测点 列表
    ExportModelWarningCheckedForRegion: before + '/Warning/ExportModelWarningCheckedForRegion', //行政区 导出
    ExportModelWarningCheckedForCity: before + '/Warning/ExportModelWarningCheckedForCity',  //市 导出
    ExportModelWarningCheckedForEnt: before + '/Warning/ExportModelWarningCheckedForEnt', //企业 导出
    /*异常精准识别整改率*/
    GetModelWarningCheckedRectificationForRegion: before + '/Warning/GetModelWarningCheckedRectificationForRegion',  //行政区 列表
    GetModelWarningCheckedRectificationForCity: before + '/Warning/GetModelWarningCheckedRectificationForCity', //市 列表
    GetModelWarningCheckedRectificationForEnt: before + '/Warning/GetModelWarningCheckedRectificationForEnt',//企业 列表
    GetModelWarningCheckedRectificationForPoint: before + '/Warning/GetModelWarningCheckedRectificationForPoint',  //监测点 列表
    GetCheckedRectificationApprovals: before + '/Warning/GetCheckedRectificationApprovals', //整改详情
    ExportModelWarningCheckedRectificationForRegion: before + '/Warning/ExportModelWarningCheckedRectificationForRegion',//行政区 导出
    ExportModelWarningCheckedRectificationForCity: before + '/Warning/ExportModelWarningCheckedRectificationForCity',  //市 导出
    ExportModelWarningCheckedRectificationForEnt: before + '/Warning/ExportModelWarningCheckedRectificationForEnt', //企业 导出

  },

  /*监督核查 Api */
  SupervisionVerificaApi: {
    /*** 远程监督核查 ***/
    /*关键参数核查*/
    GetKeyParameterCheckList: before + '/SupervisionApi/GetKeyParameterCheckList', //获取关键参数核查信息
    ExportKeyParameterCheckList: before + '/SupervisionApi/ExportKeyParameterCheckList', //导出关键参数核查信息
    GetRangeConsistencyDetail: before + '/SupervisionApi/GetRangeConsistencyDetail', //获取关键参数核查信息明细
    AddRemoteInspector: before + '/SupervisionApi/AddRemoteInspector', //更新关键参数核查信息
    DeleteKeyParameterCheckInfo: before + '/SupervisionApi/DeleteKeyParameterCheckInfo', //删除关键参数核查信息
    GetParameterConsistencyCodeInfo: before + '/SupervisionApi/GetParameterConsistencyCodeInfo',//获取量程和实时数据一致性核查监测参数信息
    JudgeRangeConsistencyCheck: before + '/SupervisionApi/JudgeRangeConsistencyCheck',//获取量程一致性(自动判断)
    JudgeDataConsistencyCheck: before + '/SupervisionApi/JudgeDataConsistencyCheck',//获取数据一致性(自动判断)	
    GetNOxValue: before + '/SupervisionApi/GetNOxValue',//获取NOx数采仪实时数据
    JudgeParameterConsistencyInfo: before + '/SupervisionApi/JudgeParameterConsistencyInfo',//获取参数一致性核查检查项目信息
    IssueKeyParameterCheckInfo: before + '/SupervisionApi/IssueKeyParameterCheckInfo',//关键参数核查下发
    /*关键参数核查（新）*/

    /*** 现场监督核查 ***/
    /*系统设施核查*/
    GetSystemFacilityVerificationList: before + '/SupervisionApi/GetSystemFacilityVerificationList',//获取系统设施核查
    ExportSystemFacilityVerificationList: before + '/SupervisionApi/ExportSystemFacilityVerificationList',//导出系统设施核查
    GetSystemFacilityVerificationInfo: before + '/SupervisionApi/GetSystemFacilityVerificationInfo',//获取单条督查信息
    GetPointSystemInfo: before + '/SupervisionApi/GetPointSystemInfo',//获取运维督查信息单个排口的默认信息
    AddOrUpdateSystemFacilityVerificationInfo: before + '/SupervisionApi/AddOrUpdateSystemFacilityVerificationInfo',//添加修改督查模板
    GetSystemFacilityVerificationDetail: before + '/SupervisionApi/GetPointSystemInfo',//获取运维督查详情
    DeleteInspectorOperation: before + '/SupervisionApi/DeleteInspectorOperation',//删除运维督查信息
    /*核查模板设置*/
    GetSupervisionQuestionTypeList: before + '/SupervisionApi/DeleteInspectorOperation',//获取督查类别清单
    GetSupervisionQuestionTypeCodeList: before + '/SupervisionApi/GetSupervisionQuestionTypeCodeList',//获取督查类别
    AddOrUpdateSupervisionQuestionTypeInfo: before + '/SupervisionApi/DeleteInspectorOperation',//添加更新督查类别清单
    DeleteSupervisionQuestionTypeInfo: before + '/SupervisionApi/DeleteInspectorOperation',//删除更新督查类别清单
    ChangeSupervisionQuestionTypeStatus: before + '/SupervisionApi/ChangeSupervisionQuestionTypeStatus',//更改更新督查类别清单状态
    GetSupervisionTemplateList: before + '/SupervisionApi/ChangeSupervisionQuestionTypeStatus',//获取督查模板信息
    AddOrUpdateSupervisionTemplateInfo: before + '/SupervisionApi/AddOrUpdateSupervisionTemplateInfo',//添加更新督查模板信息
    DeleteSupervisionTemplateInfo: before + '/SupervisionApi/DeleteSupervisionTemplateInfo',//删除更新督查模板信息
    GetSupervisionQuestionTypeDescribeList: before + '/SupervisionApi/GetSupervisionQuestionTypeDescribeList',//获取督查模板类别信息
    ChangeSupervisionTemplateStatus: before + '/SupervisionApi/ChangeSupervisionTemplateStatus',//更改督查模板状态
    GetSupervisionTemplateDetail: before + '/SupervisionApi/GetSupervisionTemplateDetail',//获取督查模板详情
    /*系统设施核查整改*/

    /*** 监督核查分析 ***/
    /*督查分析总结*/

    /*关键参数核查统计*/
    GetKeyParameterAnalyseList: before + '/CTBaseDataApi/GetKeyParameterAnalyseList', //列表
    ExportKeyParameterAnalyseList: before + '/CTBaseDataApi/ExportKeyParameterAnalyseList' //导出
  },
  /*资产管理 Api */
  AssetManagementApi: {
    /*** 设备台账 ***/
    /*污染源管理*/
    CompanyOperationBasictemplate: `${config.uploadPrefix}/公司运维基础数据模板.xlsm`,//企业模板下载 
    VerificationImportEntInfo: before + '/EnterpriseApi/VerificationImportEntInfo',//导入企业
    AddPoint: before + '/MonitorPointApi/AddPoint', //添加监测点
    /*污染源信息查询*/
    GetEntList: before + '/EnterpriseApi/GetEntList', //获取监测点信息
    ExportEntList: before + '/EnterpriseApi/ExportEntList', //企业信息 导出
    GetPointList: before + '/MonitorPointApi/GetPointList', //获取监测点信息
    ExportPointList: before + '/MonitorPointApi/ExportPointList', //监测点信息 导出
    GetPointProjectRelationList: before + '/EnterpriseApi/GetPointProjectRelationList', //获取企业运维信息
    ExportPointProjectRelationList: before + '/EnterpriseApi/ExportPointProjectRelationList', //企业运维信息 导出
    GetPointSystemList: before + '/MonitorPointApi/GetPointSystemList', //获取所有排口下系统型号
    ExportPointSystemList: before + '/MonitorPointApi/ExportPointSystemList', //所有排口下系统型号 导出
    GetPointEquipmentList: before + '/MonitorPointApi/GetPointEquipmentList',//获取设备信息 列表
    ExportPointEquipmentList: before + '/MonitorPointApi/ExportPointEquipmentList',//设备信息 导出
    GetPointVerificationItemList: before + '/MonitorPointApi/GetPointVerificationItemList',//获取数据核查项信息
    ExportPointVerificationItemList: before + '/MonitorPointApi/ExportPointVerificationItemList',//数据核查项信息 导出
    GetPointEquipmentParametersList: before + '/MonitorPointApi/GetPointEquipmentParametersList',//获取设备参数项信息
    ExportPointEquipmentParametersList: before + '/MonitorPointApi/ExportPointEquipmentParametersList',//设备参数项信息 导出
    /*项目管理*/
    GetProjectList: before + '/AssetManagementApi/GetProjectList',//获取项目管理
    AddOrUpdateProjectInfo: before + '/AssetManagementApi/AddOrUpdateProjectInfo',//项目管理 添加修改
    DeleteProjectInfo: before + '/AssetManagementApi/DeleteProjectInfo',//项目管理 删除
    GetProjectPointList: before + '/AssetManagementApi/GetProjectPointList',//获取运维监测点信息
    ExportProjectList: before + '/AssetManagementApi/ExportProjectList',//项目管理 导出
    ExportProjectPointList: before + '/AssetManagementApi/ExportProjectPointList',//运维监测点信息 导出
    /*项目权限管理*/
    GetAccessibleProjectList: before + '/AssetManagementApi/GetAccessibleProjectList',//获取项目权限信息
    GetInaccessibleProjectList: before + '/AssetManagementApi/GetInaccessibleProjectList',//获取当前人员未分配的项目权限
    AddAccessibleProjectInfo: before + '/AssetManagementApi/AddAccessibleProjectInfo',//分配项目权限
    DeleteAccessibleProjectInfo: before + '/AssetManagementApi/DeleteAccessibleProjectInfo',//删除项目权限
    /*设备厂家名录*/
    GetEquipmentManufacturerList: before + '/AssetManagementApi/GetEquipmentManufacturerList',//获取设备厂家信息
    AddEquipmentManufacturerInfo: before + '/AssetManagementApi/AddEquipmentManufacturerInfo',//添加设备厂家信息
    UpdateEquipmentManufacturerInfo: before + '/AssetManagementApi/UpdateEquipmentManufacturerInfo',//更新设备厂家信息
    DeleteEquipmentManufacturerInfo: before + '/AssetManagementApi/DeleteEquipmentManufacturerInfo',//删除设备厂家信息
    ExportEquipmentManufacturerList: before + '/AssetManagementApi/ExportEquipmentManufacturerList',//设备厂家信息 导出
    /*系统型号清单*/
    GetSystemModelList: before + '/AssetManagementApi/GetSystemModelList',//获取系统型号信息
    AddSystemModelInfo: before + '/AssetManagementApi/AddSystemModelInfo',//添加系统型号信息
    UpdateSystemModelInfo: before + '/AssetManagementApi/UpdateSystemModelInfo',//更新系统型号信息
    DeleteSystemModelInfo: before + '/AssetManagementApi/DeleteSystemModelInfo',//删除系统型号信息
    GetSystemNameList: before + '/AssetManagementApi/GetSystemNameList',//获取系统名称列表
    ExportSystemModelList: before + '/AssetManagementApi/ExportSystemModelList',//系统型号信息 导出
    /*设备信息清单*/
    GetEquipmentList: before + '/AssetManagementApi/GetEquipmentList',//获取设备信息清单
    AddEquipmentInfo: before + '/AssetManagementApi/AddEquipmentInfo',//添加设备信息清单
    UpdateEquipmentInfo: before + '/AssetManagementApi/UpdateEquipmentInfo',//更新信息清单
    DeleteEquipmentInfo: before + '/AssetManagementApi/DeleteEquipmentInfo',//删除设备信息清单
    GetMonitoringCategoryList: before + '/AssetManagementApi/GetMonitoringCategoryList',//获取设备监测类型
    ExportEquipmentList: before + '/AssetManagementApi/ExportEquipmentList',//设备信息清单 导出
    /*故障单元清单*/
    GetFaultUnitList: before + '/AccountApi/GetFaultUnitList',//获取故障单元清单
    AddFaultUnitInfo: before + '/AccountApi/AddFaultUnitInfo',//添加故障单元清单
    EditFaultUnit: before + '/AccountApi/EditFaultUnit',//更新故障单元清单
    DeleteFaultUnitInfo: before + '/AccountApi/DeleteFaultUnitInfo',//删除故障单元清单
    /*点位匹配设置*/
    GetStateControlledPointRelationList: before + '/AssetManagementApi/GetStateControlledPointRelationList',//获取点位匹配信息
    ExportStateControlledPointRelationList: before + '/AssetManagementApi/ExportStateControlledPointRelationList',//点位匹配信息 导出
    GetStateControlledEntList: before + '/AssetManagementApi/GetStateControlledEntList',//匹配企业
    GetStateControlledPointList: before + '/BaseDataApi/GetStateControlledPointList',//获取企业匹配监测点信息
    UpdateStateControlledPointRelationStatus: before + '/BaseDataApi/GetStateControlledPointList',//更新企业匹配监测点信息
    DeleteStateControlledPointRelationStatus: before + '/BaseDataApi/DeleteStateControlledPointRelationStatus',//删除企业匹配监测点信息
    /*台账填报设置*/
    GetCalibrationAccountFillingTypeList: before + '/BaseDataApi/GetCalibrationAccountFillingTypeList',//获取台账填报设置信息
    UpdateCalibrationAccountFillingTypeInfo: before + '/BaseDataApi/UpdateCalibrationAccountFillingTypeInfo',//更新废气点位校准信息填报方式
    ExportCalibrationAccountFillingTypeList: before + '/BaseDataApi/ExportCalibrationAccountFillingTypeList',//台账填报设置信息 导出

    /*** 运维台账 ***/
    /*运维上岗证*/
    GetMaintainersWorkLicenseList: before + '/AssetManagementApi/GetMaintainersWorkLicenseList',//获取运维上岗证信息
    DeleteMaintainersWorkLicenseInfo: before + '/AssetManagementApi/DeleteMaintainersWorkLicenseInfo',//删除运维上岗证信息
    /*原始数据包*/
    GetOriginalData: before + '/MonBasicDataApi/GetOriginalData',//获取原始数据包信息

    /*** 备件耗材 ***/
    /*备品备件编码*/
    GetSparepartList: before + '/AssetManagementApi/GetSparepartList',//获取备品备件编码
    /*标准气体编码 试剂信息编码*/
    GetStandardGasList: before + '/AssetManagementApi/GetStandardGasList',//获取标准气体编码、试剂信息编码
    AddReferenceMaterialsInfo: before + '/AssetManagementApi/AddReferenceMaterialsInfo',//添加标准气体编码、试剂信息编码
    UpdateReferenceMaterialsInfo: before + '/AssetManagementApi/UpdateReferenceMaterialsInfo',//更新标准气体编码、试剂信息编码
    DeleteReferenceMaterialsInfo: before + '/AssetManagementApi/DeleteReferenceMaterialsInfo',//删除标准气体编码、试剂信息编码

    /*** 客户订单 ***/
    /*客户续费*/
    GetCustomerRenewList: before + '/CustomerServiceApi/GetCustomerRenewList',//获取客户续费信息
    AddCustomerRenewInfo: before + '/CustomerServiceApi/GetCustomerRenewList',//添加客户续费信息
    UpdateCustomerRenewInfo: before + '/CustomerServiceApi/UpdateCustomerRenewInfo',//更新客户续费信息
    DeleteCustomerRenewInfo: before + '/CustomerServiceApi/DeleteCustomerRenewInfo',//删除客户续费信息
    GetCustomerPointAuthorityList: before + '/CustomerServiceApi/GetCustomerPointAuthorityList',//获取客户订单企业与排口列表
    GetCustomerList: before + '/CustomerServiceApi/GetCustomerList',//获取客户续费用户信息
    GetCustomerRenewDetail: before + '/CustomerServiceApi/GetCustomerRenewList',//获取客户续费详情信息
    DeleteCustomerRenewDetail: before + '/CustomerServiceApi/GetCustomerRenewList',//删除客户续费详情信息
    /*续费日志 */
    GetCustomerRenewOperationLogs: before + '/CustomerServiceApi/GetCustomerRenewOperationLogs',//获取客户订单日志和客户订单详情日志信息
    /*** 权限管理 ***/
    /*用户管理*/
    GetUserList: before + '/UserApi/GetUserList',//获取用户信息
    ExportUserList: before + '/UserApi/ExportUserList',//导出用户信息
    ResetPwd: before + '/LoginApi/ResetPwd',//重置用户密码
    ResetUserWechatInfo: before + '/AuthorizeApi/ResetUserWechatInfo',//重置用户微信注册信息
    GetRolesTree: before + '/RoleApi/GetRolesTree',//获取角色树信息
    GetRolesTreeAndObj: before + '/RoleApi/GetRolesTreeAndObj',//获取角色树信息（带根节点）
    GetRoleByUserID: before + '/UserApi/GetRoleByUserID',//获取用户角色
    GetDepartmentTree: before + '/DepartmentApi/GetDepartmentTree',//获取部门树
    GetDepByUserID: before + '/UserApi/GetDepByUserID',//获取部门树
    InsertRoleDepForUser: before + '/UserApi/InsertRoleDepForUser',//给用户添加角色和部门
    DelUserAndRoleDep: before + '/UserApi/DelUserAndRoleDep',//删除用户（假删除）
    /*部门管理*/
    GetDepInfoByTree: before + '/DepartmentApi/GetDepInfoByTree',//获取部门详细信息和层级关系
    InsertDepartInfo: before + '/DepartmentApi/InsertDepartInfo',//新增部门信息
    UpdDepartInfo: before + '/DepartmentApi/UpdDepartInfo',//更新部门信息
    DelDepartInfo: before + '/DepartmentApi/DelDepartInfo',//删除部门信息
    GetPointByDepID: before + '/DepartmentApi/GetPointByDepID',//查询当前部门下的所有排口
    GetDepartInfoByID: before + '/DepartmentApi/GetDepartInfoByID',//获取单个部门信息
    GetDepartTreeAndObj: before + '/DepartmentApi/GetDepartTreeAndObj',//获取部门树信息（带根节点）
    GetGroupRegionFilter: before + '/ConfigureApi/GetGroupRegionFilter',//获取部门区域过滤
    GetAllUser: before + '/UserApi/GetAllUser',//获取所有用户
    GetUserByDepID: before + '/DepartmentApi/GetUserByDepID',//获取当前部门的用户
    InsertDepartByUser: before + '/DepartmentApi/InsertDepartByUser',//给当前部门添加用户（可批量）
    GetAlarmPushDepOrRole: before + '/AuthorizeApi/GetAlarmPushDepOrRole',//获取部门或角色报警关联列表
    InsertAlarmDepOrRole: before + '/AuthorizeApi/InsertAlarmDepOrRole',//添加或修改部门或角色报警关联
    InsertRegionByUser: before + '/DepartmentApi/InsertRegionByUser',//给部门添加行政区(可批量)
    GetRegionByDepID: before + '/DepartmentApi/GetRegionByDepID',//获取当前部门的行政区
    /*角色管理*/
    GetRoleInfoByTree: before + '/RoleApi/GetRoleInfoByTree',//获取角色详细信息和层级关系
    GetRoleInfoByID: before + '/RoleApi/GetRoleInfoByID',//获取单个角色信息
    GetUserByRoleId: before + '/RoleApi/GetUserByRoleId',//获取当前角色的用户
    InsertRoleInfo: before + '/RoleApi/InsertRoleInfo',//新增角色信息
    UpdRoleInfo: before + '/RoleApi/UpdRoleInfo',//更新角色信息
    DelRoleInfo: before + '/RoleApi/DelRoleInfo',//删除角色信息
    InsertRoleByUser: before + '/RoleApi/InsertRoleByUser',//给角色添加用户（可批量）
    GetParentTree: before + '/RoleApi/GetParentTree',//获取根节点下拉选择权限（角色）
    GetMenuByRoleID: before + '/RoleApi/GetMenuByRoleID',//获取当前角色的菜单
    GetRoleMenuTree: before + '/MenuApi/GetRoleMenuTree',//获取菜单列表层级关系
    InsertMenuByRoleID: before + '/AuthorizeApi/InsertMenuByRoleID',//给当前角色添加菜单权限（可批量）
    /*用户权限*/
    InsertPointFilterByUser: before + '/AuthorizeApi/InsertPointFilterByUser',//给当前人员添加排口权限（可批量）
    /*用户恢复*/
    RecoveryUserInfo: before + '/AuthorizeApi/RecoveryUserInfo',//恢复用户信息
    /*交接和报告*/
    GetProjectReportList: before + '/CTBaseDataApi/GetProjectReportList',   //列表
    AddOrUpdProjectReportInfo: before + '/CTBaseDataApi/AddOrUpdProjectReportInfo', //编辑
    ExportProjectReportList: before + '/CTBaseDataApi/ExportProjectReportList'   //导出

  },
  //绩效排名
  PerformanceApi: {
    /*工作总量绩效*/
    GetPersonalPerformanceList: before + '/PerformanceCoefficient/GetPersonalPerformanceList',  //获取绩效汇总
    ExportPersonalPerformanceList: before + '/PerformanceCoefficient/ExportPersonalPerformanceList',  //导出绩效汇总
    GetPersonalPerformanceDetail: before + '/PerformanceCoefficient/GetPersonalPerformanceDetail', //获取个人分摊套数明细
    ExportPersonalPerformanceDetail: before + '/PerformanceCoefficient/ExportPersonalPerformanceDetail', //导出个人分摊套数明细
    GetPersonalPerformanceWorkOrderList: before + '/PerformanceCoefficient/GetPersonalPerformanceWorkOrderList',//获取个人工单信息
    ExportPersonalPerformanceWorkOrderList: before + '/PerformanceCoefficient/ExportPersonalPerformanceWorkOrderList',//导出个人工单信息
    GetPointCoefficientList: before + '/PerformanceCoefficient/GetPointCoefficientList',//获取监测点系数
    ExportPointCoefficientList: before + '/PerformanceCoefficient/ExportPointCoefficientList',//监测点系数 导出
    GetWorkOrderTypeCoefficientList: before + '/PerformanceCoefficient/GetWorkOrderTypeCoefficientList',//获取工单系数类型

  },

  // 系统管理Api
  SystemManageApi: {
    /*公告管理*/
    GetNoticeList: before + '/NoticeApi/GetNoticeList', //获取公告管理信息
    AddOrUpdateNoticeInfo: before + '/NoticeApi/AddOrUpdateNoticeInfo', //添加修改公告
    DeleteNoticeInfo: before + '/NoticeApi/DeleteNoticeInfo', //删除公告
    GetAllRoleList: before + '/NoticeApi/GetAllRoleList', //获取角色
    /*资源中心*/
    GetQuestionList: before + '/KnowledgeCenterApi/GetQuestionList', //获取问题清单列表
    AddOrUpdateQuestionInfo: before + '/KnowledgeCenterApi/AddOrUpdateQuestionInfo', //获取问题清单列表
    GetQuestionTypeList: before + '/KnowledgeCenterApi/GetQuestionTypeList', //获取问题清单类别
  },


  /*********** 成套 ***********/

  //通用 Api
  CtCommonApi: {
    GetEntAndPointList: before + '/CTBaseDataApi/GetEntAndPointList', //站点信息
  },
  //项目执行进度 Api
  CtProjectExecuProgressApi: {
    GetServiceDispatch: before + '/CTBaseDataApi/GetServiceDispatch',//获取服务派单信息
    GetServiceDispatchTypeAndRecord: before + '/CTBaseDataApi/GetServiceDispatchTypeAndRecord',  //服务填报内容 要加载的项
    GetAcceptanceServiceRecord: before + '/CTBaseDataApi/GetAcceptanceServiceRecord',//服务填报内容  服务报告
    GetWorkRecord: before + '/CTBaseDataApi/GetWorkRecord', //服务填报内容  工作记录
    GetPublicRecord: before + '/CTBaseDataApi/GetPublicRecord', //服务填报内容  勘查信息、 项目交接单、安装报告、72小时调试检测、比对监测报告、验收资料等
    GetInstallationPhotosRecord: before + '/CTBaseDataApi/GetInstallationPhotosRecord',//服务填报内容  安装照片
    GetParameterSettingsPhotoRecord: before + '/CTBaseDataApi/GetParameterSettingsPhotoRecord', //服务填报内容  参数设置照片
    GetCooperateRecord: before + '/CTBaseDataApi/GetCooperateRecord',//服务填报内容  配合检查
    GetRepairRecord: before + '/CTBaseDataApi/GetRepairRecord',//服务填报内容  维修记录
    ExportServiceDispatch: before + '/CTBaseDataApi/ExportServiceDispatch',  //服务派单信息 导出
  },
  //调试服务
  CtDebugServiceApi: {
    /*调试点位管理*/
    GetPointCemsSystemList: before + '/DebuggingEquipmentApi/GetPointCemsSystemList',  //获取监测点CEMS参数信息
    OperationPointCemsSystemInfo: before + '/DebuggingEquipmentApi/OperationPointCemsSystemInfo',  //添加更新CEMS参数信息
    GetPointReferenceInstrumentList: before + '/DebuggingEquipmentApi/GetPointReferenceInstrumentList', //获取参比仪器信息
    OperationPointReferenceInstrumentInfo: before + '/DebuggingEquipmentApi/GetPointReferenceInstrumentList', //添加更新参比仪器信息
   
    /*72小时调试检测*/
    GetDebuggingEntTree: before + '/DebuggingEquipmentApi/GetDebuggingEntTree', //获取企业监测点信息 树结构
    Get72HoursDebuggingItem: before + '/DebuggingEquipmentApi/Get72HoursDebuggingItem', //获取表单类型
    Get72HoursGasPollutantInfo: before + '/DebuggingEquipmentApi/Get72HoursGasPollutantInfo', //获取表单污染物信息
    Import72HoursCommissioningTestData: before + '/DebuggingEquipmentApi/Import72HoursCommissioningTestData',//颗粒物参比和参比方法评估气态污染物CEMS（含氧量）准确度导入数据
                                          //获取参比方法校准颗粒物CEMS采样时间信息
    //颗粒物CEMS零点和量程漂移检测
    GetPMDriftInfo: before + '/DebuggingEquipmentApi/GetPMDriftInfo',//获取录入信息
    AddOrUpdatePMDriftInfo: before + '/DebuggingEquipmentApi/AddOrUpdatePMDriftInfo',//添加更新信息
    DeletePMDriftInfo: before + '/DebuggingEquipmentApi/DeleteGasDriftInfo',//删除信息
    // 参比方法校准颗粒物CEMS
    GetReferenceCalibrationPMInfo: before + '/DebuggingEquipmentApi/Get72HoursGasPollutantInfo', //获取颗粒物参比参数信息
    AddOrUpdateReferenceCalibrationPMInfo: before + '/DebuggingEquipmentApi/AddOrUpdateReferenceCalibrationPMInfo', //添加更新颗粒物参比信息
    DeleteReferenceCalibrationPMInfo: before + '/DebuggingEquipmentApi/DeleteReferenceCalibrationPMInfo', //删除颗粒物参比信息
    //参比方法评估气态污染物CEMS（含氧量）准确度
    GetGasReferenceMethodAccuracyInfo: before + '/DebuggingEquipmentApi/GetGasReferenceMethodAccuracyInfo',//获取录入信息
    AddReferenceMethodCemsAccuracyTime: before + '/DebuggingEquipmentApi/AddReferenceMethodCemsAccuracyTime',//初始添加信息
    AddOrUpdateReferenceMethodCemsAccuracyInfo: before + '/DebuggingEquipmentApi/AddOrUpdateReferenceMethodCemsAccuracyInfo',//添加更新信息
    DeleteGasReferenceMethodAccuracyInfo: before + '/DebuggingEquipmentApi/DeleteGasReferenceMethodAccuracyInfo',//删除信息
    //气态污染物CEMS示值误差和系统响应时间检测
    GetGasIndicationErrorResponseTimeInfo: before + '/DebuggingEquipmentApi/GetGasIndicationErrorResponseTimeInfo',//获取录入信息
    AddOrUpdateGasIndicationErrorResponseTimeInfo: before + '/DebuggingEquipmentApi/AddOrUpdateGasIndicationErrorResponseTimeInfo',//添加更新信息
    DeleteGasIndicationErrorResponseTimeInfo: before + '/DebuggingEquipmentApi/DeleteGasIndicationErrorResponseTimeInfo',//删除信息
    //速度场系数检测表单
    GetVelocityFieldCoefficientInfo: before + '/DebuggingEquipmentApi/GetVelocityFieldCoefficientInfo',//获取录入信息
    AddOrUpdateVelocityFieldCoefficientInfo: before + '/DebuggingEquipmentApi/AddOrUpdateVelocityFieldCoefficientInfo',//添加更新信息
    DeleteVelocityFieldCoefficientInfo: before + '/DebuggingEquipmentApi/DeleteVelocityFieldCoefficientInfo',//删除信息
    //温度CMS准确度检测表单
    GetTemperatureAccuracyInfo: before + '/DebuggingEquipmentApi/GetTemperatureAccuracyInfo',//获取录入信息
    AddOrUpdateTemperatureAccuracyInfo: before + '/DebuggingEquipmentApi/AddOrUpdateTemperatureAccuracyInfo',//添加更新信息
    DeleteTemperatureAccuracyInfo: before + '/DebuggingEquipmentApi/DeleteTemperatureAccuracyInfo',//删除信息
    //湿度CMS准确度检测表单
    GetHumidityAccuracyInfo: before + '/DebuggingEquipmentApi/GetHumidityAccuracyInfo',//获取录入信息
    AddOrUpdateHumidityAccuracyInfo: before + '/DebuggingEquipmentApi/AddOrUpdateHumidityAccuracyInfo',//添加更新信息
    DeleteHumidityAccuracyInfo: before + '/DebuggingEquipmentApi/DeleteHumidityAccuracyInfo',//删除信息
    //气态污染物CEMS（含氧量）零点和量程漂移检测
    GetGasDriftInfo: before + '/DebuggingEquipmentApi/GetGasDriftInfo',//获取录入信息
    AddOrUpdateGasDriftInfo: before + '/DebuggingEquipmentApi/AddOrUpdateGasDriftInfo',//添加更新信息
    DeleteGasDriftInfo: before + '/DebuggingEquipmentApi/DeleteGasDriftInfo',//删除信息
    //生成检测报告
    Export72HoursCommissioningTestReport: before + '/DebuggingEquipmentApi/Export72HoursCommissioningTestReport',//导出72小时调试检测报告
  
    /*区域权限管理*/
    GetDebuggingAreaGroupList: before + '/DebuggingEquipmentApi/GetDebuggingAreaGroupList',//获取部门详细信息及层级关系
    AddOrUpdateDebuggingAreaGroupInfo: before + '/DebuggingEquipmentApi/AddOrUpdateDebuggingAreaGroupInfo',//添加部门信息
    DeleteDebuggingAreaGroupInfo: before + '/DebuggingEquipmentApi/DeleteDebuggingAreaGroupInfo',//删除部门信息
    GetDebuggingAreaUserList: before + '/DebuggingEquipmentApi/GetDebuggingAreaUserList',//获取当前部门的用户
    OperationDebuggingAreaUserInfo: before + '/DebuggingEquipmentApi/OperationDebuggingAreaUserInfo',//给当前部门分配用户
  },
  //资产管理 Api
  CtAssetManagementApi: {
    /*** 设备台账 ***/
    /*污染源管理*/
    AddOrEditCommonPointList: before + '/CTBaseDataApi/AddOrEditCommonPointList', //添加或修改监测点
    AddOrUpdateMonitorEntElectronicFence: before + '/CTBaseDataApi/AddOrUpdateMonitorEntElectronicFence', //修改企业电子围栏半径
    GetMonitorEntElectronicFence: before + '/CTBaseDataApi/GetMonitorEntElectronicFence', //获取企业电子围栏半径
    GetPointIndustryList: before + '/CTBaseDataApi/GetPointIndustryList',  //获取行业和监测点类型信息
    GetTechnologyList: before + '/CTBaseDataApi/GetTechnologyList',//获取监测点工艺类型
    GetCEMSSystemList: before + '/CTBaseDataApi/GetCEMSSystemList', // 获取监测点，系统信息，系统变更信息仪表信息，仪表变更信息
    AddOrEditCEMSSystem: before + '/CTBaseDataApi/AddOrEditCEMSSystem',// 添加或修改系统型号
    AddOrEditCEMSSystemChange: before + '/CTBaseDataApi/AddOrEditCEMSSystemChange', //添加或修改系统更换记录
    AddOrEditEquipment: before + '/CTBaseDataApi/AddOrEditEquipment',  // 添加或修仪表信息
    AddOrEditEquipmentChange: before + '/CTBaseDataApi/AddOrEditEquipmentChange',// 添加或修仪仪表更换记录
    PointSort: before + '/CTBaseDataApi/PointSort',// 监测点排序
    /*服务档案查询 */
    GetCTProjectList: before + '/CTBaseDataApi/GetCTProjectList', //项目列表
    UpdateCTProject: before + '/CTBaseDataApi/UpdateCTProject', //修改项目信息
    GetrojectPointRelationList: before + '/CTBaseDataApi/GetrojectPointRelationList',//获取项目与站点管理关系
    AddProjectPointRelation: before + '/CTBaseDataApi/AddProjectPointRelation',//添加项目与站点关联关系
    ExportCTProjectList: before + '/CTBaseDataApi/ExportCTProjectList',  //项目列表 导出
    /*设备厂家名录 */
    GetEquipmentManufacturerInventory: before + '/DebuggingEquipmentApi/GetEquipmentManufacturerInventory',  //获取设备厂商信息
    /*系统型号清单*/
    GetCemsSystemModelInventory: before + '/DebuggingEquipmentApi/GetCemsSystemModelInventory',  //获取系统型号清单信息
    AddCemsSystemModelInfo: before + '/DebuggingEquipmentApi/AddCemsSystemModelInfo',  //添加系统型号清单信息
    UpdCemsSystemModelInfo: before + '/DebuggingEquipmentApi/AddCemsSystemModelInfo',  //更新系统型号清单信息
    DeleteCemsSystemModelInfo: before + '/DebuggingEquipmentApi/DeleteCemsSystemModelInfo',  //删除系统型号清单信息
    /*设备信息清单*/
    GetCemsEquipmentInventory: before + '/DebuggingEquipmentApi/GetCemsEquipmentInventory',  //获取设备信息清单
    AddCemsEquipmentInfo: before + '/DebuggingEquipmentApi/AddCemsEquipmentInfo', //添加设备信息清单信息
    UpdCemsEquipmentInfo: before + '/DebuggingEquipmentApi/UpdCemsEquipmentInfo', //更新设备信息清单信息
    DeleteCemsEquipmentInfo: before + '/DebuggingEquipmentApi/UpdCemsEquipmentInfo', //删除设备信息清单信息
    /*参比仪器清单*/
    GetReferenceInstrumentInventory: before + '/DebuggingEquipmentApi/GetReferenceInstrumentInventory',  //获取参比仪器设备清单
    AddReferenceInstrumentInfo: before + '/DebuggingEquipmentApi/AddReferenceInstrumentInfo',  //添加参比仪器设备清单
    UpdReferenceInstrumentInfo: before + '/DebuggingEquipmentApi/AddReferenceInstrumentInfo',  //更新参比仪器设备清单
    DeleteReferenceInstrumentInfo: before + '/DebuggingEquipmentApi/AddReferenceInstrumentInfo',  //删除参比仪器设备清单
  },
};

export const UPLOAD = {};
