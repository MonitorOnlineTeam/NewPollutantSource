
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

