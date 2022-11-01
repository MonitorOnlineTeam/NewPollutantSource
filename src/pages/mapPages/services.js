import { post, get } from '@/utils/request';
import { API } from '@config/API'

// 获取所有监测点
export async function getAllPoint(params) {
  const result = await post(API.PointApi.GetViewPoint, params);
  return result;
}

// 获取所有污染物
export async function getPollutantList(params) {
  const result = await post(API.commonApi.GetPollutantTypeCode, params);
  return result;
}

// 获取气泡表格数据
export async function getPointTableData(params) {
  const result = await post(API.MonitorDataApi.AllTypeSummaryList, params, null);
  return result;
}

// 获取气泡图表数据
export async function getPointChartData(params) {
  const result = await post(API.MonitorDataApi.GetAllTypeDataList, params, null);
  return result;
}

// 获取监测点infoWindow数据
export async function getInfoWindowData(params) {
  const result = await post(API.MonitorDataApi.AllTypeSummaryList, params, null);
  return result;
}

// 获取企业排放量数据
export async function getEntEmissionsData(params) {
  const result = await post(API.StatisticAnalysisApi.GetEmissionsListForUnitTime, params, null);
  return result;
}

// 获取特征污染物数据
export async function getFeaturesPolList(params) {
  const result = await post(API.StatisticAnalysisApi.GetFeaturesPolEmissionsList, params, null);
  return result;
}

// 多媒体会议树
export async function getTreeListByConfig(params) {
  const result = await get('/api/rest/PollutantSourceApi/BaseDataApi/GetTreeListByConfig', params, null);
  return result;
}

