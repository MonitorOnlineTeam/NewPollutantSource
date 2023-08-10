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
