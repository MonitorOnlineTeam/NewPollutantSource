import { post } from '@/utils/request';
import { API } from '@config/API'

export async function getRealTimeData(params) {
  const result = await post(API.MonitorDataApi.GetAllTypeDataList, params, null);
  return result;
}

export async function querypollutantlist(params) {
  const result = await post(API.CommonApi.GetPollutantListByDgimn, params, null);
  return result;
}
