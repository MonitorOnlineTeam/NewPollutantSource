import { post } from '@/utils/request';
import { API } from '@config/API'
/**
 * 排放标准
 *
 */
export async function GetDischargeStandValue(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetDischargeStandValue',
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

//导出  标准

export async function ExportDischargeStandValue(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/ExportDischargeStandValue',
    params,
    null,
  );

  return result;
}



//根据行政区获取 企业列表

export async function GetEntByRegion(params) {
  const result = post(API.CommonApi.GetEntByRegion,{regionCode:params.RegionCode},  null)
  return result;
}