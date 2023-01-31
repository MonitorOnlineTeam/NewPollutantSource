
import { post, get } from '@/utils/request';
import { API } from '@config/API'

// 获取缺省值码表
export async function getCO2EnergyType(params) {
  const result = await post(API.CO2EmissionsApi.GetCO2EnergyType, params, null);
  return result;
}
// 获取水泥排放量汇总
export async function getCementCO2Sum(params) {
  const result = await post(API.CO2EmissionsApi.GetCO2CementSumData, params, null);
  return result;
}

// 计算排放量
export async function countEmissions(params) {
  const result = await post(API.CO2EmissionsApi.CalGHGData, params, null);
  return result;
}

// 下载导入模板
export async function downloadTemp(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportGHGRepTemp', params, null);
  return result;
}

// 获取排放量合计
export async function getCO2TableSum(params) {
  const result = await post(API.CO2EmissionsApi.GetCO2TableSum, params, null);
  return result;
}

// 获取水泥排放量
export async function getSteelCO2Sum(params) {
  const result = await post(API.CO2EmissionsApi.GetCO2SteelSumData, params, null);
  return result;
}

// 判断是否重复 - 是否可添加
export async function JudgeIsRepeat(params) {
  const result = await post(API.CO2EmissionsApi.JudgeIsRepeat, params, null);
  return result;
}

// 获取不确定性默认值
export async function getUnceratianData(params) {
  const result = await post(API.CO2EmissionsApi.GetUnceratianData, params, null);
  return result;
}

// 获取不确定性默认值
export async function calUnceratianData(params) {
  const result = await post(API.CO2EmissionsApi.CalUnceratianData, params);
  return result;
}

// 获取机组列表数据
export async function getUnitList(params) {
  const result = await post(API.CO2EmissionsApi.GetCrewInfo, params);
  return result;
}
// 获取所有企业
export async function getAllEnterprise(params) {
  const result = await post(API.RegionApi.GetEntByRegion, params, null);
  return result;
}
// 获取监测数据对比分析
export async function getComparisonOfMonData(params) {
  const result = await post(API.CO2EmissionsApi.GetComparisonOfMonData, params, null);
  return result;
}
// 获取监测数据对比分析
export async function getCO2LinearAnalysisOther(params) {
  const result = await post(API.CO2EmissionsApi.GetCO2LinearAnalysisOther, params, null);
  return result;
}
