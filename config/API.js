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
    GetXuRegions: before + '/RegionApi/GetXuRegions',//获取省份及省份下的市县
    GetRegions: before + '/RegionApi/GetRegions', //获取行政区
    GetAttentionDegreeList: before + '/RegionApi/GetAttentionDegreeList',//获取关注程度
    GetNoFilterEntList: before + '/EnterpriseApi/GetNoFilterEntList',//获取无权限过滤的企业信息
    GetNoFilterPointByEntCode: before + '/EnterpriseApi/GetNoFilterPointByEntCode',//通过企业获取无权限过滤的监测点信息
    GetEntByRegion: before + '/EnterpriseApi/GetEntByRegion',//根据行政区查询企业
    GetEntByRegionAndAtt: before + '/EnterpriseApi/GetEntByRegionAndAtt', //获取行政区和关注程度查询企业
    GetEntAndPoint: before + '/EnterpriseApi/GetEntAndPoint',//获取企业和企业对应的排口信息
    GetPointByEntCode: before + '/MonitorPointApi/GetPointByEntCode',//根据企业编号与污染物编号查询监测点
    GetPollutantCodeList: before + '/MonitorPollutantApi/GetPollutantCodeList',//根据污染物类型获取污染物
    GetPollutantTypeCode: before + '/MonitorPollutantApi/GetPollutantTypeCode',//获取数据一览表头，包括因子编码、因子名称、因子单位
    GetPollutantListByDgimn: before + '/MonitorPollutantApi/GetPollutantListByDgimn',//根据MN号获取污染物
    GetPollutantTypeList: before + '/MonitorPollutantApi/GetPollutantTypeList',//获取系统污染物类型信息
    GetPollutantByType: before + '/MonitorPollutantApi/GetPollutantByType', //根据企业类型查询监测因子
    GetStandardPollutantsByDgimn: before + '/StandardLibraryApi/GetStandardPollutantsByDgimn', //根据排口获取标准污染物列表
    GetPollutantTypeMonitoringCategoryInfo: before + '/EquipmentApi/GetPollutantTypeMonitoringCategoryInfo',//获取设备信息监测参数类型
    GetIndustryTree: before + '/AutoFormDataApi/GetIndustryTree', //获取行业树信息
  },
  // 可视化看板Api
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
    GetStatePointEquipmentExceptionsOverview: before + '/VisualDashBoardApi/GetStatePointEquipmentExceptionsOverview',//获取设备异常总览 设备异常率、设备故障率、设备故障修复率（评估中心）
    GetMapPointList: before + '/VisualDashBoardApi/GetMapPointList',//获取地图数据
    GetOperatePointList: before + '/VisualDashBoardApi/GetOperatePointList',//获取运维信息总览 详情运维企业、监测点信息
    ExportOperatePointList: before + '/VisualDashBoardApi/ExportOperatePointList',//导出运维信息总览 详情运维企业、监测点信息
    GetOperationPlanTaskList: before + '/VisualDashBoardApi/GetOperationPlanTaskList',// 获取近30日运维工单统计 详情
    ExportOperationPlanTaskList: before + '/VisualDashBoardApi/ExportOperationPlanTaskList',// 导出近30日运维工单统计 详情
    GetVisualDashBoardNetworkingRate: before + '/VisualDashBoardApi/GetVisualDashBoardNetworkingRate',//获取实时联网率统计
    GetProviceNetworkingRate: before + '/VisualDashBoardApi/GetProviceNetworkingRate',// 获取省实时联网率
    GetCityNetworkingRate: before + '/VisualDashBoardApi/GetCityNetworkingRate',// 获取市实时联网率
    GetPointNetworkingRate: before + '/VisualDashBoardApi/GetPointNetworkingRate',// 获取点位实时联网率
    ExportProviceNetworkingRate: before + '/VisualDashBoardApi/ExportProviceNetworkingRate',// 导出省实时联网率
    ExportCityNetworkingRate: before + '/VisualDashBoardApi/ExportCityNetworkingRate',// 导出市实时联网率
    ExportPointNetworkingRate: before + '/VisualDashBoardApi/ExportPointNetworkingRate',// 导出点位实时联网率
    GetResponseList: before + '/VisualDashBoardApi/GetResponseList',// 获取报警响应及时率
    ExportResponseList: before + '/VisualDashBoardApi/ExportResponseList',// 导出报警响应及时率
    GetEquipmentExecptionRateList: before + '/VisualDashBoardApi/GetEquipmentExecptionRateList',//获取省、市、企业监测点设备完好率
    ExportEquipmentExecptionRateList: before + '/VisualDashBoardApi/ExportEquipmentExecptionRateList',//导出省、市、企业监测点设备完好率
    GetEquipmentFailureRateList: before + '/VisualDashBoardApi/GetEquipmentFailureRateList',//获取省、市、企业监测点设备故障率
    ExportEquipmentFailureRateList: before + '/VisualDashBoardApi/ExportEquipmentFailureRateList',//导出省、市、企业监测点设备故障率
    GetStatePointExecptionRateList: before + '/VisualDashBoardApi/GetStatePointExecptionRateList',//获取省、市、企业监测点设备完好率和故障率（评估中心）
    ExportStatePointExecptionRateList: before + '/VisualDashBoardApi/ExportStatePointExecptionRateList',//导出省、市、企业监测点设备完好率和故障率（评估中心）
    GetEquipmentRepairRateList: before + '/VisualDashBoardApi/GetEquipmentRepairRateList',//获取省、市、企业监测点设备故障修复率
    ExportRepairRateList: before + '/VisualDashBoardApi/ExportRepairRateList',//导出省、市、企业监测点设备故障修复率
    GetOverModel: before + '/OverDataApi/GetOverModel',//获取超标记录汇总信息
    GetOverData: before + '/OverDataApi/GetOverData',//获取超标记录详情信息
    GetExceptionModel: before + '/ExceptionDataApi/GetExceptionModel',//获取异常记录汇总信息
    GetExceptionData: before + '/ExceptionDataApi/GetExceptionData',//获取异常记录详情信息
    GetVideoList: before + '/VideoApi/GetVideoList',//视频管理获取视频信息
  },
  //工作台Api
  WorkStageApi: {
    GetStagingInspectorRectificationList: before + '/SystemFacilityVerification/GetStagingInspectorRectificationList',//获取运维服务信息
    GetWorkAlarmPushList: before + '/OperationWorkbenchApi/GetWorkAlarmPushList',//获取数据报警信息
    UpdateWorkPushStatus: before + '/OperationWorkbenchApi/UpdateWorkPushStatus',//删除数据报警信息
    UpdateAllWorkPushStatus: before + '/OperationWorkbenchApi/UpdateAllWorkPushStatus',//删除所有数据报警信息
    GetProjectRemindList: before + '/OperationWorkbenchApi/GetProjectRemindList',//获取合同到期信息
    UpdateProjectPushStatus: before + '/OperationWorkbenchApi/UpdateProjectPushStatus',//删除合同到期信息
    UpdateAllProjectPushStatus: before + '/OperationWorkbenchApi/UpdateAllProjectPushStatus',//删除所有合同到期信息
    GetUserMenuList: before + '/OperationWorkbenchApi/GetUserMenuList',//获取工作台快捷导航信息和可添加菜单信息
    AddUserMenu: before + '/OperationWorkbenchApi/AddUserMenu',//添加快捷菜单
    GetWorkbenchesModuleList: before + '/OperationWorkbenchApi/GetWorkbenchesModuleList',//获取动态加载工作台模块信息
  },

  // 全过程监控Api
  WholeProcessMonitorApi: {
    /**监测数据总览**/
    /*数据总览*/
    AllTypeSummaryList: before + '/MonBasicDataApi/AllTypeSummaryList', //获取获取站点基本信息、在线状态、报警状态、最新一条小时监测数据，包括污染源、空气质量
    /*在线监测数据*/
    GetAllTypeDataList: before + '/MonBasicDataApi/GetAllTypeDataList',//获取各种类型的数据列表（实时、分钟、小时、日均）
    ExportAllTypeDataList: before + '/MonBasicDataApi/ExportAllTypeDataList',//导出各种类型的数据列表（实时、分钟、小时、日均）
    /**质控数据总览**/
    /*有效传输率排名*/
    GetTransmissionEfficiencyRateList: before + '/TransmissionEfficiencyApi/GetTransmissionEfficiencyRateList',//获取省、市、监测点有效传输率统计信息
    ExportTransmissionEfficiencyRateList: before + '/TransmissionEfficiencyApi/ExportTransmissionEfficiencyRateList',//导出省、市级别有效传输率统计信息
    /*系统访问率*/
    GetSystemAccessRateList: before + '/SystemAccessApi/GetSystemAccessRateList',//获取大区、服务区的系统访问率
    ExportSystemAccessRateList: before + '/SystemAccessApi/ExportSystemAccessRateList',//导出大区、服务区的系统访问率
    GetUserAccessInfo: before + '/SystemAccessApi/GetUserAccessInfo',//获取用户访问率
    ExportUserAccessInfo: before + '/SystemAccessApi/ExportUserAccessInfo',//导出用户访问率
    GetIndustryAttributeInfo: before + '/SystemAccessApi/GetIndustryAttributeInfo',//获取业务属性和行业属性
    /*平台分析报告*/
    ExportPlatformAnalysisReport: before + '/WorkOrderStatistics/ExportPlatformAnalysisReport',//导出平台分析报告
    /*站点数据总览*/
    GetDayReport: before + '/MonBasicDataApi/GetDayReport',//获取站点日报报表
    GetMonthReport: before + '/MonBasicDataApi/GetMonthReport',//获取站点月报报表
    GetYearReport: before + '/MonBasicDataApi/GetYearReport',//获取站点年报报表
    GetReportExcel: before + '/MonBasicDataApi/GetReportExcel',//导出站点日报、月报、年报报表
    GetSummaryDayReport: before + '/MonBasicDataApi/GetSummaryDayReport',//获取站点汇总日报报表
    GetSummaryMonthReport: before + '/MonBasicDataApi/GetSummaryMonthReport',//获取站点汇总月报报表
    GetSummaryYearReport: before + '/MonBasicDataApi/GetSummaryYearReport',//获取站点汇总年报报表
    GetSummaryReportExcel: before + '/MonBasicDataApi/GetSummaryReportExcel',//导出站点汇总站点日报、月报、年报报表
    /*废气排放量总览*/
    GetAllTypeDataListGas: before + '/MonBasicDataApi/GetAllTypeDataListGas',//获取废气日平均值小日平均日报、日平均月报、月平均季报、季平均年报信息
    ExportAllTypeDataListGas: before + '/MonBasicDataApi/ExportAllTypeDataListGas',//导出废气日平均值小日平均日报、日平均月报、月平均季报、季平均年报信息
    /*废水排放量总览*/
    GetAllTypeDataListWater: before + '/MonBasicDataApi/GetAllTypeDataListWater',//获取废水日平均值小日平均日报、日平均月报、月平均季报、季平均年报信息
    ExportAllTypeDataListWater: before + '/MonBasicDataApi/ExportAllTypeDataListWater',//导出废水日平均值小日平均日报、日平均月报、月平均季报、季平均年报信息
    /**视频监控**/
    /*视频监控（企业）*/
    GetCameraListEnt: before + '/VideoApi/GetCameraListEnt',//获取企业视频监控信息
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
    PostRetransmission: before + '/WorkOrderApi/PostRetransmission', //任务转发
    //电子表单
    GetCemsCalibrationRecord: before + '/GasOperationFormApi/GetCemsCalibrationRecord', //获取单个任务的校准记录
    GetConsumablesReplaceRecordList: before + '/ConsumableMaterialApi/GetConsumablesReplaceRecordList', //获取易耗品更换记录
    GetFaultRecordForPCList: before + '/GasOperationFormApi/GetFaultRecordForPCList', //获取故障小时记录
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
    GetWaterCalibrationRecordForPCList: before + '/WaterOperationFormApi/GetWaterCalibrationRecordForPCList', //获取废水校准记录
    GetStandardSolutionRecordForPCList: before + '/WaterOperationFormApi/GetStandardSolutionRecordForPCList', //获取标准溶液核查记录
    GetWaterParametersChangeRecordForPCList: before + '/GasOperationFormApi/GetWaterParametersChangeRecordForPCList', //获取废水参数变动记录
    GetGasParametersChangeRecordForPCList: before + '/GasOperationFormApi/GetGasParametersChangeRecordForPCList', //获取废气参数变动记录
    GetWaterComparisonTestRecordForPCList: before + '/WaterOperationFormApi/GetWaterComparisonTestRecordForPCList', //获取实际水样比对试验结果记录
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
    GetOperationReportList: before + '/WorkOrderStatistics/GetOperationReportList',//获取运维月度报告信息
    ExportOperationReport: before + '/WorkOrderStatistics/ExportOperationReport',//导出运维月度报告
  },
  //智能诊断Api
  IntelligentDiagnosisApi: {
    /**异常数据处置**/
    /*停运上报*/
    AddOutputStop: before + '/OutputStopApi/AddOutputStop',//添加停运上报信息
    UpdateOutputStop: before + '/OutputStopApi/UpdateOutputStop',//更新停运上报信息
    DeleteOutputStopById: before + '/OutputStopApi/DeleteOutputStopById',//删除停运上报信息
    /*异常数据上报*/
    GetExceptionReportList: before + '/ExceptionApi/GetExceptionReportList',//获取异常数据上报信息、企业异常记录
    AddOrUpdateExceptionReportInfo: before + '/ExceptionApi/AddOrUpdateExceptionReportInfo',//添加更新异常数据上报信息
    DeleteExceptionReportInfo: before + '/ExceptionApi/DeleteExceptionReportInfo',//删除异常数据上报信息
    GetExceptionReportedById: before + '/ExceptionDataApi/GetExceptionReportedById',//获取异常数据上报详情
    /*设备故障反馈*/
    GetEquipmentFaultFeedbackList: before + '/EquipmentFailure/GetEquipmentFaultFeedbackList',//获取设备故障反馈信息
    ExportEquipmentFaultFeedbackList: before + '/EquipmentFailure/ExportEquipmentFaultFeedbackList',//导出设备故障反馈信息
    UpdateEquipmentFaultFeedbackStatus: before + '/EquipmentFailure/UpdateEquipmentFaultFeedbackStatus',//更新设备故障反馈信息
    /**异常数据分析**/
    /*超标数据分析*/
    GetOverDataList: before + '/OverDataApi/GetOverDataList', //获取超标数据信息
    ExportOverDataList: before + '/OverDataApi/ExportOverDataList', //导出超标数据信息
    GetOverStandardNum: before + '/OverDataApi/GetOverStandardNum', //获取超标次数
    ExportOverStandardNum: before + '/OverDataApi/ExportOverStandardNum', //导出超标次数
    /*超标数据报警 超标报警核实率*/
    GetOverToExamineOperation: before + '/AlarmVerifyManageApi/GetOverToExamineOperation',//获取超标核实类型
    GetAlarmVerifyRate: before + '/OverAlarmApi/GetAlarmVerifyRate',//获取超标数据信息
    ExportAlarmVerifyRate: before + '/OverAlarmApi/ExportAlarmVerifyRate',//导出超标数据信息
    GetAlarmVerifyRateDetail: before + '/OverAlarmApi/GetAlarmVerifyRateDetail',//获取超标数据信息详情
    ExportAlarmVerifyRateDetail: before + '/OverAlarmApi/ExportAlarmVerifyRateDetail',//导出超标数据信息详情
    GetAlarmVerifyDetail: before + '/AlarmVerifyManageApi/GetAlarmVerifyDetail',//获取超标数据报警次数详情
    ExportAlarmVerifyDetail: before + '/AlarmVerifyManageApi/ExportAlarmVerifyDetail',//导出超标数据报警次数详情
    /*缺失数据分析*/
    GetMissDataList: before + '/ExceptionDataApi/GetMissDataList',//获取缺失数据分析信息
    ExportMissDataList: before + '/ExceptionDataApi/ExportMissDataList',//导出缺失数据分析信息
    /*缺失数据报警 缺失数据报警响应率*/
    GetMissDataResponseRateList: before + '/ExceptionAlarmApi/GetMissDataResponseRateList',//获取缺失数据报警和响应率信息
    ExportMissDataResponseRateList: before + '/ExceptionAlarmApi/ExportMissDataResponseRateList',//导出缺失数据报警和响应率信息
    /*异常数据分析*/
    GetExceptionList: before + '/ExceptionDataApi/GetExceptionList',//获取省级、市级异常数据信息
    ExportExceptionList: before + '/ExceptionDataApi/ExportExceptionList',//导出省级、市级异常数据信息
    // GetExceptionCityList: before + '/ExceptionDataApi/GetExceptionCityList',//获取市级异常数据信息
    // ExportExceptionCityList: before + '/ExceptionDataApi/ExportExceptionCityList',//导出市级异常数据信息
    GetExceptionPointList: before + '/ExceptionDataApi/GetExceptionPointList',//获取监测点异常数据信息
    ExportExceptionPointList : before + '/ExceptionDataApi/ExportExceptionPointList',//获取监测点异常数据信息
    /*异常数据报警*/
    GetExceptionAlarmResponseList: before + '/ExceptionResponseRateApi/GetExceptionAlarmResponseList',//获取异常数据报警信息
    ExportExceptionAlarmResponseList: before + '/ExceptionResponseRateApi/ExportExceptionAlarmResponseList',//导出异常数据报警信息
    /*异常报警响应率*/
    GetExceptionAlarmResponseRateList: before + '/ExceptionResponseRateApi/GetExceptionAlarmResponseRateList',//获取异常数据报警响应率信息
    ExportExceptionAlarmResponseRateList: before + '/ExceptionResponseRateApi/ExportExceptionAlarmResponseRateList',//导出异常数据报警响应率信息
    /*停运记录分析*/
    GetStopList: before + '/OutputStopApi/GetStopList',//获取停运记录
    ExportStopList: before + '/OutputStopApi/ExportStopList',//导出停运记录
    /*企业异常记录*/
    ExportExceptionReportList: before + '/ExceptionApi/ExportExceptionReportList',//获取企业异常记录
    GetExceptionReportedView: before + '/ExceptionDataApi/GetExceptionReportedView',//获取企业异常记录详情
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
    /**设备参数管理**/
    GetEquipmentParametersInfo: before + '/EquipmentApi/GetEquipmentParametersInfo',//获取量程设定信息
    GetParametersInfo: before + '/EquipmentApi/GetParametersInfo',//获取测量参数信息
    AddOrUpdateEquipmentParametersInfo: before + '/EquipmentApi/AddOrUpdateEquipmentParametersInfo',//添加更新量程设定信息
    DeleteEquipmentParametersInfo: before + '/EquipmentApi/DeleteEquipmentParametersInfo',//删除量程设定信息
    GetEquipmentParameters: before + '/EquipmentApi/GetEquipmentParameters',//获取烟气流量、颗粒物参数、其他参数设定信息
    AddOrUpdateEquipmentParameters: before + '/EquipmentApi/AddOrUpdateEquipmentParameters',//添加更新烟气流量、颗粒物参数、其他参数设定信息
    /**异常精准识别核实整改率**/
    /*核实率*/
    GetModelWarningCheckedForRegion: before + '/Warning/GetModelWarningCheckedForRegion', //行政区 列表
    GetModelWarningCheckedForCity: before + '/Warning/GetModelWarningCheckedForCity',   //市 列表
    GetModelWarningCheckedForEnt: before + '/Warning/GetModelWarningCheckedForEnt',   //企业 列表
    GetModelWarningCheckedForPoint: before + '/Warning/GetModelWarningCheckedForPoint', //监测点 列表
    ExportModelWarningCheckedForRegion: before + '/Warning/ExportModelWarningCheckedForRegion', //行政区 导出
    ExportModelWarningCheckedForCity: before + '/Warning/ExportModelWarningCheckedForCity',  //市 导出
    ExportModelWarningCheckedForEnt: before + '/Warning/ExportModelWarningCheckedForEnt', //企业 导出
    /*整改率*/
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
    GetKeyParameterCheckList: before + '/KeyParameter/GetKeyParameterCheckList', //获取关键参数核查信息
    ExportKeyParameterCheckList: before + '/KeyParameter/ExportKeyParameterCheckList', //导出关键参数核查信息
    GetRangeConsistencyDetail: before + '/KeyParameter/GetRangeConsistencyDetail', //获取关键参数核查信息明细
    AddRemoteInspector: before + '/KeyParameter/AddRemoteInspector', //更新关键参数核查信息
    DeleteKeyParameterCheckInfo: before + '/KeyParameter/DeleteKeyParameterCheckInfo', //删除关键参数核查信息
    GetParameterConsistencyCodeInfo: before + '/KeyParameter/GetParameterConsistencyCodeInfo',//获取量程和实时数据一致性核查监测参数信息
    JudgeRangeConsistencyCheck: before + '/KeyParameter/JudgeRangeConsistencyCheck',//获取量程一致性(自动判断)
    JudgeDataConsistencyCheck: before + '/KeyParameter/JudgeDataConsistencyCheck',//获取数据一致性(自动判断)	
    GetNOxValue: before + '/KeyParameter/GetNOxValue',//获取NOx数采仪实时数据
    JudgeParameterConsistencyInfo: before + '/KeyParameter/JudgeParameterConsistencyInfo',//获取参数一致性核查检查项目信息
    IssueKeyParameterCheckInfo: before + '/KeyParameter/IssueKeyParameterCheckInfo',//关键参数核查下发
    GetRemoteInspectorPointList: before + '/KeyParameter/GetRemoteInspectorPointList',//获取可申请的站点工单
    AddRemoteInspectorPoint: before + '/KeyParameter/AddRemoteInspectorPoint',//申请关键参数核查
    ForwardRemoteInspector: before + '/KeyParameter/ForwardRemoteInspector',//转发关键参数核查
    ExportRangeParam: before + '/KeyParameter/ExportRangeParam',//导入合格的参数核查
    /*关键参数核查（新）*/
    GetNewKeyParameterCheckList: before + '/KeyParameter/GetNewKeyParameterCheckList',//获取关键参数核查信息
    ExportNewKeyParameterCheckList: before + '/KeyParameter/ExportNewKeyParameterCheckList',//导出关键参数核查信息
    GetKeyParameterCheckDetailList: before + '/KeyParameter/GetKeyParameterCheckDetailList',//导出关键参数核查详情信息
    CheckItemKeyParameter: before + '/KeyParameter/CheckItemKeyParameter',//核查关键参数项
    DeleteKeyParameterItemCheck: before + '/KeyParameter/DeleteKeyParameterItemCheck',//删除核查关键参数项
    SubCheckItem: before + '/KeyParameter/SubCheckItem',//保存或提交核查结果
    DeleteKeyParameterCheck: before + '/KeyParameter/DeleteKeyParameterCheck',//删除核查信息
    IssuedKeyParameter: before + '/KeyParameter/IssuedKeyParameter',//下发核查信息
    RetransmissionKeyParameter: before + '/KeyParameter/RetransmissionKeyParameter',//转发关键参数核查任务单
    /*关键参数核查整改*/
    GetKeyParameterQuestionList: before + '/KeyParameter/GetKeyParameterQuestionList',//获取关键参数核查整改信息
    ExportKeyParameterQuestionList: before + '/KeyParameter/ExportKeyParameterQuestionList',//导出关键参数核查整改信息
    GetKeyParameterQuestionDetailList: before + '/KeyParameter/GetKeyParameterQuestionDetailList',//获取关键参数核查整改详情
    CheckItemKeyParameterQuestion: before + '/KeyParameter/CheckItemKeyParameterQuestion',//关键参数核查整改
    UpdateKeyParameterQuestionStatus: before + '/KeyParameter/UpdateKeyParameterQuestionStatus',//通过或驳回关键参数核查整改
    GetZGCheckList: before + '/KeyParameter/GetZGCheckList',//获取关键参数核查整改信息
    ExportZGCheckList: before + '/KeyParameter/ExportZGCheckList',//导出关键参数核查整改信息
    GetZGCheckInfoList: before + '/KeyParameter/GetZGCheckInfoList',//获取关键参数核查整改详情信息
    UpdZGCouCheck: before + '/KeyParameter/UpdZGCouCheck',//数据一致性核查整改
    UpdZGRangeCheck: before + '/KeyParameter/UpdZGRangeCheck',//量程一致性核查整改
    UpdZGParamCheck: before + '/KeyParameter/UpdZGParamCheck',//参数一致性核查整改
    GetKeyPollutantList: before + '/KeyParameter/GetKeyPollutantList',//获取数据量程一致性核查整改单位信息
    /*** 现场监督核查 ***/
    /*系统设施核查*/
    GetSystemFacilityVerificationList: before + '/SystemFacilityVerification/GetSystemFacilityVerificationList',//获取系统设施核查
    ExportSystemFacilityVerificationList: before + '/SystemFacilityVerification/ExportSystemFacilityVerificationList',//导出系统设施核查
    GetSystemFacilityVerificationInfo: before + '/SystemFacilityVerification/GetSystemFacilityVerificationInfo',//获取单条督查信息
    GetPointSystemInfo: before + '/SystemFacilityVerification/GetPointSystemInfo',//获取运维督查信息单个排口的默认信息
    AddOrUpdateSystemFacilityVerificationInfo: before + '/SystemFacilityVerification/AddOrUpdateSystemFacilityVerificationInfo',//添加修改督查模板
    GetSystemFacilityVerificationDetail: before + '/SystemFacilityVerification/GetSystemFacilityVerificationDetail',//获取运维督查详情
    DeleteSystemFacilityVerificationInfo: before + '/SystemFacilityVerification/DeleteSystemFacilityVerificationInfo',//删除运维督查信息
    PushInspectorOperation: before + '/SystemFacilityVerification/PushInspectorOperation',//问题整改推送
    /*核查模板设置*/
    GetSupervisionQuestionTypeList: before + '/SystemFacilityVerification/GetSupervisionQuestionTypeList',//获取督查类别清单
    GetSupervisionQuestionTypeCodeList: before + '/SystemFacilityVerification/GetSupervisionQuestionTypeCodeList',//获取督查类别
    AddOrUpdateSupervisionQuestionTypeInfo: before + '/SystemFacilityVerification/AddOrUpdateSupervisionQuestionTypeInfo',//添加更新督查类别清单
    DeleteSupervisionQuestionTypeInfo: before + '/SystemFacilityVerification/DeleteSupervisionQuestionTypeInfo',//删除更新督查类别清单
    ChangeSupervisionQuestionTypeStatus: before + '/SystemFacilityVerification/ChangeSupervisionQuestionTypeStatus',//更改更新督查类别清单状态
    GetSupervisionTemplateList: before + '/SystemFacilityVerification/GetSupervisionTemplateList',//获取督查模板信息
    AddOrUpdateSupervisionTemplateInfo: before + '/SystemFacilityVerification/AddOrUpdateSupervisionTemplateInfo',//添加更新督查模板信息
    DeleteSupervisionTemplateInfo: before + '/SystemFacilityVerification/DeleteSupervisionTemplateInfo',//删除更新督查模板信息
    GetSupervisionQuestionTypeDescribeList: before + '/SystemFacilityVerification/GetSupervisionQuestionTypeDescribeList',//获取督查模板类别信息
    ChangeSupervisionTemplateStatus: before + '/SystemFacilityVerification/ChangeSupervisionTemplateStatus',//更改督查模板状态
    GetSupervisionTemplateDetail: before + '/SystemFacilityVerification/GetSupervisionTemplateDetail',//获取督查模板详情
    /*系统设施核查整改*/
    GetInspectorRectificationManageList: before + '/SystemFacilityVerification/GetInspectorRectificationManageList',//获取核查整改信息
    ExportInspectorRectificationManage: before + '/SystemFacilityVerification/ExportInspectorRectificationManage',//导出核查整改信息
    GetInspectorRectificationView: before + '/SystemFacilityVerification/GetInspectorRectificationView',//获取核查整改详情
    UpdateRectificationStatus: before + '/SystemFacilityVerification/UpdateRectificationStatus',//更新核查整改状态
    RejectInspectorRectificationInfo: before + '/SystemFacilityVerification/RejectInspectorRectificationInfo',//核查整改驳回或申述驳回
    AddSetUser: before + '/UserApi/AddSetUser',//设置可以看到督察整改全部信息的人员信息
    GetSetUser: before + '/UserApi/GetSetUser',//获取可以看到督察整改全部信息的人员信息
    /*** 监督核查分析 ***/
    /*督查分析总结*/
    GetSupervisionTypeList: before + '/Supervision/GetSupervisionTypeList', //获取督查总结的督查类别
    GetSupervisionSummaryList: before + '/Supervision/GetSupervisionSummaryList', //获取督查总结信息
    ExportSupervisionSummaryList: before + '/Supervision/ExportSupervisionSummaryList', //导出督查总结信息
    GetInspectorSummaryForRegionList: before + '/Supervision/GetInspectorSummaryForRegionList', //获取督查总结信息（按省统计）
    ExportInspectorSummaryForRegion: before + '/Supervision/ExportInspectorSummaryForRegion', //导出督查总结信息（按省统计）
    GetKeyParameterSummaryList: before + '/Supervision/GetKeyParameterSummaryList', //获取关键参数督查汇总
    ExportKeyParameterSummaryList: before + '/Supervision/ExportKeyParameterSummaryList', //导出关键参数督查汇总
    GetSystemFacilityVerificationSummaryList: before + '/Supervision/GetSystemFacilityVerificationSummaryList', //获取全系统督查汇总信息（点位统计2）
    ExportSystemFacilityVerificationSummaryList: before + '/Supervision/ExportSystemFacilityVerificationSummaryList', //导出全系统督查汇总（点位统计2）
    GetOperationManageSummaryTypeList: before + '/Supervision/GetOperationManageSummaryTypeList', //获取全系统督查汇总信息（问题统计）
    ExportOperationManageSummaryType: before + '/Supervision/ExportOperationManageSummaryType', //导出全系统督查汇总（问题统计）
    GetOperationManageSummaryListNew: before + '/Supervision/GetOperationManageSummaryListNew', //获取全系统督查汇总信息（点位统计1）
    ExportOperationManageSummaryListNew: before + '/Supervision/ExportOperationManageSummaryListNew', //导出全系统督查汇总（点位统计1）
    GetInspectorUserList: before + '/SystemFacilityVerification/GetInspectorUserList', //获取运维人员和督查人员信息
    /*关键参数核查统计*/
    GetKeyParameterAnalyseList: before + '/KeyParameter/GetKeyParameterAnalyseList', //获取关键参数核查统计
    ExportKeyParameterAnalyseList: before + '/KeyParameter/ExportKeyParameterAnalyseList', //导出关键参数核查统计获取
    /*运维督查KPI*/
    GetParamKPIList: before + '/KeyParameter/GetParamKPIList',//获取运维督查KPI
    ExportParamKPIList: before + '/KeyParameter/ExportParamKPIList',//导出运维督查KPI
  },
  /*资产管理 Api */
  AssetManagementApi: {
    /*** 设备台账 ***/
    /*污染源管理*/
    CompanyOperationBasictemplate: `/wwwroot/BaseDataUpload/Report/公司运维基础数据模板.xlsm`,//企业模板下载 
    VerificationImportEntInfo: before + '/EnterpriseApi/VerificationImportEntInfo',//导入企业信息
    ImportEntInfo: before + '/EnterpriseApi/ImportEntInfo',//保存导入企业信息
    GetEnterpriseCorporationCode: before + '/EnterpriseApi/GetEnterpriseCorporationCode', //获取企业厂界信息
    queryPointForTarget: before + '/MonitorPointApi/queryPointForTarget', //根据批量监控目标id获取监测点(删除监控目标用)
    AddPoint: before + '/MonitorPointApi/AddPoint', //添加监测点
    UpdatePoint: before + '/MonitorPointApi/UpdatePoint', //更新监测点
    DeletePoints: before + '/MonitorPointApi/DeletePoints', //删除监测点
    AddOrUpdatePointCoefficientInfo: before + '/MonitorPointApi/AddOrUpdatePointCoefficientInfo',//添加更新监测点系数
    CreateQRCode: before + '/MonitorPointApi/CreateQRCode', //获取企业下各个监测点的二维码信息
    GetPointProjectRelationList: before + '/EnterpriseApi/GetPointProjectRelationList', //获取监测设备运维信息
    ExportPointProjectRelationList: before + '/EnterpriseApi/ExportPointProjectRelationList', //导出监测设备运维信息
    AddOrUpdatePointProjectRelationInfo: before + '/EnterpriseApi/AddOrUpdatePointProjectRelationInfo', //添加更新监测设备运维信息
    DeletePointProjectRelationInfo: before + '/EnterpriseApi/DeletePointProjectRelationInfo', //删除监测设备运维信息
    UpdatePointDGIMN: before + '/MonitorPointApi/UpdatePointDGIMN', //更新MN号
    GetMonitorPointVerificationList: before + '/MonitorPointApi/GetMonitorPointVerificationList', //获取数据核查项码表
    GetMonitorPointVerificationItem: before + '/MonitorPointApi/GetMonitorPointVerificationItem', //获取监测点数据核查信息
    AddPointVerificationItem: before + '/MonitorPointApi/AddPointVerificationItem', //添加更新监测点数据核查项
    GetPointSystemInfo: before + '/MonitorPointApi/GetPointSystemInfo', //获取监测点系统信息
    GetParamInfoList: before + '/MonitorPointApi/GetParamInfoList', //获取设备参数项信息
    GetEquipmentParameterItem: before + '/MonitorPointApi/GetEquipmentParameterItem', //获取设备参数类别信息
    AddPointParamItem: before + '/MonitorPointApi/AddPointParamItem', //添加设备参数信息
    GetPointEquipmentInfo: before + '/MonitorPointApi/GetPointEquipmentInfo', //获取监测点设备信息
    AddOrUpdateSystemEquipmentInfo: before + '/MonitorPointApi/AddOrUpdateSystemEquipmentInfo', //添加更新监测点设备信息
    GetStandardGasEquipmentInfo: before + '/MonitorPointApi/GetStandardGasEquipmentInfo', //获取标气配备信息
    UpdatePointSortInfo: before + '/MonitorPointApi/UpdatePointSortInfo', //监测点排序
    GetTestingEquipmentList: before + '/MonitorPointApi/GetTestingEquipmentList', //获取监测点监测设备类别
    GetPointCoefficientInfo: before + '/MonitorPointApi/GetPointCoefficientInfo', //获取监测点系数
    GetPointElectronicFenceInfo: before + '/MonitorPointApi/GetPointElectronicFenceInfo', //获取电子围栏半径信息
    AddOrUpdatePointElectronicFenceInfo: before + '/MonitorPointApi/AddOrUpdatePointElectronicFenceInfo', //添加更新电子围栏半径信息
    UpdatePointOprationStatus: before + '/MonitorPointApi/UpdatePointOprationStatus', //更新监测点运维状态
    GetOprationStatusList: before + '/UserApi/GetOprationStatusList', //获取更新运维状态记录
    GetEquipmentParametersList: before + '/EquipmentApi/GetEquipmentParametersList', //获取监测参数设备清单信息
    AddOrUpdOperationSignRadiusInfo: before + '/EnterpriseApi/AddOrUpdOperationSignRadiusInfo',//企业设置电子围栏半径
    GetOperationSignRadiusInfo: before + '/EnterpriseApi/GetOperationSignRadiusInfo',//获取企业电子围栏半径
    /*污染源信息查询*/
    GetEntList: before + '/EnterpriseApi/GetEntList', //获取监测点信息
    ExportEntList: before + '/EnterpriseApi/ExportEntList', //导出企业信息 
    GetPointList: before + '/MonitorPointApi/GetPointList', //获取监测点信息
    ExportPointList: before + '/MonitorPointApi/ExportPointList', //导出监测点信息 
    GetPointSystemList: before + '/MonitorPointApi/GetPointSystemList', //获取所有排口下系统型号
    ExportPointSystemList: before + '/MonitorPointApi/ExportPointSystemList', //导出所有排口下系统型号
    GetPointEquipmentList: before + '/MonitorPointApi/GetPointEquipmentList',//获取设备信息
    ExportPointEquipmentList: before + '/MonitorPointApi/ExportPointEquipmentList',//导出设备信息 
    GetPointVerificationItemList: before + '/MonitorPointApi/GetPointVerificationItemList',//获取数据核查项信息
    ExportPointVerificationItemList: before + '/MonitorPointApi/ExportPointVerificationItemList',//数据核查项信息 导出
    GetPointEquipmentParametersList: before + '/MonitorPointApi/GetPointEquipmentParametersList',//获取设备参数项信息
    ExportPointEquipmentParametersList: before + '/MonitorPointApi/ExportPointEquipmentParametersList',//设备参数项信息 导出
    /*项目管理*/
    GetProjectList: before + '/ProjectApi/GetProjectList',//获取项目管理
    AddOrUpdateProjectInfo: before + '/ProjectApi/AddOrUpdateProjectInfo',//添加修改项目管理信息 
    DeleteProjectInfo: before + '/ProjectApi/DeleteProjectInfo',//删除项目管理信息
    GetProjectPointList: before + '/ProjectApi/GetProjectPointList',//获取运维监测点信息
    ExportProjectList: before + '/ProjectApi/ExportProjectList',//导出项目管理 
    ExportProjectPointList: before + '/ProjectApi/ExportProjectPointList',//导出运维监测点信息 
    GetSellerCompanyList: before + '/ProjectApi/GetSellerCompanyList',// 获取卖房公司信息
    AddOrUpdSellerCompany: before + '/ProjectApi/AddOrUpdSellerCompany',// 添加卖房公司信息
    DelSellerCompany: before + '/ProjectApi/DelSellerCompany',// 删除卖房公司信息
    /*项目权限管理*/
    GetAccessibleProjectList: before + '/ProjectApi/GetAccessibleProjectList',//获取项目权限信息
    GetInaccessibleProjectList: before + '/ProjectApi/GetInaccessibleProjectList',//获取当前人员未分配的项目权限
    AddAccessibleProjectInfo: before + '/ProjectApi/AddAccessibleProjectInfo',//分配项目权限
    DeleteAccessibleProjectInfo: before + '/ProjectApi/DeleteAccessibleProjectInfo',//删除项目权限
    /*设备厂家名录*/
    GetEquipmentManufacturerList: before + '/EquipmentApi/GetEquipmentManufacturerList',//获取设备厂家信息
    AddEquipmentManufacturerInfo: before + '/EquipmentApi/AddEquipmentManufacturerInfo',//添加设备厂家信息
    UpdateEquipmentManufacturerInfo: before + '/EquipmentApi/UpdateEquipmentManufacturerInfo',//更新设备厂家信息
    DeleteEquipmentManufacturerInfo: before + '/EquipmentApi/DeleteEquipmentManufacturerInfo',//删除设备厂家信息
    ExportEquipmentManufacturerList: before + '/EquipmentApi/ExportEquipmentManufacturerList',//设备厂家信息 导出
    /*系统型号清单*/
    GetSystemModelList: before + '/EquipmentApi/GetSystemModelList',//获取系统型号信息
    AddSystemModelInfo: before + '/EquipmentApi/AddSystemModelInfo',//添加系统型号信息
    UpdateSystemModelInfo: before + '/EquipmentApi/UpdateSystemModelInfo',//更新系统型号信息
    DeleteSystemModelInfo: before + '/EquipmentApi/DeleteSystemModelInfo',//删除系统型号信息
    GetSystemNameList: before + '/EquipmentApi/GetSystemNameList',//获取系统名称列表
    ExportSystemModelList: before + '/EquipmentApi/ExportSystemModelList',//导出系统型号信息
    /*设备信息清单*/
    GetEquipmentList: before + '/EquipmentApi/GetEquipmentList',//获取设备信息清单
    AddEquipmentInfo: before + '/EquipmentApi/AddEquipmentInfo',//添加设备信息清单
    UpdateEquipmentInfo: before + '/EquipmentApi/UpdateEquipmentInfo',//更新信息清单
    DeleteEquipmentInfo: before + '/EquipmentApi/DeleteEquipmentInfo',//删除设备信息清单
    GetMonitoringCategoryList: before + '/EquipmentApi/GetMonitoringCategoryList',//获取设备监测类型
    ExportEquipmentList: before + '/EquipmentApi/ExportEquipmentList',//导出设备信息清单 
    /*故障单元清单*/
    GetFaultUnitList: before + '/AccountApi/GetFaultUnitList',//获取故障单元清单
    AddFaultUnitInfo: before + '/AccountApi/AddFaultUnitInfo',//添加故障单元清单
    UpdateFaultUnitInfo: before + '/AccountApi/UpdateFaultUnitInfo',//更新故障单元清单
    DeleteFaultUnitInfo: before + '/AccountApi/DeleteFaultUnitInfo',//删除故障单元清单
    /*点位匹配设置*/
    GetStateControlledPointRelationList: before + '/StateControlled/GetStateControlledPointRelationList',//获取点位匹配信息
    ExportStateControlledPointRelationList: before + '/StateControlled/ExportStateControlledPointRelationList',//点位匹配信息 导出
    GetStateControlledEntList: before + '/StateControlled/GetStateControlledEntList',//匹配企业
    GetStateControlledPointList: before + '/StateControlled/GetStateControlledPointList',//获取企业匹配监测点信息
    UpdateStateControlledPointRelationStatus: before + '/StateControlled/UpdateStateControlledPointRelationStatus',//更新企业匹配监测点信息
    DeleteStateControlledPointRelationStatus: before + '/StateControlled/DeleteStateControlledPointRelationStatus',//删除企业匹配监测点信息
    /*台账填报设置*/
    GetCalibrationAccountFillingTypeList: before + '/AccountApi/GetCalibrationAccountFillingTypeList',//获取台账填报设置信息
    UpdateCalibrationAccountFillingTypeInfo: before + '/AccountApi/UpdateCalibrationAccountFillingTypeInfo',//更新废气点位校准信息填报方式
    ExportCalibrationAccountFillingTypeList: before + '/AccountApi/ExportCalibrationAccountFillingTypeList',//台账填报设置信息 导出

    /*** 运维台账 ***/
    /*运维技术资料库*/
    DeleteOperationSysTable: before + '/AccountApi/DeleteOperationSysTable',//删除运维技术资料库信息
    /*运维上岗证*/
    GetMaintainersWorkLicenseList: before + '/AccountApi/GetMaintainersWorkLicenseList',//获取运维上岗证信息
    DeleteMaintainersWorkLicenseInfo: before + '/AccountApi/DeleteMaintainersWorkLicenseInfo',//删除运维上岗证信息
    /*原始数据包*/
    GetOriginalData: before + '/MonBasicDataApi/GetOriginalData',//获取原始数据包信息
    /*定时器管理*/
    GetOnlineTimerManageList: before + '/OnlineTimerManage/GetOnlineTimerManageList',//获取定时器信息
    AddOnlineTimerManage: before + '/OnlineTimerManage/AddOnlineTimerManage',//添加定时器信息
    EditOnlineTimerManage: before + '/OnlineTimerManage/EditOnlineTimerManage',//更新定时器信息
    DelOnlineTimerManage: before + '/OnlineTimerManage/DelOnlineTimerManage',//删除定时器信息
    /*新老协议转换管理*/
    GetAgreementTransferList: before + '/OnlineTimerManage/GetAgreementTransferList',//获取新老协议转换信息
    AddAgreementTransfer: before + '/OnlineTimerManage/AddAgreementTransfer',//添加新老协议转换信息
    DeleteAgreementTransfer: before + '/OnlineTimerManage/DeleteAgreementTransfer',//删除新老协议转换信息
    /*交接和报告*/
    GetProjectReportList: before + '/ProjectApi/GetProjectReportList', //获取交接和报告信息
    ExportProjectReportList: before + '/ProjectApi/ExportProjectReportList', //导出交接和报告信息
    AddOrUpdProjectReportInfo: before + '/ProjectApi/AddOrUpdProjectReportInfo',//添加更新交接和报告信息
    /*省区经理管理*/
    GetProvinceManagerList: before + '/SystemFacilityVerification/GetProvinceManagerList',//获取省区经理信息
    AddorUpdateProvinceManager: before + '/SystemFacilityVerification/AddorUpdateProvinceManager',//添加更新省区经理信息
    DeleteProvinceManager: before + '/SystemFacilityVerification/DeleteProvinceManager',//删除省区经理信息
    GetProvinceManagerByID: before + '/SystemFacilityVerification/GetProvinceManagerByID',//获取省区经理详情信息

    /*** 备件耗材 ***/
    /*备品备件编码*/
    GetSparepartList: before + '/ConsumablesApi/GetSparepartList',//获取备品备件编码
    UpdateSparePartsInfo: before + '/ConsumablesApi/UpdateSparePartsInfo',//更新备品备件编码
    DeleteSparePartsInfo: before + '/ConsumablesApi/DeleteSparePartsInfo',//删除备品备件编码
    ImportSparePartsList: before + '/ConsumablesApi/ImportSparePartsList',//导入备品备件编码
    DownLoadSparePartsTemplateInfo: before + '/ConsumablesApi/DownLoadSparePartsTemplateInfo',//下载备品备件编码模板
    /*标准气体编码 试剂信息编码*/
    GetReferenceMaterialsList: before + '/ConsumablesApi/GetReferenceMaterialsList',//获取标准气体编码、试剂信息编码
    AddReferenceMaterialsInfo: before + '/ConsumablesApi/AddReferenceMaterialsInfo',//添加标准气体编码、试剂信息编码
    UpdateReferenceMaterialsInfo: before + '/ConsumablesApi/UpdateReferenceMaterialsInfo',//更新标准气体编码、试剂信息编码
    DeleteReferenceMaterialsInfo: before + '/ConsumablesApi/DeleteReferenceMaterialsInfo',//删除标准气体编码、试剂信息编码

    /*** 客户订单 ***/
    /*客户续费*/
    GetCustomerRenewList: before + '/CustomerRenew/GetCustomerRenewList',//获取客户续费信息
    AddCustomerRenewInfo: before + '/CustomerRenew/AddCustomerRenewInfo',//添加客户续费信息
    UpdateCustomerRenewInfo: before + '/CustomerRenew/UpdateCustomerRenewInfo',//更新客户续费信息
    DeleteCustomerRenewInfo: before + '/CustomerRenew/DeleteCustomerRenewInfo',//删除客户续费信息
    GetCustomerPointAuthorityList: before + '/CustomerRenew/GetCustomerPointAuthorityList',//获取客户订单企业与排口信息
    GetCustomerList: before + '/CustomerRenew/GetCustomerList',//获取客户续费用户信息
    GetCustomerRenewDetail: before + '/CustomerRenew/GetCustomerRenewDetail',//获取客户续费详情信息
    DeleteCustomerRenewDetail: before + '/CustomerRenew/DeleteCustomerRenewDetail',//删除客户续费详情信息
    /*续费日志 */
    GetCustomerRenewOperationLogs: before + '/CustomerRenew/GetCustomerRenewOperationLogs',//获取客户订单日志和客户订单详情日志信息
    /*** 权限管理 ***/
    /*用户管理*/
    GetUserList: before + '/UserApi/GetUserList',//获取用户信息
    ExportUserList: before + '/UserApi/ExportUserList',//导出用户信息
    ResetPwd: before + '/LoginApi/ResetPwd',//重置用户密码
    ResetUserWechatInfo: before + '/UserApi/ResetUserWechatInfo',//重置用户微信注册信息
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
    GetUserPointAuthorizeList: before + '/AuthorizeApi/GetUserPointAuthorizeList',//查询当前部门下的所有排口（公司运维）
    GetUserPointAuthorizeListBW: before + '/AuthorizeApi/GetUserPointAuthorizeListBW',//查询当前部门下的所有排口（宝武）
    GetDepartInfoByID: before + '/DepartmentApi/GetDepartInfoByID',//获取单个部门信息
    GetDepartTreeAndObj: before + '/DepartmentApi/GetDepartTreeAndObj',//获取部门树信息（带根节点）
    GetGroupRegionFilter: before + '/ConfigureApi/GetGroupRegionFilter',//获取部门区域过滤
    GetAllUser: before + '/UserApi/GetAllUser',//获取所有用户
    GetUserByDepID: before + '/DepartmentApi/GetUserByDepID',//获取当前部门的用户
    InsertDepartByUser: before + '/DepartmentApi/InsertDepartByUser',//给当前部门添加用户（可批量）
    GetAlarmPushDepOrRole: before + '/AuthorizeApi/GetAlarmPushDepOrRole',//获取部门或角色报警关联列表
    InsertAlarmDepOrRole: before + '/AuthorizeApi/InsertAlarmDepOrRole',//设置部门或角色报警关联
    InsertRegionByUser: before + '/DepartmentApi/InsertRegionByUser',//当前部门添加行政区(可批量)
    GetRegionByDepID: before + '/DepartmentApi/GetRegionByDepID',//获取当前部门的行政区
    GetTestRegionByDepID: before + '/DepartmentApi/GetTestRegionByDepID',//获取当前部门成套区域过滤权限
    UpdateOperationArea: before + '/DepartmentApi/UpdateOperationArea',//更新当前部门运维区域
    InsertTestRegionByUser: before + '/DepartmentApi/InsertTestRegionByUser',//设置当前部门成套区域过滤权限
    GetSetOperationGroup: before + '/DepartmentApi/GetSetOperationGroup',//获取设置运维小组信息
    AddSetOperationGroup: before + '/DepartmentApi/AddSetOperationGroup',//设置运维小组
    GroupSort: before + '/DepartmentApi/GroupSort',//部门排序

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
    GetSetLongInAppRoleId: before + '/RoleApi/GetSetLongInAppRoleId',//获取允许登录的APP角色信息
    AddSetLongInAppRole: before + '/RoleApi/AddSetLongInAppRole',//设置允许登录的APP角色
    GetSetRoleId: before + '/RoleApi/GetSetRoleId',//获取行政区获取点位角色信息
    AddSetRole: before + '/RoleApi/AddSetRole',//设置行政区获取点位角色
    /*用户权限*/
    InsertPointFilterByUser: before + '/AuthorizeApi/InsertPointFilterByUser',//给当前人员添加排口权限（可批量）
    /*用户恢复*/
    RecoveryUserInfo: before + '/UserApi/RecoveryUserInfo',//恢复用户信息
    /*** 基础设置 ***/
    /*合同变更设置*/
    GetOperationUserList: before + '/UserApi/GetOperationUserList',//获取合同变更运维人信息
    UpdateOperationUser: before + '/UserApi/UpdateOperationUser',//更新合同变更运维人信息
    DeleteOperationUser: before + '/UserApi/DeleteOperationUser',//删除合同变更运维人信息
  },
  //绩效排名
  PerformanceApi: {
    /*工作总量绩效 个人工作绩效*/
    GetPersonalPerformanceList: before + '/AchievementsApi/GetPersonalPerformanceList',  //获取绩效汇总
    ExportPersonalPerformanceList: before + '/AchievementsApi/ExportPersonalPerformanceList',  //导出绩效汇总
    GetPersonalPerformanceDetail: before + '/AchievementsApi/GetPersonalPerformanceDetail', //获取个人分摊套数明细
    ExportPersonalPerformanceDetail: before + '/AchievementsApi/ExportPersonalPerformanceDetail', //导出个人分摊套数明细
    GetPersonalPerformanceWorkOrderList: before + '/AchievementsApi/GetPersonalPerformanceWorkOrderList',//获取个人工单信息
    ExportPersonalPerformanceWorkOrderList: before + '/AchievementsApi/ExportPersonalPerformanceWorkOrderList',//导出个人工单信息
    GetPersonalPerformanceRateInfoList: before + '/AchievementsApi/GetPersonalPerformanceRateInfoList',//获取绩效明细信息
    ExportPersonalPerformanceRateInfo: before + '/AchievementsApi/ExportPersonalPerformanceRateInfo',//导出绩效明细信息
    /*工作质量积分*/
    GetOperationIntegralGroupList: before + '/AchievementsApi/GetOperationIntegralGroupList',//获取积分汇总信息
    GetOperationIntegralGroupInfoList: before + '/AchievementsApi/GetOperationIntegralGroupInfoList',//获取积分汇总详情信息
    GetOperationIntegralList: before + '/AchievementsApi/GetOperationIntegralList',//获取积分明细信息
    GetOperationIntegralInfoList: before + '/AchievementsApi/GetOperationIntegralInfoList',//获取积分明细详情信息
    GetOperationIntegralInfoViewList: before + '/AchievementsApi/GetOperationIntegralInfoViewList',//获取积分明细员工考核加减分详情
    UpdatePersonalPerformanceRateInfo: before + '/AchievementsApi/UpdatePersonalPerformanceRateInfo',//更新工作总量绩效
    ImportOperationIntegral: before + '/AchievementsApi/ImportOperationIntegral',//导入积分明细信息
    /*工单系数清单*/
    GetWorkOrderTypeCoefficientList: before + '/PerformanceCoefficientApi/GetWorkOrderTypeCoefficientList',//获取工单系数信息
    AddOrUpdateWorkOrderTypeCoefficientList: before + '/PerformanceCoefficientApi/AddOrUpdateWorkOrderTypeCoefficientList',//添加更新工单系数
    DeleteWorkOrderTypeCoefficientList: before + '/PerformanceCoefficientApi/DeleteWorkOrderTypeCoefficientList',//删除更新工单系数
    GeteTaskOrderTypeByPollutantType: before + '/OperationWorkbenchApi/GeteTaskOrderTypeByPollutantType', // 根据污染物类型获取表单类型
    /*点位系数清单*/
    GetPointCoefficientList: before + '/PerformanceCoefficientApi/GetPointCoefficientList',//获取监测点系数信息
    ExportPointCoefficientList: before + '/PerformanceCoefficientApi/ExportPointCoefficientList',//导出监测点系数信息
    AddOrUpdatePointCoefficientInfo: before + '/PerformanceCoefficientApi/AddOrUpdatePointCoefficientInfo',//添加更新监测点系数
    /*现场签到统计*/
    GetSignInList: before + '/OperationSignInApi/GetSignInList',//获取现场签到统计信息
    ExportSignInList: before + '/OperationSignInApi/ExportSignInList',//现场签到统计信息 导出
    GetSignInType: before + '/OperationSignInApi/GetSignInType',//获取打卡类型
  },

  // 系统管理Api
  SystemManageApi: {
    /*公告管理*/
    GetNoticeList: before + '/NoticeApi/GetNoticeList', //获取公告管理信息
    AddOrUpdateNoticeInfo: before + '/NoticeApi/AddOrUpdateNoticeInfo', //添加修改公告
    DeleteNoticeInfo: before + '/NoticeApi/DeleteNoticeInfo', //删除公告
    GetAllRoleList: before + '/NoticeApi/GetAllRoleList', //获取角色
    /*资源中心*/
    GetQuestionList: before + '/HelpCenterApi/GetQuestionList', //获取问题清单信息
    AddOrUpdateQuestionInfo: before + '/HelpCenterApi/AddOrUpdateQuestionInfo', //获取问题清单信息
    DeleteQuestionInfo: before + '/HelpCenterApi/DeleteQuestionInfo', //删除问题清单信息
    GetQuestionTypeList: before + '/HelpCenterApi/GetQuestionTypeList', //获取问题清单类别
    GetQuestionType: before + '/HelpCenterApi/GetQuestionType', //获取问题类别
    /*视频管理*/
    IsTrueSerialNumber: before + '/VideoApi/IsTrueSerialNumber', //判断摄像头摄像头序列号是否正确
    AddCameraMonitor: before + '/VideoApi/AddCameraMonitor', //添加摄像头与监测点关系
    DeleteCamera: before + '/VideoApi/DeleteCamera',//删除摄像头
    DeleteVideoInfo: before + '/VideoApi/DeleteVideoInfo',//删除视频信息
    AddVideoInfo: before + '/VideoApi/AddVideoInfo',//根据监测点添加视频信息
    UpdateVideoInfo: before + '/VideoApi/UpdateVideoInfo',//更新视频信息
    /*日志管理*/
    GetSystemExceptionList: before + '/LogsApi/GetSystemExceptionList', //获取问题清单列表
    DeleteSystemException: before + '/LogsApi/DeleteSystemException', //获取问题清单列表
    GetSystemLongInLogs: before + '/LogsApi/GetSystemLongInLogs', //获取问题清单列表
    DeleteSystemLongInLogs: before + '/LogsApi/DeleteSystemLongInLogs', //获取问题清单列表
    GetUserOprationLogsList: before + '/LogsApi/GetUserOprationLogsList', //获取问题清单列表
    DeleteUserOprationLogs: before + '/LogsApi/DeleteUserOprationLogs', //获取问题清单列表
    /*运维基础配置*/
    GetOperationSetting: before + '/ConfigureApi/GetOperationSetting', //获取运维基础配置信息
    UpdOperationSetting: before + '/ConfigureApi/UpdOperationSetting', //设置运维基础配置
  },


  /*********** 成套 ***********/

  //通用 Api
  CtCommonApi: {
    GetEntAndPointList: before + '/CTBaseDataApi/GetEntAndPointList', //站点信息
    GetTestPollutantList: before + '/DebuggingBase/GetTestPollutantList', //站点信息
  },
  //项目执行进度 Api

  /*** 项目执行 ***/
  /*派单查询*/
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
    GetCTServiceDispatchRateList : before + '/CTBaseDataApi/GetCTServiceDispatchRateList ',  //获取成套派单完成率信息
    ExportCTServiceDispatchRateList: before + '/CTBaseDataApi/ExportCTServiceDispatchRateList',  //成套派单完成率 导出
 
  /*现场签到统计*/
    GetSignInAnalysis: before + '/CTStatisticsApi/GetSignInAnalysis',//获取现场签到统计信息
    ExportSignInAnalysis: before + '/CTStatisticsApi/ExportSignInAnalysis',//现场签到统计信息 导出
    GetSignInAnalysisInfo: before + '/CTStatisticsApi/GetSignInAnalysisInfo',//获取现场签到统计详情信息
    ExportSignInAnalysisInfo: before + '/CTStatisticsApi/ExportSignInAnalysisInfo',//现场签到统计详情信息 导出
  },
  //调试服务
  CtDebugServiceApi: {
    /*调试点位管理*/
    GetTestXuRegions: before + '/DebuggingBase/GetTestXuRegions',//获取省份及省份下的市县（调试服务）
    GetPointCemsSystemList: before + '/DebuggingBase/GetPointCemsSystemList',  //获取监测点CEMS参数信息
    OperationPointCemsSystemInfo: before + '/DebuggingBase/OperationPointCemsSystemInfo',  //添加更新CEMS参数信息
    GetPointReferenceInstrumentList: before + '/DebuggingBase/GetPointReferenceInstrumentList', //获取参比仪器信息
    OperationPointReferenceInstrumentInfo: before + '/DebuggingBase/OperationPointReferenceInstrumentInfo', //添加更新参比仪器信息
    AddOrUpdateTestPoint: before + '/DebuggingBase/AddOrUpdateTestPoint', //添加更新监测点（调试检测）
    /*72小时调试检测*/
    GetDebuggingEntTree: before + '/DebuggingBase/GetDebuggingEntTree', //获取企业监测点信息 树结构
    Get72HoursDebuggingItem: before + '/CommissioningTest/Get72HoursDebuggingItem', //获取表单类型
    Get72TestRecordPollutant: before + '/CommissioningTest/Get72TestRecordPollutant', //获取表单污染物信息
    UsePMReferenceTimes: before + '/CommissioningTest/UsePMReferenceTimes',//获取参比方法校准颗粒物CEMS采样时间信息
    //颗粒物CEMS零点和量程漂移检测
    GetPMDriftInfo: before + '/CommissioningTest/GetPMDriftInfo',//获取录入信息
    AddOrUpdatePMDriftInfo: before + '/CommissioningTest/AddOrUpdatePMDriftInfo',//添加更新信息
    DeletePMDriftInfo: before + '/CommissioningTest/DeletePMDriftInfo',//删除信息
    // 参比方法校准颗粒物CEMS
    GetReferenceCalibrationPMInfo: before + '/CommissioningTest/GetReferenceCalibrationPMInfo', //获取颗粒物参比参数信息
    AddOrUpdateReferenceCalibrationPMInfo: before + '/CommissioningTest/AddOrUpdateReferenceCalibrationPMInfo', //添加更新颗粒物参比信息
    DeleteReferenceCalibrationPMInfo: before + '/CommissioningTest/DeleteReferenceCalibrationPMInfo', //删除颗粒物参比信息
    ImportData: before + '/CommissioningTest/ImportData', //导入数据
    //参比方法评估气态污染物CEMS（含氧量）准确度
    GetGasReferenceMethodAccuracyInfo: before + '/CommissioningTest/GetGasReferenceMethodAccuracyInfo',//获取录入信息
    AddReferenceMethodCemsAccuracyTime: before + '/CommissioningTest/AddReferenceMethodCemsAccuracyTime',//初始添加信息
    AddOrUpdateReferenceMethodCemsAccuracyInfo: before + '/CommissioningTest/AddOrUpdateReferenceMethodCemsAccuracyInfo',//添加更新信息
    DeleteGasReferenceMethodAccuracyInfo: before + '/CommissioningTest/DeleteGasReferenceMethodAccuracyInfo',//删除信息
    GetTimesListByPollutant: before + '/CommissioningTest/GetTimesListByPollutant', //根据污染物获取时间
    ImportDataNew: before + '/CommissioningTest/ImportDataNew', //导入数据
    //气态污染物CEMS示值误差和系统响应时间检测
    GetGasIndicationErrorResponseTimeInfo: before + '/CommissioningTest/GetGasIndicationErrorResponseTimeInfo',//获取录入信息
    AddOrUpdateGasIndicationErrorResponseTimeInfo: before + '/CommissioningTest/AddOrUpdateGasIndicationErrorResponseTimeInfo',//添加更新信息
    DeleteGasIndicationErrorResponseTimeInfo: before + '/CommissioningTest/DeleteGasIndicationErrorResponseTimeInfo',//删除信息
    //速度场系数检测表单
    GetVelocityFieldCoefficientInfo: before + '/CommissioningTest/GetVelocityFieldCoefficientInfo',//获取录入信息
    AddOrUpdateVelocityFieldCoefficientInfo: before + '/CommissioningTest/AddOrUpdateVelocityFieldCoefficientInfo',//添加更新信息
    DeleteVelocityFieldCoefficientInfo: before + '/CommissioningTest/DeleteVelocityFieldCoefficientInfo',//删除信息
    //温度CMS准确度检测表单
    GetTemperatureAccuracyInfo: before + '/CommissioningTest/GetTemperatureAccuracyInfo',//获取录入信息
    AddOrUpdateTemperatureAccuracyInfo: before + '/CommissioningTest/AddOrUpdateTemperatureAccuracyInfo',//添加更新信息
    DeleteTemperatureAccuracyInfo: before + '/CommissioningTest/DeleteTemperatureAccuracyInfo',//删除信息
    //湿度CMS准确度检测表单
    GetHumidityAccuracyInfo: before + '/CommissioningTest/GetHumidityAccuracyInfo',//获取录入信息
    AddOrUpdateHumidityAccuracyInfo: before + '/CommissioningTest/AddOrUpdateHumidityAccuracyInfo',//添加更新信息
    DeleteHumidityAccuracyInfo: before + '/CommissioningTest/DeleteHumidityAccuracyInfo',//删除信息
    //气态污染物CEMS（含氧量）零点和量程漂移检测
    GetGasDriftInfo: before + '/CommissioningTest/GetGasDriftInfo',//获取录入信息
    AddOrUpdateGasDriftInfo: before + '/CommissioningTest/AddOrUpdateGasDriftInfo',//添加更新信息
    DeleteGasDriftInfo: before + '/CommissioningTest/DeleteGasDriftInfo',//删除信息
    //生成检测报告
    Export72HoursCommissioningTestReport: before + '/CommissioningTest/Export72HoursCommissioningTestReport',//导出72小时调试检测报告 word
    Export72HoursCommissioningTestPdfReport: '/api/rest/PollutantSourceApi/TaskFormApi/ImportRecord',//导出72小时调试检测报告 pdf
    /*区域权限管理*/
    GetDebuggingAreaGroupList: before + '/DebuggingAreaAuthority/GetDebuggingAreaGroupList',//获取部门详细信息及层级关系
    AddOrUpdateDebuggingAreaGroupInfo: before + '/DebuggingAreaAuthority/AddOrUpdateDebuggingAreaGroupInfo',//添加部门信息
    DeleteDebuggingAreaGroupInfo: before + '/DebuggingAreaAuthority/DeleteDebuggingAreaGroupInfo',//删除部门信息
    GetDebuggingAreaUserList: before + '/DebuggingAreaAuthority/GetDebuggingAreaUserList',//获取当前部门的用户
    OperationDebuggingAreaUserInfo: before + '/DebuggingAreaAuthority/OperationDebuggingAreaUserInfo',//给当前部门分配用户
  },
  //资产管理 Api
  CtAssetManagementApi: {
    /*** 设备台账 ***/
    /*污染源管理*/
    GetTestXuRegions: before + '/CTBaseDataApi/GetTestXuRegions', //获取省份及省份下的市县（成套污染源管理）
    AddOrEditCommonPointList: before + '/CTBaseDataApi/AddOrEditCommonPointList', //添加或修改监测点（成套）
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
    ExportCTProjectList: before + '/CTBaseDataApi/ExportCTProjectList',  //项目列表 导出
    UpdateCTProject: before + '/CTBaseDataApi/UpdateCTProject', //修改项目信息
    GetrojectPointRelationList: before + '/CTBaseDataApi/GetrojectPointRelationList',//获取项目与站点管理关系
    AddProjectPointRelation: before + '/CTBaseDataApi/AddProjectPointRelation',//添加项目与站点关联关系
    AddProjectEntRelation: before + '/CTBaseDataApi/AddProjectEntRelation',//添加项目与企业关联关系
    /*设备厂家名录 */
    GetEquipmentManufacturerInventory: before + '/DebuggingEquipment/GetEquipmentManufacturerInventory',  //获取设备厂商信息
    AddEquipmentManufacturerInfo: before + '/DebuggingEquipment/AddEquipmentManufacturerInfo',  //添加设备厂商信息
    UpdateEquipmentManufacturerInfo: before + '/DebuggingEquipment/UpdateEquipmentManufacturerInfo',  //更新设备厂商信息
    DeleteEquipmentManufacturerInfo: before + '/DebuggingEquipment/DeleteEquipmentManufacturerInfo',  //删除设备厂商信息
    /*系统型号清单*/
    GetCemsSystemModelInventory: before + '/DebuggingEquipment/GetCemsSystemModelInventory',  //获取系统型号清单信息
    AddCemsSystemModelInfo: before + '/DebuggingEquipment/AddCemsSystemModelInfo',  //添加系统型号清单信息
    UpdCemsSystemModelInfo: before + '/DebuggingEquipment/UpdCemsSystemModelInfo',  //更新系统型号清单信息
    DeleteCemsSystemModelInfo: before + '/DebuggingEquipment/DeleteCemsSystemModelInfo',  //删除系统型号清单信息
    /*设备信息清单*/
    GetCemsEquipmentInventory: before + '/DebuggingEquipment/GetCemsEquipmentInventory',  //获取设备信息清单
    AddCemsEquipmentInfo: before + '/DebuggingEquipment/AddCemsEquipmentInfo', //添加设备信息清单信息
    UpdCemsEquipmentInfo: before + '/DebuggingEquipment/UpdCemsEquipmentInfo', //更新设备信息清单信息
    DeleteCemsEquipmentInfo: before + '/DebuggingEquipment/DeleteCemsEquipmentInfo', //删除设备信息清单信息
    /*参比仪器清单*/
    GetReferenceInstrumentInventory: before + '/DebuggingEquipment/GetReferenceInstrumentInventory',  //获取参比仪器设备清单
    AddReferenceInstrumentInfo: before + '/DebuggingEquipment/AddReferenceInstrumentInfo',  //添加参比仪器设备清单
    UpdReferenceInstrumentInfo: before + '/DebuggingEquipment/UpdReferenceInstrumentInfo',  //更新参比仪器设备清单
    DeleteReferenceInstrumentInfo: before + '/DebuggingEquipment/DeleteReferenceInstrumentInfo',  //删除参比仪器设备清单
  },
};

