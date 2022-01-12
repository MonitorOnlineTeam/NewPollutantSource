
import { post, get } from '@/utils/request';

// 获取缺省值码表
export async function getCO2EnergyType(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetCO2EnergyType', params, null);
  return result;
}
// 获取水泥排放量汇总
export async function getCementCO2Sum(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetCO2CementSumData', params, null);
  return result;
}

// 计算排放量
export async function countEmissions(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/CalGHGData', params, null);
  return result;
}

// 下载导入模板
export async function downloadTemp(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportGHGRepTemp', params, null);
  return result;
}

// 获取排放量合计
export async function getCO2TableSum(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetCO2TableSum', params, null);
  return result;
}

// 获取水泥排放量
export async function getSteelCO2Sum(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetCO2SteelSumData', params, null);
  return result;
}

// 判断是否重复 - 是否可添加
export async function JudgeIsRepeat(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/JudgeIsRepeat', params, null);
  return result;
}

// 获取不确定性默认值
export async function getUnceratianData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetUnceratianData', params, null);
  return result;
}

// 获取不确定性默认值
export async function calUnceratianData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/CalUnceratianData', params);
  return result;
}
