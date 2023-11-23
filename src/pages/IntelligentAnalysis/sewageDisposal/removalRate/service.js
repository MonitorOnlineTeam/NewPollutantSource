import { post } from '@/utils/request';
import { API } from '@config/API'
/**
 * 缺失数据
 *
 */
export async function GetSewageHistoryList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/MonDataApi/GetSewageHistoryList',
    params,
    null,
  );

  return result;
}

//关注列表
export async function GetAttentionDegreeList(params) {
  const result = post(
    API.CommonApi.GetAttentionDegreeList,
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
  const result = post(API.CommonApi.GetEntByRegion,{regionCode:params.RegionCode,isSewage:1},  null)
  return result;
}