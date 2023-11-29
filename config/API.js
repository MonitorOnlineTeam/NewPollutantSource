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
  },
  //通用Api
  CommonApi: {
    GetNoFilterRegionList: before + '/RegionApi/GetNoFilterRegionList',//获取无权限过滤的行政区信息
    GetXuRegions: before + '/RegionApi/GetXuRegions',//获取所有省份及省份下的市县
    GetRegions: before + '/RegionApi/GetRegions', //获取行政区
    GetAttentionDegreeList: before + '/RegionApi/GetAttentionDegreeList',   //获取关注程度
    GetEntByRegion: before + '/EnterpriseApi/GetEntByRegion',//根据行政区查询企业
    GetEntAndPoint: before + '/EnterpriseApi/GetEntAndPoint',//获取企业和企业对应的排口信息
    GetPointByEntCode: before + '/MonitorPointApi/GetPointByEntCode',//根据企业编号与污染物编号查询排口
    GetPollutantTypeList: before + '/MonitorPollutantApi/GetPollutantTypeList',//获取系统污染物类型信息
    GetStandardPollutantsByDgimn: before + '/StandardLibraryApi/GetStandardPollutantsByDgimn', //根据排口获取标准污染物列表
    GetPollutantTypeMonitoringCategoryInfo: before + '/BaseDataApi/GetPollutantTypeMonitoringCategoryInfo',//获取设备信息监测参数类型
    GeteTaskOrderTypeByPollutantType:before + '/OperationWorkbenchApi/GeteTaskOrderTypeByPollutantType', //通过表单类型
  },
  // 可视化看板Api 首页
  VisualKanbanApi: {
    GetVisualDashBoardOperatePointInfo: before + '/VisualDashBoardApi/GetVisualDashBoardOperatePointInfo',//获取运维信息总览信息
    GetOperationTaskStatisticsInfo: before + '/VisualDashBoardApi/GetOperationTaskStatisticsInfo',//获取近30日运维工单统计
    GetPlanOperationTaskCompleteRate:before + '/VisualDashBoardApi/GetPlanOperationTaskCompleteRate',//获取计划巡检完成率、校准完成率
    GetOperationCompleteRateRank:before + '/VisualDashBoardApi/GetOperationCompleteRateRank',//获取近30日运维排名信息
    GetSceneSignExceptionRate:before + '/VisualDashBoardApi/GetSceneSignExceptionRate',//获取现场打卡异常率
    GetVisualDashBoardEffectiveTransmissionRate:before + '/VisualDashBoardApi/GetVisualDashBoardEffectiveTransmissionRate',//有效传输率
    GetExceptionDataOverview:before + '/VisualDashBoardApi/GetExceptionDataOverview',//获取异常数据总览  获取超标报警核实率、异常报警响应率、缺失报警响应率、报警响应超时率.
    GetVisualDashBoardConsumablesStatisticsInfo:before + '/VisualDashBoardApi/GetVisualDashBoardConsumablesStatisticsInfo',//获取耗材统计信息
    GetConsumablesStatisticsInfo:before + '/VisualDashBoardApi/GetConsumablesStatisticsInfo',//获取耗材统计信息 详情
    ExportConsumablesStatisticsInfo:before + '/VisualDashBoardApi/ExportConsumablesStatisticsInfo',//导出耗材统计信息 详情
    GetEquipmentExceptionsOverview:before + '/VisualDashBoardApi/GetEquipmentExceptionsOverview',//获取设备异常总览 设备异常率、设备故障率、设备故障修复率
    GetMapPointList:before + '/VisualDashBoardApi/GetMapPointList',//获取地图数据
    GetOperatePointList:before + '/VisualDashBoardApi/GetOperatePointList',//获取运维信息总览 详情运维企业、监测点信息
    ExportOperatePointList:before + '/VisualDashBoardApi/ExportOperatePointList',//导出运维信息总览 详情运维企业、监测点信息
    GetOperationPlanTaskList: before + '/VisualDashBoardApi/GetOperationPlanTaskList',// 获取近30日运维工单统计 详情
    ExportOperationPlanTaskList: before + '/VisualDashBoardApi/ExportOperationPlanTaskList',// 导出近30日运维工单统计 详情
    GetProviceNetworkingRate: before + '/VisualDashBoardApi/GetProviceNetworkingRate',// 获取省实时联网率
    GetCityNetworkingRate: before + '/VisualDashBoardApi/GetProviceNetworkingRate',// 获取市实时联网率
    GetPointNetworkingRate: before + '/VisualDashBoardApi/GetPointNetworkingRate',// 获取点位实时联网率
    ExportroviceNetworkingRate: before + '/VisualDashBoardApi/ExportProviceNetworkingRate',// 导出省实时联网率
    ExportCityNetworkingRate: before + '/VisualDashBoardApi/ExportProviceNetworkingRate',// 导出市实时联网率
    ExportPointNetworkingRate: before + '/VisualDashBoardApi/ExportPointNetworkingRate',// 导出点位实时联网率
  },

  // 系统管理Api
  SystemManageApi: {
    /*公告管理*/
    GetNoticeList: before + '/NoticeApi/GetNoticeList', //获取公告管理信息
    AddOrUpdateNoticeInfo: before + '/NoticeApi/AddOrUpdateNoticeInfo', //添加修改公告
    DeleteNoticeInfo: before + '/NoticeApi/DeleteNoticeInfo', //删除公告
    GetAllRoleList: before + '/NoticeApi/GetAllRoleList', //获取角色
   /*资源中心*/
    GetQuestionList: before + '/NoticeApi/GetQuestionList', //获取问题清单列表
    AddOrUpdateQuestionInfo: before + '/NoticeApi/AddOrUpdateQuestionInfo', //获取问题清单列表
    GetQuestionTypeList: before + '/BaseDataApi/GetQuestionTypeList', //获取问题清单类别
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
    /*关键参数核查统计*/
    GetKeyParameterAnalyseList: before + '/CTBaseDataApi/GetKeyParameterAnalyseList', //列表
    ExportKeyParameterAnalyseList: before + '/CTBaseDataApi/ExportKeyParameterAnalyseList' //导出
  },
  /*资产管理 Api */
  AssetManagementApi: {
    /*** 设备台账 ***/

    /*污染源管理*/
    CompanyOperationBasictemplate: '/wwwroot/公司运维基础数据模板.xlsm',//企业模板下载 
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
    GetFaultUnitList: before + '/AssetManagementApi/GetFaultUnitList',//获取故障单元清单
    AddFaultUnitInfo: before + '/AssetManagementApi/AddFaultUnitInfo',//添加故障单元清单
    EditFaultUnit: before + '/AssetManagementApi/EditFaultUnit',//更新故障单元清单
    DeleteFaultUnitInfo: before + '/AssetManagementApi/DeleteFaultUnitInfo',//删除故障单元清单
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
    ResetPwd: before + '/AuthorityApi/ResetPwd',//重置用户密码
    GetRolesTree: before + '/AuthorityApi/GetRolesTree',//获取角色树信息
    GetRolesTreeAndObj: before + '/AuthorityApi/GetRolesTreeAndObj',//获取角色树信息（带根节点）
    GetDepartTreeAndObj: before + '/AuthorityApi/GetDepartTreeAndObj',//获取部门树信息（带根节点）
    GetUserPointAuthorizeList: before + '/AuthorityApi/GetUserPointAuthorizeList',//获取当前部门选择的排口信息
    ExportUserList: before + '/AuthorityApi/ExportUserList',//导出用户信息

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



  /*********** 成套 ***********/

  //通用 Api
  CtCommonApi: {
    GetEntAndPointList: before + '/CTBaseDataApi/GetEntAndPointList', //站点信息
  },
  //项目执行进度 Api
  ProjectExecuProgressApi: {
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
  //资产管理 Api
  CtAssetManagementApi: {
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
  },
};

export const UPLOAD = {};
