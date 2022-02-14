﻿//
//------------------------------------------------------------------------------
// <auto-generated>
//     此代码由T4模板自动生成，且生成的是es6语法，适用于前端
//	   生成时间 2019-01-28 11:22:31 by cg
//     对此文件的轻易更改可能会导致不正确的行为，兄台慎重！！！
//     重新生成代码，这些更改将会丢失。
// </auto-generated>
//------------------------------------------------------------------------------

//报警来源类别
export const EnumPropellingAlarmSourceType = {
  DataException: 0, //数据异常
  DYPARAMETER: 1, //参数异常
  DataOver: 2, //数据超标
  DYSTATEALARM: 3, //状态异常
  DataLogicErr: 4, //逻辑异常
  DataOverWarning: 5, //超标预警
  ExpirationTimeAlarm: 6, //超标预警
  InsufficientMarginAlarm: 7, //超标预警
};

//污染源类型
export const EnumPollutantTypeCode={
  WATER:1, // 废水
  GAS:2, // 废气
  NOISE:3, // 噪声
  AIR:5, // 环境质量
  WATERQUALITY:6, // 水质
  MINISTATION:8, // 小型站
  STENCH:9, // 恶臭
  VOC:10, // voc
  WORKINGCONDITION:11, // 工况
  Dust:12, // 扬尘
  ParticulateMatter:18, // 颗粒物
  CountryControl:23, // 国控
  ProvinceControl:24, // 省控
  CityControl:25, // 市控

};

//码表大类
export const EnumCatogratory={
  MonitorObject:1, //监控对象
  AlarmType:2, //报警类别
  PropellingAlarmSourceType:3, //报警来源类别
  DynamicControlState:4, //动态管控状态
  PointState:5, //点位状态
  LiuliangUnit:8, //流量单位
  PailiangUnit:9, //排量单位
  MonitoringType:16, //监测值类型
  RequstResult:17, //接口调用返回状态
  PsOperationForm:18, //污染源运维表单
  OperationEnum:19, //污染源运维单枚举项
  OperationTaskStatus:21, //运维任务状态
  OperationWorkType:22, //工作类型
  SignIn:23, //打卡签到
  OperationTaskType:24, //任务类型
  OperationPlansStatus:25, //运维计划状态
  OperationTaskFrom:26, //运维任务来源
  OperationEmergencyStatus:27, //运维任务紧急程度状态
  RejectFlag:28, //驳回或撤回
  DataException:29, //报警数据异常
  DYStatusException:30, //报警状态异常
  DYParameterException:31, //报警参数异常
  DataLogicErr:32, //报警数据逻辑异常
  OperationTaskExceptionType:33, //运维任务异常类型
  PropellingNoticeSourceType:34, //通知类别
  SparePartsType:35, //备品备件类型
  PointType:36, //监测点类型
  KBMType:37, //知识库文件类别
  FileClass:38, //文件类别
  EnumPatrolTaskType:39, //运维任务类型

};
//监控对象
export const EnumMonitorObject={
  T_Bas_Enterprise:1, //企业

};
//报警类别
export const EnumAlarmType={
  NoAlarm:0, //无报警
  UpperAlarm:1, //上线报警
  LowerAlarm:2, //下限报警
  AreaAlarm:3, //区间报警

};
// //报警来源类别
// export const EnumPropellingAlarmSourceType={
//   DataException:0, //数据异常
//   DYPARAMETER:1, //参数异常
//   DataOver:2, //数据超标
//   DYSTATEALARM:3, //状态异常
//   DataLogicErr:4, //逻辑异常
//   DataOverWarning:5, //超标预警

// };
//动态管控状态
export const EnumDynamicControlState={

};
//点位状态
export const EnumPointState={
  OffLine:0, //离线
  OnLine:1, //在线
  OverLine:2, //超标
  ExceptLine:3, //异常

};
//流量单位
export const EnumLiuliangUnit={
  LiFangMi:1, // 立方米
  WangLiFangMi:2, //万立方米

};
//排量单位
export const EnumPailiangUnit={
  ug:1, //微克
  mg:2, //毫克
  g:3, //克
  kg:5, //千克
  t:6, //吨

};
//监测值类型
export const EnumMonitoringType={
  OriginalValue:0, //原始值
  CorrectedValue:1, //修正值

};
//接口调用返回状态
export const EnumRequstResult={
  AuthenticationFailure:-1, //身份验证失败
  Fail:0, //失败
  Success:1, //成功
  Exception:2, //发生异常

};
//污染源运维表单
export const EnumPsOperationForm={
  Repair:1, //维修记录表
  RepairWater:12, //维修记录表
  StopMachine:2, //停机记录表
  YhpReplace:3, //易耗品更换记录表
  YhpReplaceWaterWater:14, //易耗品更换记录表 废水
  StandardGasReplace:4, //标准气体更换记录表
  CqfPatrol:5, //完全抽取法CEMS日常巡检记录表
  CyfPatrol:6, //稀释采样法CEMS日常巡检记录表
  ClfPatrol:7, //直接测量法CEMS日常巡检记录表
  CheckRecord:8, //CEMS零点量程漂移与校准记录表
  TestRecord:9, //CEMS校验测试记录
  DataException:10, //CEMS设备数据异常记录表
  Maintain:27, //保养记录表
  SparePartReplace:28, //备品备件更换记录表
  SparePartReplaceWater:20, //备品备件更换记录表 废水
  Fault:58, //故障小时记录表
  FaultWater:59, //故障小时记录表
  FaultYan:60, //故障小时记录表
  ReagentReplace:15, //试剂更换表单
  cooperaInspectionWater:61, //配合检查表单 废水
  cooperaInspection:62, //配合检查表单
  dataConsistencyRealTime:63, //数据一致性核查实时表单
  dataConsistencyRealTimeWater:18, //数据一致性核查实时表单 废水
  dataConsistencyDate:66, //数据一致性核查小时与日数据表单
  dataConsistencyDateWater:74, //数据一致性核查小时与日数据表单 废水
  ThirdPartyTestingData:73,//上月委托第三方检测次数
  ThirdPartyTestingDataWater:65,//上月委托第三方检测次数  废水
  WaterQualityCalibrationRecord:16,//水质校准记录
  StandardSolutionVerificationRecord:70,//标准溶液核查记录表
  DeviceParameterChangeRecord:72,//设备参数变动记录表 废水
  GasDeviceParameterChangeRecord:64,//设备参数变动记录表 废气
  ComparisonTestResultsRecord:19,//实际水样比对试验结果记录表
  EquipmentNameplate:67,//设备铭牌
};
//污染源运维单枚举项
export const EnumOperationEnum={
  RepairRecord:1, //维修记录
  CqfHead:2, //完全抽取法CEMS日常巡检记录表
  CyfHead:3, //稀释采样法CEMS日常巡检记录表
  ClfHead:4, //直接测量法CEMS日常巡检记录表
  SgUnit:5, //标气单位
  YhpUnit:6, //易耗品单位
  CheckItemType:7, //校准项目类型
  BdjcItemType:8, //比对监测项目类型
  BdTestDataRows:9, //比对监测组份数据对数
  RadixPoint:10, //监测运算小数位数
  Analyser:11, //监测项目
  ChildCems:12, //	 烟气监测子系统
  MainInstrumentName:13, //主要仪器名称

};
//运维任务状态
export const EnumOperationTaskStatus={
  WaitFor:1, //待执行
  Underway:2, //进行中
  Completed:3, //已完成
  Auditing:4, //待审核
  Examined:5, //审核通过
  Reject:6, //驳回
  Adjustment:7, //待调整
  Adjusted:8, //已调整
  CheckIn:9, //现场签到

};
//工作类型
export const EnumOperationWorkType={
  Audit:1, //任务审核
  Adjustment:2, //任务调整
  Alarm:3, //报警信息
  Overdue:4, //逾期提醒
  Todo:7, //待办事项
  DataOverWarning:8, //超标预警
  DataOver:9, //超标报警
  DataException:10, //数据异常
  DataOptException:11, //运维异常

};
//打卡签到
export const EnumSignIn={
  CheckIn:1, //签到
  CheckOut:2, //签退

};
//任务类型
export const EnumOperationTaskType={
  ALL:0, //全部
  Routine:1, //例行任务
  Emergency:2, //应急任务
  Alarm:3, //报警消息

};
//运维计划状态
export const EnumOperationPlansStatus={
  ALL:0, //全部
  Established:1, //已制定
  NotEstablished:2, //未制定
  Auditing:3, //待审核
  Examined:4, //审核通过

};
//运维任务来源
export const EnumOperationTaskFrom={
  Manually:1, //手动创建
  AlarmResponse:2, //报警响应
  Distribute:3, //专工派单

};
//运维任务紧急程度状态
export const EnumOperationEmergencyStatus={
  Ordinary:1, //普通
  Commonly:2, //一般
  Urgent:3, //紧急

};
//驳回或撤回
export const EnumRejectFlag={
  Revoke:1, //撤回任务
  Repulse:2, //驳回任务

};
//报警数据异常
export const EnumDataException={
  Zero:1, //零值异常
  OverRun:2, //超限异常
  Series:3, //连续值异常
  DataLoss:4, //数据异常

};
//报警状态异常
export const EnumDYStatusException={
  PowerFailure:1, //电源故障
  CoolerAlarm:2, //制冷器报警
  SamplingPipeline:3, //采样管线故障
  SamplingProbe:4, //采样探头故障
  HumidityAlarm:5, //湿度报警
  AnalyzerFailure:6, //分析仪故障

};
//报警参数异常
export const EnumDYParameterException={
  O2Content:1, //氧气含量
  FlueGasHumidity:2, //烟气湿度
  DifferentialPressure:3, //差压
  FlueGasTemperature:4, //烟气温度
  FlueGasStaticPressure:5, //烟气静压
  ProbeTemperature:6, //探头温度
  PipelineTemperature:7, //管线温度
  CoolerTemperature:8, //制冷器温度

};
//报警数据逻辑异常
export const EnumDataLogicErr={
  Unknown:0, //未知

};
//运维任务异常类型
export const EnumOperationTaskExceptionType={
  SignIn:1, //打卡异常
  AlarmResponse:2, //报警响应异常
  OvertimeWork:3, //工作超时

};
//通知类别
export const EnumPropellingNoticeSourceType={
  TaskComplete:0, //任务完成
  TaskSupervise:1, //任务督办
  TaskDispatch:2, //专工派单通知
  ComponentsReplace:3, //备品备件更换通知
  TaskRevoke:4, //任务撤回
  TaskRepulse:5, //任务打回

};
//备品备件类型
export const EnumSparePartsType={
  Product:1, //易耗品
  Parts:2, //备件

};
//监测点类型
export const EnumPointType={
  auto:1, //自动
  hand:2, //手动

};
//知识库文件类别
export const EnumKBMType={
  specification:1, //规范
  TechnologicalProcess:2, //流程
  Problem:3, //疑难问题
  Other:4, //其它

};
//文件类别
export const EnumFileClass={
  Word:1, //Word
  Excel:2, //Excel
  TXT:3, //TXT
  PDF:4, //PDF
  Other:5, //其它

};
//运维任务类型
export const EnumPatrolTaskType={
  PatrolTask:1, //巡检任务
  ExceptionTask:2, //故障任务

};
