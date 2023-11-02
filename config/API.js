export const before = '/newApi/rest/PollutantSourceApi';
export const API = {
  //
  systemApi: {

  },
  autoFormApi: {

  },
  // 通用Api
  commonApi: {


    //
  },
  UploadApi: {

  },
  PollutantApi: {

  },
  LoginApi: {

  },
  // 行政区
  RegionApi: {

  },
  // BaseDataApi
  BaseDataApi: {

  },

  // 首页Api
  HomeApi: {

  },


  /*异常数据模型分析 Api */
  AbnormalModelAnalysisApi: {
    //异常精准识别核实率
    //行政区 列表
    GetModelWarningCheckedForRegion: before + '/Warning/GetModelWarningCheckedForRegion',
    //市 列表
    GetModelWarningCheckedForCity: before + '/Warning/GetModelWarningCheckedForCity',
    //企业 列表
    GetModelWarningCheckedForEnt: before + '/Warning/GetModelWarningCheckedForEnt',
    //监测点 列表
    GetModelWarningCheckedForPoint: before + '/Warning/GetModelWarningCheckedForPoint',
    //行政区 导出
    ExportWarningCheckedForRegion: before + '/Warning/ExportModelWarningCheckedForRegion',
    //市 导出
    ExportModelWarningCheckedForCity: before + '/Warning/ExportModelWarningCheckedForCity',
    //企业 导出
    ExportModelWarningCheckedForEnt: before + '/Warning/ExportModelWarningCheckedForEnt',
  },

  /*监督核查 Api */
  SupervisionVerificaApi: {
    //关键参数核查统计
    //列表
    GetKeyParameterAnalyseList: before + '/CTBaseDataApi/GetKeyParameterAnalyseList',
    //导出
    ExportKeyParameterAnalyseList: before + '/CTBaseDataApi/ExportKeyParameterAnalyseList'

  },
  /*资产管理 Api */
  AssetManagementApi: {
    //交接和报告
    //列表
    GetProjectReportList: before + '/CTBaseDataApi/GetProjectReportList',
    //编辑
    AddOrUpdProjectReportInfo: before + '/CTBaseDataApi/AddOrUpdProjectReportInfo',
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
