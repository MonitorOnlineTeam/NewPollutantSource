import { post } from '@/utils/request';
import { API } from '@config/API'

/**
 * 排放量变化趋势 
 *
 */
export async function GetEmissionsTrendList(params) {
  const result = post(
    API.StatisticAnalysisApi.GetEmissionsTrendList,
    params,
    null,
  );

  return result;
}

// 参数列表
export async function GetEmissionsEntPointPollutant(params) {
  const result = post(
    API.StatisticAnalysisApi.GetEmissionsEntPointPollutant,
    params,
    null,
  );

  return result;
}

//关注列表
export async function GetAttentionDegreeList(params) {
  const result = post(API.commonApi.GetAttentionDegreeList, params);
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
  const result = post(API.RegionApi.GetEntByRegion, params);
  return result;
}