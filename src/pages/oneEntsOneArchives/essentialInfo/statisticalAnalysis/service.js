/*
 * @Author: Jiaqi 
 * @Date: 2019-10-10 09:39:12 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-10-10 10:02:49
 * @desc: 主页接口api
 */
import { post, get, getNew } from '@/utils/request';

// 获取所有企业及排口信息
export async function getHomePage(params) {
  const result = await post('/api/rest/PollutantSourceApi/HomePageApi/GetHomePage', params, null);
  return result === null ? {
    data: null
  } : result;
}

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

// 获取智能质控数据 - 运行分析 获取企业or监测点信息
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
  const result = post("/api/rest/PollutantSourceApi/HomePageApi/GetOverAndWarningData", params, null);
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

// 超标汇总
export async function getMounthOverData(params) {
  const result = post('/api/rest/PollutantSourceApi/HomePageApi/GetMounthOverData', params, null);
  return result === null ? {
      data: null
  } : result;
}

// 排污税 - 所有企业
export async function getAllTax(params) {
  const result = get('/api/rest/PollutantSourceApi/EffluentFeeApi/GetEffluentFeeForAllTargetTotal', params, null);
  return result;
}

// 排污税 - 单个企业
export async function getEntTax(params) {
  const result = get('/api/rest/PollutantSourceApi/EffluentFeeApi/GetEffluentFeeForSingleTargetTotal', params, null);
  return result;
}

// 排污税 - 单个排口
export async function getPointTax(params) {
  const result = get('/api/rest/PollutantSourceApi/EffluentFeeApi/GetEffluentFeeForSinglePointTotal', params, null);
  return result;
}

// 当月超标报警统计
export async function overStandardAlarmStatistics(params) {
  const result = post('/api/rest/PollutantSourceApi/EntRecord/OverStandardAlarmStatistics?' + `entCode=${params.entCode}&dataType=${params.dataType}`, {}, null);
  return result;
}

// 企业属性
export async function getEntDetails(params) {
  const result = post('/api/rest/PollutantSourceApi/EntRecord/GetEntDetails?' + `entCode=${params.entCode}`, {}, null);
  return result;
}

// 排口数量
export async function getStatisticsPoint(params) {
  const result = post('/api/rest/PollutantSourceApi/EntRecord/GetStatisticsPointStatus?' + `entCode=${params.entCode}`, {}, null);
  return result;
}
