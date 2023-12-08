import { post } from '@/utils/request';
import { API } from '@config/API'
// 获取关注程度
export async function getAttentionDegreeList(params) {
  const result = post(API.CommonApi.GetAttentionDegreeList, params);
  return result;
}
// API.IntelligentDiagnosis.GetProvinceExceptionDataAlaramList
// 获取table数据 - 师一级
export async function getTableDataSource(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/GetExceptionAlarmRateListForRegion`, params);
  return result;
}

// 导出数据 - 师一级
export async function exportReport(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/ExportExceptionAlarmRateListForRegion`, params);
  return result;
}

// 获取table数据 - 城市一级
export async function getExceptionAlarmRateListForCity(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/GetExceptionAlarmRateListForCity`, params);
  return result;
}

// 导出数据 - 城市一级
export async function exportExceptionAlarmRateListForCity(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/ExportExceptionAlarmRateListForCity`, params);
  return result;
}

// 获取table数据 - 二级页面
export async function getSecondTableDataSource(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/GetExceptionAlarmRateListForPoint`, params);
  return result;
}

// 导出数据 - 二级页面
export async function exportSecond(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/ExportExceptionAlarmRateListForPoint`, params);
  return result;
}

// 根据行政区查询企业
export async function getEntByRegion(params) {
  const result = post(API.CommonApi.GetEntByRegion,{regionCode:params.RegionCode},  null)
  return result;
}

