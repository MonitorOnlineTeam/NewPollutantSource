import { post } from '@/utils/request';
import { API } from '@config/API'
// 获取关注程度
export async function getAttentionDegreeList(params) {
  const result = post(API.CommonApi.GetAttentionDegreeList, params);
  return result;
}
// 获取table数据 - 省级
export async function getTableDataSource(params) {
  const result = post(API.IntelligentDiagnosis.GetExceptionAlarmResponseRateList, {...params,regionLevel:1});
  return result;
}

// 导出数据 - 省级
export async function exportReport(params) {
  const result = post(API.IntelligentDiagnosis.ExportExceptionAlarmResponseRateList, {...params,regionLevel:1});
  return result;
}

// 获取table数据 - 市级
export async function getExceptionAlarmRateListForCity(params) {
  const result = post(API.IntelligentDiagnosis.GetExceptionAlarmResponseRateList, {...params,regionLevel:2});
  return result;
}

// 导出数据 - 市级
export async function exportExceptionAlarmRateListForCity(params) {
  const result = post(API.IntelligentDiagnosis.ExportExceptionAlarmResponseRateList, {...params,regionLevel:2});
  return result;
}

// 获取table数据 - 企业级
export async function getSecondTableDataSource(params) {
  const result = post(API.IntelligentDiagnosis.GetExceptionAlarmResponseRateList, {...params,regionLevel:3});
  return result;
}

// 导出数据 - 企业级
export async function exportSecond(params) {
  const result = post(API.IntelligentDiagnosis.ExportExceptionAlarmResponseRateList, {...params,regionLevel:3});
  return result;
}

// 根据行政区查询企业
export async function getEntByRegion(params) {
  const result = post(API.CommonApi.GetEntByRegion,{regionCode:params.RegionCode},  null)
  return result;
}

