import { post } from '@/utils/request';
import { API } from '@config/API'

/**
 * 排放标准
 *
 */
export async function GetDischargeStandValue(params) {
  const result = post(API.BaseDataApi.GetDischargeStandValue, params);
  return result;
}


//关注列表
export async function GetAttentionDegreeList(params) {
  const result = post(API.commonApi.GetAttentionDegreeList, params);
  return result;
}

//导出  标准
export async function ExportDischargeStandValue(params) {
  const result = post(API.ExportApi.ExportDischargeStandValue, params);
  return result;
}



//根据行政区获取 企业列表

export async function GetEntByRegion(params) {
  const result = post(API.RegionApi.GetEntByRegion, params);
  return result;
}