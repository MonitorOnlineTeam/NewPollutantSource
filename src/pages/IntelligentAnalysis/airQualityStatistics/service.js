import { post } from '@/utils/request';

/**
 * 空气质量状况统计 列表
 *
 */
export async function GetCityStationAQI(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/EmissionsApi/GetCityStationAQI',
    params,
    null,
  );

  return result;
}



//空气质量状况 导出

export async function ExportCityStationAQI(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/EmissionsApi/ExportCityStationAQI',
    params,
    null,
  );

  return result;
}


