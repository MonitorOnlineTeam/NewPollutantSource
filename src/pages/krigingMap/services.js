import { post, get } from '@/utils/request';
import { API } from '@config/API';

// 获取小时排名 或 7天数据
export async function GetAirRankHour(params) {
  const result = await post(API.AirDataApi.GetAirHourDataRank, params);
  return result;
}
// 获取小时排名 或 7天数据
export async function getMapData(params) {
  const result = await post(API.AirDataApi.GetAirHourDataRank, params);
  return result;
}

// 获取废水排放量
export async function getEmissionsData(params) {
  const result = await post(
    '/rest/PollutantSourceApi/EmissionsApi/GetEmissionsListForEntDay',
    params,
  );
  return result;
}

// 获取废气排放量
export async function getGasData(params) {
  const result = await post(
    '/rest/PollutantSourceApi/EmissionsApi/GetEmissionsListForEnt',
    params,
  );
  return result;
}