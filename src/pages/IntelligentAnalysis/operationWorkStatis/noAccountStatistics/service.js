import { post } from '@/utils/request';
import { API } from '@config/API'
/**
 * 无台账工单统计（企业） 列表
 *
 */
export async function GetTaskFormBookSta(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TaskFormApi/GetTaskFormBookSta',
    params,
    null,
  );

  return result;
}
/**
 * 无台账工单统计（企业） 列表  城市级别
 *
 */
export async function GetTaskFormBookStaCityList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TaskFormApi/GetTaskFormBookStaCity',
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

export async function ExportTaskFormBookSta(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TaskFormApi/ExportTaskFormBookSta',
    params,
    null,
  );

  return result;
}
//导出 城市级别

export async function ExportTaskFormBookStaForCity(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TaskFormApi/ExportTaskFormBookStaCity',
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