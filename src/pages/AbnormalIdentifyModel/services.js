import { post } from '@/utils/request';
import { API } from '@config/API';

// 获取模型列表
export async function GetModelList(params) {
  const result = await post(API.AbnormalIdentifyModel.GetMoldList, params);
  return result;
}

// 模型开启、管理
export async function SetMoldStatus(params) {
  const result = await post(API.AbnormalIdentifyModel.SetMoldStatus, params);
  return result;
}

// 获取模型基础信息和参数配置
export async function GetModelInfoAndParams(params) {
  const result = await post(API.AbnormalIdentifyModel.GetModelInfoAndParams, params);
  return result;
}

// 获取已关联排口
export async function GetModelRelationDGIMN(params) {
  const result = await post(API.AbnormalIdentifyModel.GetModelRelationDGIMN, params);
  return result;
}

// 保存模型基础信息和参数配置
export async function SaveModelInfoAndParams(params) {
  const result = await post(API.AbnormalIdentifyModel.SaveModelInfoAndParams, params);
  return result;
}

// 根据MN获取模型选配数据
export async function GetDataAttributeAndPointList(params) {
  const result = await post(API.AbnormalIdentifyModel.GetDataAttributeAndPointList, params);
  return result;
}

// 添加、关联模型选配
export async function AddDataAttributeAndPoint(params) {
  const result = await post(API.AbnormalIdentifyModel.AddDataAttributeAndPoint, params);
  return result;
}

// 获取报警数据
export async function GetAllTypeDataListForModel(params) {
  const result = await post(API.AbnormalIdentifyModel.GetAllTypeDataListForModel, params);
  return result;
}

// 获取直方图数据
export async function StatisPolValueNumsByDGIMN(params) {
  const result = await post(API.AbnormalIdentifyModel.StatisPolValueNumsByDGIMN, params);
  return result;
}

// 获取点位参数配置
export async function GetPointParamsRange(params) {
  const result = await post(API.AbnormalIdentifyModel.GetPointParamsRange, params);
  return result;
}

// 重新生成正常范围
export async function RegenerateNomalRangeTime(params) {
  const result = await post(API.AbnormalIdentifyModel.RegenerateNomalRangeTime, params);
  return result;
}

// 获取相关系数图表数据
export async function StatisLinearCoefficient(params) {
  const result = await post(API.AbnormalIdentifyModel.StatisLinearCoefficient, params);
  return result;
}

// 历史数据综合评价/统计分析
export async function GetHistoricalDataEvaluation(params) {
  const result = await post(API.AbnormalIdentifyModel.GetHistoricalDataEvaluation, params);
  return result;
}

// 获取数据现象
export async function GetHourDataForPhenomenon(params) {
  const result = await post(API.AbnormalIdentifyModel.GetHourDataForPhenomenon, params);
  return result;
}

// 获取首页地图
export async function GetMapPointList(params) {
  const result = await post(API.AbnormalIdentifyModel.GetMapPointList, params);
  return result;
}

// 获取首页运行分析
export async function GetOperationsAnalysis(params) {
  const result = await post(API.AbnormalIdentifyModel.GetOperationsAnalysis, params);
  return result;
}

// 获取首页排放量统计
export async function GetEmissionStatistics(params) {
  const result = await post(API.AbnormalIdentifyModel.GetEmissionStatistics, params);
  return result;
}

// 获取首页异常线索统计
export async function GetAbnormalClueStatistics(params) {
  const result = await post(API.AbnormalIdentifyModel.GetAbnormalClueStatistics, params);
  return result;
}

// 获取排名
export async function GetSuspectedRanking(params) {
  const result = await post(API.AbnormalIdentifyModel.GetSuspectedRanking, params);
  return result;
}

// 首页 - 数据质量分析
export async function GetDataQualityAnalysis(params) {
  const result = await post(API.AbnormalIdentifyModel.GetDataQualityAnalysis, params);
  return result;
}

// 首页 - 排污缺口
export async function GetPollutantDischargeGapStatistics(params) {
  const result = await post(API.AbnormalIdentifyModel.GetPollutantDischargeGapStatistics, params);
  if (result.Datas) {
    return result;
  } else {
    return {
      ...result,
      Datas: [],
    };
  }
}

// 获取线索列表
export async function GetWarningList(params) {
  const result = await post(API.AbnormalIdentifyModel.GetWarningList, params);
  return result;
}

// 根据企业获取排口
export async function GetNoFilterPointByEntCode(params) {
  const result = await post(API.BaseDataApi.GetNoFilterPointByEntCode, params);
  return result;
}

// // 根据企业获取排口
// export async function getPointByEntCode(params) {
//   const result = await post(API.BaseDataApi.GetNoFilterPointByEntCode, params);
//   return result;
// }

// 获取报警及核实信息（上、下）
export async function GetSingleWarning(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/GetSingleWarning', params);
  return result;
}

// 获取模型快照数据
export async function GetSnapshotData(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/GetSnapshotData?ID=' + params.ID,
    {},
  );
  return result;
}

// 保存点位参数配置
export async function SavePointParamsRange(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/SavePointParamsRange', params);
  return result;
}

// 保存关联排口
export async function SaveModelRelationDGIMN(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/SaveModelRelationDGIMN',
    params,
  );
  return result;
}

// 导出报警数据
export async function ExportHourDataForModel(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/ExportHourDataForModel',
    params,
  );
  return result;
}

// 获取模型精度版本列表
export async function GetEvaluationVersionList(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/GetEvaluationVersionList',
    null,
  );
  return result;
}

// 获取模型精度数据
export async function GetEvaluationList(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/GetEvaluationList', params);
  return result;
}

// 报警统计 - 线索信息统计
export async function StatisAlarmInfo(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/StatisAlarmInfo', params);
  return result;
}

// 报警统计 - 统计核实、异常原因
export async function StatisAlarmInfoCheck(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/StatisAlarmInfoCheck', params);
  return result;
}

// 报警统计 - 核实次数及企业及模型执行率
export async function StatisAlarmInfoRate(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/StatisAlarmInfoRate', params);
  return result;
}

// 报警统计 - 已选择行统计
export async function StatisAlarmInfoSum(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/StatisAlarmInfoSum', params);
  return result;
}

// 线索信息统计
export async function StatisAlarmInfoIndiz(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/StatisAlarmInfoIndiz', params);
  return result;
}

// 获取全企业波动范围
export async function StatisNormalRange(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/StatisNormalRange', params);
  return result;
}

// 全企业波动范围 - 导出
export async function ExportStatisNormalRange(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/ExportStatisNormalRange',
    params,
  );
  return result;
}

// 场景模型分析报告 - 导出
export async function ExportStatisAlarmReport(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/ExportStatisAlarmReport',
    params,
  );
  return result;
}

// 场景模型分析 - 导出
export async function ExportStatisAlarm(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/ExportStatisAlarm', params);
  return result;
}

// 首页 - 数据统计分析
export async function StatisForData(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/StatisForData', params);
  return result;
}

// 首页 - 线索和企业排名
export async function StatisVeriAndEr(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/StatisVeriAndEr', params);
  return result;
}

// 首页 - 线索统计
export async function StatisTipMsg(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/StatisTipMsg', params);
  return result;
}

// 我的待办
export async function GetMyModelExceptionByPManager(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/GetMyModelExceptionByPManager',
    params,
  );
  return result;
}

// 我的已办
export async function GetMyModelException(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/GetMyModelException', params);
  return result;
}

// 复核详情
export async function GetWarningVerifyCheckInfo(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/GetWarningVerifyCheckInfo',
    params,
  );
  return result;
}

// 报警核实
export async function InsertWarningVerify(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/InsertWarningVerify', params);
  return result;
}

// 模型重新运行
export async function onRunModel(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Mold/RunModel', params);
  return result;
}
// 获取模型运行状态
export async function GetModelRunState(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Mold/GetModelRunState?modelGuid=' + params.modelGuid,
    {},
  );
  return result;
}

/**
 * 线索分析
 */
// 获取工作台信息
export async function GetClueDatas(params) {
  const result = await post(API.AbnormalIdentifyModel.GetClueDatas, params);
  return result;
}
// 获取生成核查任务信息
export async function GetWaitCheckDatas(params) {
  const result = await post(API.AbnormalIdentifyModel.GetWaitCheckDatas, params);
  return result;
}
// 获取庄家意见信息
export async function GetPreTakeFlagDatas(params) {
  const result = await post(API.AbnormalIdentifyModel.GetPreTakeFlagDatas, params);
  return result;
}
// 获取已有方案信息
export async function GetPlanDatas(params) {
  const result = await post(API.AbnormalIdentifyModel.GetPlanDatas, params);
  return result;
}
// 获取核查角色
export async function GetCheckRoleDatas(params) {
  const result = await post(API.AbnormalIdentifyModel.GetCheckRoleDatas, params);
  return result;
}

// 生成核查任务
export async function AddPlanTask(params) {
  const result = await post(API.AbnormalIdentifyModel.AddPlanTask, params);
  return result;
}
// 获取待核查任务、已核查任务
export async function GetCheckedList(params) {
  const result = await post(API.AbnormalIdentifyModel.GetCheckedList, params);
  return result;
}

// 获取待核查任务、已核查任务 详情
export async function GetCheckedView(params) {
  const result = await post(API.AbnormalIdentifyModel.GetCheckedView, params);
  return result;
}
// 核查保存或者提交
export async function UpdatePlanItem(params) {
  const result = await post(API.AbnormalIdentifyModel.UpdatePlanItem, params);
  return result;
}
// 核查确认
export async function CheckConfirm(params) {
  const result = await post(API.AbnormalIdentifyModel.CheckConfirm, params);
  return result;
}
/**
 * 历史数据综合评价 
 */
// 排污缺口
export async function GetPollutionDischargeGap(params) {
  const result = await post(API.AbnormalIdentifyModel.GetPollutionDischargeGap, params);
  return result;
}

// 排污缺口 导出
export async function ExportPollutionDischargeGap(params) {
  const result = await post(API.AbnormalIdentifyModel.ExportPollutionDischargeGap, params);
  return result;
}
