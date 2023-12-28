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
  const result = post(API.IntelligentDiagnosisApi.GetExceptionList, {...params,regionLevel:1});
  return result;
}

// 异常数据导出-省一级
export async function exportExceptionList(params) {
  const result = post(API.IntelligentDiagnosisApi.ExportExceptionList, {...params,regionLevel:1});
  return result;
}

// 异常数据查询-城市级别
export async function getExceptionCityList  (params) {
  const result = post(API.IntelligentDiagnosisApi.GetExceptionList, {...params, regionLevel:2});
  return result;
}

// 异常数据导出-城市级别
export async function exportExceptionCityList(params) {
  const result = post(API.IntelligentDiagnosisApi.ExportExceptionList, {...params, regionLevel:2});
  return result;
}
// 异常数据查询 - 二级页面
export async function getExceptionPointList(params) {
  const result = post(API.IntelligentDiagnosisApi.GetExceptionPointList, params);
  return result;
}

// 异常数据导出 - 二级页面
export async function exportExceptionPointList(params) {
  const result = post(API.IntelligentDiagnosisApi.ExportExceptionPointList, params);
  return result;
}

