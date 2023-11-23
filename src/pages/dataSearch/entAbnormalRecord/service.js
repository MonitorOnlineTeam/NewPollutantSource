import { post } from '@/utils/request';
import { API } from '@config/API'
/**
 * 企业异常记录 列表
 *
 */
export async function GetExceptionReportedList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/ExceptionApi/GetExceptionReportedList',
    params,
    null,
  );

  return result;
}
//异常记录详情
export async function GetExceptionReportedView(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/ExceptionApi/GetExceptionReportedView',
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
    API.CommonApi.GetAttentionDegreeList,
    params,
    null,
  );

  return result;
}

//导出

export async function ExportExceptionReported(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/ExceptionApi/ExportExceptionReported',
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