import { post } from '@/utils/request';
import { API } from '@config/API'
/**
 * 排放标准
 *
 */


//异常标准
export async function GetExceptionStandValue(params) {
  const result = post(
    API.IntelligentDiagnosis.GetExceptionStandValue,
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



//导出  异常 
export async function ExportExceptionStandValue(params) {
  const result = post(
    API.IntelligentDiagnosis.ExportExceptionStandValue,
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