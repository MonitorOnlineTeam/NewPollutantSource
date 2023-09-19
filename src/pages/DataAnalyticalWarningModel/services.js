import { post } from '@/utils/request';

// 获取模型列表
export async function GetModelList(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Mold/GetMoldList', params);
  return result;
}

// 获取报警记录
export async function GetWarningList(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/GetWarningList', params);
  return result;
}

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

// 模型开启、管理
export async function SetMoldStatus(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Mold/SetMoldStatus', params);
  return result;
}

// 获取点位参数配置
export async function GetPointParamsRange(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/GetPointParamsRange', params);
  return result;
}

// 保存点位参数配置
export async function SavePointParamsRange(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/SavePointParamsRange', params);
  return result;
}

// 获取模型基础信息和参数配置
export async function GetModelInfoAndParams(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/GetModelInfoAndParams',
    params,
  );
  return result;
}

// 保存模型基础信息和参数配置
export async function SaveModelInfoAndParams(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/SaveModelInfoAndParams',
    params,
  );
  return result;
}

// 获取已关联排口
export async function GetModelRelationDGIMN(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/GetModelRelationDGIMN',
    params,
  );
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

// 获取报警数据
export async function GetAllTypeDataListForModel(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/GetAllTypeDataListForModel',
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

// 获取直方图数据
export async function StatisPolValueNumsByDGIMN(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/StatisPolValueNumsByDGIMN',
    params,
  );
  return result;
}

// 获取相关系数图表数据
export async function StatisLinearCoefficient(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/StatisLinearCoefficient',
    params,
  );
  return result;
}

// 根据企业获取排口
export async function getPointByEntCode(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetNoFilterPointByEntCode',
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

// 根据企业获取排口
export async function GetNoFilterPointByEntCode(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetNoFilterPointByEntCode',
    params,
  );
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

// 重新生成正常范围
export async function RegenerateNomalRangeTime(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/RegenerateNomalRangeTime',
    params,
  );
  return result;
}
