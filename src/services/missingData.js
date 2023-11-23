import { post } from '@/utils/request';
import { API } from '@config/API'
/**
 * 缺失数据  响应
 *
 */
export async function GetDefectModel(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetDefectDataSummary',
    params,
    null,
  );

  return result;
}

//缺失数据查询响应率 二级
export async function GetDefectPointDetailRate(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetDefectPointDetailRate',
    params,
    null,
  );

  return result;
}
//缺失数据查询响应 二级
export async function GetDefectPointDetail(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetDefectPointDetail',
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
//导出 缺失数据报警
export async function ExportDefectDataSummary(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/ExportDefectDataSummary',
    params,
    null,
  );

  return result;
}
//导出  二级页面

export async function ExportDefectPointDetailRate(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/ExportDefectPointDetailRate',
    params,
    null,
  );

  return result;
}
//导出 缺失数据报警响应  详情
export async function ExportDefectPointDetail(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/ExportDefectPointDetail',
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