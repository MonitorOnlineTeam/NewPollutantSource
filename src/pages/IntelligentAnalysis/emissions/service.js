import { post } from '@/utils/request';
import { API } from '@config/API'
// 获取关注程度
export async function getAttentionDegreeList(params) {
  const result = post(API.CommonApi.GetAttentionDegreeList, params);
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


// 师 - 对比数据
export async function getDataForRegionContrast(params) {
  const result = post(`/api/rest/PollutantSourceApi/EmissionsApi/GetEmissionsListForRegionComparison`, params);
  return result;
}

// 企业 - 对比数据
export async function getDataForEntContrast(params) {
  const result = post(`/api/rest/PollutantSourceApi/EmissionsApi/GetEmissionsListForEntComparison`, params);
  return result;
}

// 排口 - 对比数据
export async function getDataForPointContrast(params) {
  const result = post(`/api/rest/PollutantSourceApi/EmissionsApi/GetEmissionsListForPointComparison`, params);
  return result;
}

// 师 - 对比数据导出
export async function exportRegionContrastData(params) {
  const result = post(`/api/rest/PollutantSourceApi/EmissionsApi/ExportEmissionsListForRegionComparison`, params);
  return result;
}

// 企业 - 对比数据导出
export async function exportEntContrastData(params) {
  const result = post(`/api/rest/PollutantSourceApi/EmissionsApi/ExportEmissionsListForEntComparison`, params);
  return result;
}

// 排口 - 对比数据导出
export async function exportPointContrastData(params) {
  const result = post(`/api/rest/PollutantSourceApi/EmissionsApi/ExportEmissionsListForPointComparison`, params);
  return result;
}
