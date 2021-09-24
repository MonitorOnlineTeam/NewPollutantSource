
import { post, get } from '@/utils/request';

// 获取缺省值码表
export async function getCO2EnergyType(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetCO2EnergyType', params, null);
  return result;
}
