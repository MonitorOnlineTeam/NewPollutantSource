/*
 * @Author: Jiaqi
 * @Date: 2019-10-10 09:39:12
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-02-01 14:37:49
 * @desc: 主页接口api
 */
import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

// 获取所有企业及排口信息
export async function getHomePage(params) {
  const result = await post('/api/rest/PollutantSourceApi/HomePageApi/GetHomePage', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取所有企业及排口信息
export async function getAllEntAndPoint(params) {
  const result = await post(API.commonApi.GetEntAndPoint, params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取排污许可情况数据
export async function GetAllMonthEmissionsByPollutant(params) {
  const result = post(API.HomeApi.GetAllMonthPDPermitByPollutant, params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取智能质控数据 - 运行分析
export async function getRateStatisticsByEnt(params) {
  const result = post(API.HomeApi.GetRateStatisticsByEntOrPoint, params, null);
  return result === null ? {
    data: null
  } : result;
}

// 智能监控
export async function getStatisticsPointStatus(params) {
  const result = post(`${API.HomeApi.GetStatisticsPointStatus}?entCode=${params.entCode ? params.entCode : ''}`, params, null);
  return result === null ? {
    data: null
  } : result;
}

// 报警信息
export async function getWarningInfo(params) {
  const result = post(API.HomeApi.GetOverAndWarningData, params, null);
  return result === null ? {
    data: null
  } : result;
}

// 运维 - 任务数量统计
export async function getTaskCount(params) {
  const result = post(API.HomeApi.GetTaskStatistics, params, null);
  return result === null ? {
    data: null
  } : result;
}

//运维 - 智能预警
export async function getExceptionProcessing(params) {
  const result = post(API.HomeApi.GetIntelligentEarlyWarning, params, null);
  return result === null ? {
    data: null
  } : result;
}

// 运维 - 异常报警及响应情况
export async function getAlarmAnalysis(params) {
  const result = post(API.HomeApi.GetAlarmAnalysisInfo, params, null);
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


// 年度排放量对比分析 - 碳排放
export async function getGHGandEmissionContrast(params) {
  const result = post(API.HomeApi.GetGHGandEmissionContrast, params, null);
  return result;
}

// 年度排放量对比分析 - 华能北京热电厂
export async function GetGHGandEmissionContrastOther(params) {
  const result = post(API.HomeApi.GetGHGandEmissionContrastOther, params, null);
  return result;
}

// 获取首页视频列表
export async function getHomePageVideo(params) {
  const result = post(API.VideoApi.GetHomePageVideo, params, null);
  return result;
}

// 获取所有污染物
export async function GetProcessFlowChartStatus(params) {
  const result = await get(API.DymaicControlApi.GetProcessFlowChartStatus, params, null);
  return result;
}