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
// 异常数据查询-省一级
export async function getExceptionList(params) {
  const result = post(API.IntelligentDiagnosis.GetExceptionList, params);
  return result;
}

// 异常数据导出-省一级
export async function exportExceptionList(params) {
  const result = post(API.IntelligentDiagnosis.ExportExceptionList, params);
  return result;
}

// 异常数据查询-城市级别
export async function getExceptionCityList  (params) {
  const result = post(API.IntelligentDiagnosis.GetExceptionCityList, params);
  return result;
}

// 异常数据导出-城市级别
export async function exportExceptionCityList(params) {
  const result = post(API.IntelligentDiagnosis.ExportExceptionCityList, params);
  return result;
}
// 异常数据查询 - 二级页面
export async function getExceptionPointList(params) {
  const result = post(API.IntelligentDiagnosis.GetExceptionPointList, params);
  return result;
}

// 异常数据导出 - 二级页面
export async function exportExceptionPointList(params) {
  const result = post(API.IntelligentDiagnosis.ExportExceptionPointList, params);
  return result;
}

