import { post } from '@/utils/request';

// 获取数据获取率 - 详情污染物数据
export async function getDataGainRateDetailPollutantList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantListByDgimn', params, null);
  return result;
}

// 获取数据
export async function getAllTypeDataForFlag(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetAllTypeDataForFlag', params, null);
  return result;
}

// 修改数据标识
export async function updateDataFlag(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/UpdateDataFlag', params, null);
  return result;
}



