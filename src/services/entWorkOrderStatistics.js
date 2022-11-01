import { post, get } from '@/utils/request';
import { API } from '@config/API'

// 获取关注程度
export async function getAttentionDegreeList(params) {
  const result = post(API.commonApi.GetAttentionDegreeList, params);
  return result;
}

// 根据行政区查询企业
export async function getEntByRegion(params) {
  const result = post(API.RegionApi.GetEntByRegion, params);
  return result;
}

// 获取table title数据 - 全省
export async function getTableTitleData(params) {
  const result = get(`/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStaticTitle`, params, null);
  return result;
}

// 获取table数据 - 全省
export async function getTableDataSource(params) {
  const result = post(`/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStatic`, params);
  return result;
}

// 导出数据 - 全省
export async function exportReport(params) {
  const result = post(
    API.StatisticAnalysisApi.ExportExceptionAlarmRateListForRegion,
    params,
  );
  return result;
}

// 获取table数据 - 二级页面 行政区
export async function getSecondTableTitleData(params) {
  const result = get(`/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStatic4RegionTitle`, params, null);
  return result;
}

// 获取table数据 - 二级页面 行政区
export async function getSecondTableDataSource(params) {
  const result = post(`/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStatic4Region`, params);
  return result;
}

// 导出数据 - 二级页面 行政区
export async function exportSecond(params) {
  const result = post(
    API.ExportApi.ExportExceptionAlarmRateListForPoint,
    params,
  );
  return result;
}

// 获取table数据 - 三级页面 企业
export async function getThirdTableTitleData(params) {
  const result = get(`/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStatic4EnterpriseTitle`, params, null);
  return result;
}

// 获取table数据 - 三级页面 企业
export async function getThirdTableDataSource(params) {
  const result = post(`/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStatic4Enterprise`, params);
  return result;
}

// 导出数据 - 三级页面 企业
export async function exportThird(params) {

  const result = post(API.ExportApi.ExportExceptionAlarmRateListForPoint, params);
  return result;
}

// 获取table数据 - 四级页面 站点
export async function getFourTableTitleData(params) {
  const result = get(`/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStatic4PointTitle`, params, null);
  return result;
}

// 获取table数据 - 四级页面 站点
export async function getFourTableDataSource(params) {
  const result = post(`/api/rest/PollutantSourceApi/TaskFormApi/GetTaskStatic4Point`, params);
  return result;
}

// 导出数据 - 四级页面 站点
export async function exportFour(params) {
  const result = post(API.ExportApi.ExportExceptionAlarmRateListForPoint, params);
  return result;
}



