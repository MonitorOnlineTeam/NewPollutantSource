import { post } from '@/utils/request';

export async function getRealTimeData(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetAllTypeDataList', params, null);
  return result;
}

export async function querypollutantlist(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantListByDgimn', params, null);
  return result;
}