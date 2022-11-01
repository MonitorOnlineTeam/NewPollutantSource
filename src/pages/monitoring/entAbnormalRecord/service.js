import { post } from '@/utils/request';
import { API } from '@config/API'

/**
 * 企业异常记录 列表
 *
 */
export async function GetExceptionReportedList(params) {
  const result = post(
    API.MonitorDataApi.GetExceptionReportedList,
    params,
    null,
  );

  return result;
}
//异常记录详情
export async function GetExceptionReportedView(params) {
  const result = post(
    API.StatisticAnalysisApi.GetExceptionReportedView,
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

export async function ExportExceptionReported(params) {
  const result = post(
    API.ExportApi.ExportExceptionReported,
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