import { post, get, getNew } from '@/utils/request';

// 获取所有企业及排口信息
export async function getAllEntAndPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEntAndPoint', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取排污许可情况数据
export async function GetAllMonthEmissionsByPollutant(params) {
  const result = post('/api/rest/PollutantSourceApi/HomePageApi/GetAllMonthPDPermitByPollutant', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取智能质控数据 - 运行分析
export async function getRateStatisticsByEnt(params) {
  const result = post('/api/rest/PollutantSourceApi/HomePageApi/GetRateStatisticsByEntOrPoint', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 智能监控
export async function getStatisticsPointStatus(params) {
  const result = post('/api/rest/PollutantSourceApi/PWorkbench/GetStatisticsPointStatus?authorCode=48f3889c-af8d-401f-ada2-c383031af92d', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 报警信息
export async function getWarningInfo(params) {
  const result = post("/api/rest/PollutantSourceApi/PWorkbench/GetDataOverAlarmPageList?authorCode=48f3889c-af8d-401f-ada2-c383031af92d", params, null);
  return result === null ? {
    data: null
  } : result;
}

// 运维 - 任务数量统计
export async function getTaskCount(params) {
  const result = post("/api/rest/PollutantSourceApi/HomePageApi/GetTaskStatistics", params, null);
  return result === null ? {
    data: null
  } : result;
}

//运维 - 智能预警
export async function getExceptionProcessing(params) {
  const result = post('/api/rest/PollutantSourceApi/HomePageApi/GetIntelligentEarlyWarning', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 运维 - 异常报警及响应情况
export async function getAlarmAnalysis(params) {
  const result = post('/api/rest/PollutantSourceApi/HomePageApi/GetAlarmAnalysisInfo', params, null);
  return result === null ? {
      data: null
  } : result;
}