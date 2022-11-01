import { post } from '@/utils/request';
import { API } from '@config/API'

export async function GetPollutantAQI(params) {
  const result = await post(API.AirDataApi.GetPolRoseMapData, params, null);
  return result === null ? {
    data: null
  } : result;
}

export async function GetRoleData(params) {
  const result = await post(API.AirDataApi.GetRoseMapData, params, null);
  return result === null ? {
    data: null
  } : result;
}

