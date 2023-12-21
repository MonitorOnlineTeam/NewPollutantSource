import { post } from '@/utils/request';
import { API } from '@config/API'
// 获取关注程度
export async function getAttentionDegreeList(params) {
  const result = post(API.CommonApi.GetAttentionDegreeList, params);
  return result;
}

// 根据企业类型查询监测因子
export async function getPollutantByType(params) {
  const result = post(`${API.CommonApi.GetPollutantByType}?type=${params.type}`, {});
  return result;
}

// 获取table数据 - 省一级
export async function getExceptionAlarmListForRegion(params) {
  const result = post(API.IntelligentDiagnosis.GetExceptionAlarmResponseRateList, {...params,regionLevel:1});
  return result;
}

// 异常数据报警-省一级
export async function exportExceptionAlarm(params) {
  const result = post(API.IntelligentDiagnosis.ExportExceptionAlarmResponseRateList, {...params,regionLevel:1});
  return result;
}
// 获取table数据 - 城市一级
export async function getExceptionAlarmListForCity(params) {
  const result = post(API.IntelligentDiagnosis.GetExceptionAlarmResponseRateList, {...params,regionLevel:2});
  return result;
}

// 导出table数据 - 城市一级 
export async function exportExceptionAlarmListForCity(params) {
  const result = post(API.IntelligentDiagnosis.ExportExceptionAlarmResponseRateList, {...params,regionLevel:2});
  return result;
}
// 异常数据报警 - 企业一级
export async function getExceptionAlarmListForEnt(params) {
  const result = post(API.IntelligentDiagnosis.GetExceptionAlarmResponseRateList, {...params,regionLevel:3});
  return result;
}

// 异常数据报警导出 - 企业一级
export async function exportExceptionAlarmListForEnt(params) {
  const result = post(API.IntelligentDiagnosis.ExportExceptionAlarmResponseRateList, {...params,regionLevel:3});
  return result;
}


