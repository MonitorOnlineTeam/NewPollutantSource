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
  const result = post('/api/rest/PollutantSourceApi/PHomePage/GetAllMonthEmissionsByPollutant?authorCode=48f3889c-af8d-401f-ada2-c383031af92d', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取智能质控数据
export async function getRateStatisticsByEnt(params) {
  const result = post('/api/rest/PollutantSourceApi/PHomePage/GetRateStatisticsByEnt?authorCode=48f3889c-af8d-401f-ada2-c383031af92d', params, null);
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

// 运维数据
export async function getTaskCount(params) {
  const result = post("/api/rest/PollutantSourceApi/PHomePage/GetTaskCount?authorCode=48f3889c-af8d-401f-ada2-c383031af92d", params, null);
  return result === null ? {
    data: null
  } : result;
}

//运维 - 智能预警
export async function getExceptionProcessing(params) {
  const result = post('/api/rest/PollutantSourceApi/PHomePage/GetExceptionProcessing?authorCode=48f3889c-af8d-401f-ada2-c383031af92d', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 运维 - 异常报警及响应情况
export async function getAlarmAnalysis(params) {
  const result = post('/api/rest/PollutantSourceApi/PHomePage/GetAlarmAnalysis?authorCode=48f3889c-af8d-401f-ada2-c383031af92d', params, null);
  return result === null ? {
      data: null
  } : result;
}