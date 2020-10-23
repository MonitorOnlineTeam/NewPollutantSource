import { post } from '@/utils/request';

// 获取关注程度
export async function getAttentionDegreeList(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetAttentionDegreeList', params);
  return result;
}

// 根据企业类型查询监测因子
export async function getPollutantByType(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantByType?type=${params.type}`, {});
  return result;
}

// 师 - 数据
export async function getRegionTableDataList(params) {
  const result = post(`/api/rest/PollutantSourceApi/EmissionsApi/GetEmissionsListForRegion`, params);
  return result;
}

// 企业 - table数据
export async function getEntTableDataList(params) {
  const result = post(`/api/rest/PollutantSourceApi/EmissionsApi/GetEmissionsListForEnt`, params);
  return result;
}

// 排口 - table数据
export async function getPointTableDataList(params) {
  const result = post(`/api/rest/PollutantSourceApi/EmissionsApi/GetEmissionsListForPoint`, params);
  return result;
}

// 师 - 导出
export async function exportRegionData(params) {
  const result = post(`/api/rest/PollutantSourceApi/EmissionsApi/ExportEmissionsListForRegion`, params);
  return result;
}

// 企业 - 导出
export async function exportEntData(params) {
  const result = post(`/api/rest/PollutantSourceApi/EmissionsApi/ExportEmissionsListForEnt`, params);
  return result;
}

// 排口 - 导出
export async function exportPointData(params) {
  const result = post(`/api/rest/PollutantSourceApi/EmissionsApi/ExportEmissionsListForPoint`, params);
  return result;
}
