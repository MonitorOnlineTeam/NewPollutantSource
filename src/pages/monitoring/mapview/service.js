import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

// 获取所有企业及排口信息
export async function getAllEntAndPoint(params) {
  const result = await post(API.commonApi.GetEntAndPoint, {
    ...params,
    PollutantTypes: sessionStorage.getItem('sysPollutantCodes') || params.PollutantTypes
  }, null);
  return result;
}

// 获取所有企业
export async function getAllEnterprise(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEntList', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取企业和排口信息
export async function getEntAndPointList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPointListByEntCode', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取所有污染物
export async function getPollutantList(params) {
  const result = await post(API.commonApi.GetPollutantTypeCode, params);
  return result;
}

// 获取气泡表格数据
export async function getPointTableData(params) {
  const result = await post(API.MonitorDataApi.AllTypeSummaryList, params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取气泡图表数据
export async function getPointChartData(params) {
  const result = await post(API.MonitorDataApi.GetAllTypeDataList, params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取监测点infoWindow数据
export async function getInfoWindowData(params) {
  const result = await post(API.MonitorDataApi.AllTypeSummaryList, params, null);
  return result;
}