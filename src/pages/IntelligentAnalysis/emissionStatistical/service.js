import { post } from '@/utils/request';
import { API } from '@config/API'

// 获取关注程度
export async function getAttentionDegreeList(params) {
  const result = post(API.commonApi.GetAttentionDegreeList, params);
  return result;
}

// 根据企业类型查询监测因子
export async function getPollutantByType(params) {
  const result = post(`${API.commonApi.GetPollutantByType}?type=${params.type}`, {});
  return result;
}

// 师 - 数据
export async function getRegionTableDataList(params) {
  const result = post(API.StatisticAnalysisApi.GetEmissionsListForRegion, params);
  return result;
}

// 企业 - table数据
export async function getEntTableDataList(params) {
  const result = post(API.StatisticAnalysisApi.GetEmissionsListForEnt, params);
  return result;
}

// 排口 - table数据
export async function getPointTableDataList(params) {
  const result = post(API.StatisticAnalysisApi.GetEmissionsListForPoint, params);
  return result;
}

// 师 - 导出
export async function exportRegionData(params) {
  const result = post(API.ExportApi.ExportEmissionsListForRegion, params);
  return result;
}

// 企业 - 导出
export async function exportEntData(params) {
  const result = post(API.ExportApi.ExportEmissionsListForEnt, params);
  return result;
}

// 排口 - 导出
export async function exportPointData(params) {
  const result = post(API.ExportApi.ExportEmissionsListForPoint, params);
  return result;
}


// 师 - 对比数据
export async function getDataForRegionContrast(params) {
  const result = post(API.StatisticAnalysisApi.GetEmissionsListForRegionComparison, params);
  return result;
}

// 企业 - 对比数据
export async function getDataForEntContrast(params) {
  const result = post(API.StatisticAnalysisApi.GetEmissionsListForEntComparison, params);
  return result;
}

// 排口 - 对比数据
export async function getDataForPointContrast(params) {
  const result = post(API.StatisticAnalysisApi.GetEmissionsListForPointComparison, params);
  return result;
}

// 师 - 对比数据导出
export async function exportRegionContrastData(params) {
  const result = post(API.ExportApi.ExportEmissionsListForRegionComparison, params);
  return result;
}

// 企业 - 对比数据导出
export async function exportEntContrastData(params) {
  const result = post(API.ExportApi.ExportEmissionsListForEntComparison, params);
  return result;
}

// 排口 - 对比数据导出
export async function exportPointContrastData(params) {
  const result = post(API.ExportApi.ExportEmissionsListForPointComparison, params);
  return result;
}

//  废气、废水排放量同比---师一级
export async function getEmissionsListForRegionYear(params) {
  const result = post(API.StatisticAnalysisApi.GetEmissionsListForRegionYear, params);
  return result;
}

//  废气、废水排放量同比---企业一级
export async function getEmissionsListForEntYear(params) {
  const result = post(API.StatisticAnalysisApi.GetEmissionsListForEntYear, params);
  return result;
}

//  废气、废水排放量同比---排口一级
export async function getEmissionsListForPointYear(params) {
  const result = post(API.StatisticAnalysisApi.GetEmissionsListForPointYear, params);
  return result;
}

//  废气、废水排放量环比---师一级
export async function getEmissionsListForRegionChain(params) {
  const result = post(API.StatisticAnalysisApi.GetEmissionsListForRegionChain, params);
  return result;
}

//  废气、废水排放量环比---企业一级
export async function getEmissionsListForEntChain(params) {
  const result = post(API.StatisticAnalysisApi.GetEmissionsListForEntChain, params);
  return result;
}

//  废气、废水排放量环比---排口一级
export async function getEmissionsListForPointChain(params) {
  const result = post(API.StatisticAnalysisApi.GetEmissionsListForPointChain, params);
  return result;
}
