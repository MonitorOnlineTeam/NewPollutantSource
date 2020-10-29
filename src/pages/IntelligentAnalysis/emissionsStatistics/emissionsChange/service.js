import { post } from '@/utils/request';

/**
 * 排放量变化趋势 
 *
 */
export async function GetEmissionsTrendList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/EmissionsApi/GetEmissionsTrendList',
    params,
    null,
  );

  return result;
}

// 参数列表
export async function GetEmissionsEntPointPollutant(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/EmissionsApi/GetEmissionsEntPointPollutant',
    params,
    null,
  );

  return result;
}

//关注列表
export async function GetAttentionDegreeList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetAttentionDegreeList',
    params,
    null,
  );

  return result;
}

//导出

export async function ExportSewageHistoryList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/MonDataApi/ExportSewageHistoryList',
    params,
    null,
  );

  return result;
}


//根据行政区获取 污水处理厂

export async function GetEntByRegion(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetEntByRegion?IsSewage=1&RegionCode=' +
      params.RegionCode,
    null,
    null,
  );

  return result;
}