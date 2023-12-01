import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

// 获取所有污染物
export async function getPollutantList(params) {
  const result = await post(API.CommonApi.GetPollutantTypeCode, params, null);
  return result;
}

// 获取所有企业及排口信息
export async function getAllEntAndPoint(params) {
  const result = await post(API.CommonApi.GetEntAndPoint, params, null);
  return result;
}

// 获取监控现状数据
export async function getMonitoringData(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetXJPointState', params, null);
  return result;
}

// 获取运行分析数据
export async function getRunAndAnalysisData(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetXJRunAnalysis', params, null);
  return result;
}

// 运维分析 - 任务统计数据
export async function getTaskStatisticsData(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetXJTaskStatistics', params, null);
  return result;
}

// 运维分析 - 任务分类统计
export async function getOperationAnalysis(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetXJOperationAnalysis', params, null);
  return result;
}

// 报警响应情况
export async function getAlarmResponseData(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetXJAlarmResponse', params, null);
  return result;
}

// 水平衡差数据
export async function getDiffHorizontalData(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetXJHorizontalBalance', params, null);
  return result;
}
// 获取师坐标点
export async function getConstructionCorpsList(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetConstructionCorpsList', params, null);
  return result;
}

// 获服务站坐标点
export async function getOfficeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetOfficeList', params, null);
  return result;
}

// 办事处人员信息
export async function getOfficeUserList(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetOfficeUserList', params, null);
  return result;
}

// 获取办事处备品备件信息
export async function getOfficeStockList(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetOfficeStockList', params, null);
  return result;
}

// 获取监测点infoWindow数据
export async function getInfoWindowData(params) {
  const result = await post(API.WholeProcessMonitorApi.AllTypeSummaryList, params, null);
  return result;
}

// 超标率下钻
export async function getTrippingOverDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetTrippingOverDataList', params, null);
  return result;
}

// 传输有效率下钻
export async function getTransmissionEfficiencyRateDrillDown(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetTrippingOverTransmissionEfficiencyRate', params, null);
  return result;
}

// 运转率下钻
export async function getTrippingOperationRateRate(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetTrippingOperationRateRate', params, null);
  return result;
}

// 获取故障率下钻
export async function getTrippingGetFailureRate(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetTrippingGetFailureRate', params, null);
  return result;
}


// 获取运维分析下钻
export async function getTrippingOperationAnalysis(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetTrippingOperationAnalysis', params, null);
  return result;
}

// 获取任务统计下钻
export async function getTrippingTaskStatistics(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetTrippingTaskStatistics', params, null);
  return result;
}

// 获取报警响应下钻
export async function getTrippingAlarmResponse(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetTrippingAlarmResponse', params, null);
  return result;
}

// 获取级别
export async function getLevel(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetUserRole', params, null);
  return result;
}

// 获取行政区与师的关系
export async function getMonitorRegionDivision(params) {
  const result = await post('/api/rest/PollutantSourceApi/XJHomeApi/GetMonitorRegionDivision', params, null);
  return result;
}

// 获取服务站信息
export async function GetSparePartsStation(params) {
  const result = get('/api/rest/PollutantSourceApi/SparepartManageApi/GetSparePartsStation', params, null);
  return result === null ? {
    data: null
  } : result;
}



