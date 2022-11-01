import { post } from '@/utils/request';
import { API } from '@config/API'

/**
 * 缺失数据  响应
 *
 */
export async function GetDefectModel(params) {
  const result = post(
    API.AlarmApi.GetDefectDataSummary,
    params,
    null,
  );

  return result;
}

//缺失数据查询响应率 二级
export async function GetDefectPointDetailRate(params) {
  const result = post(
    API.AlarmApi.GetDefectPointDetailRate,
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
//导出 缺失数据报警
export async function ExportDefectDataSummary(params) {
  const result = post(
    API.ExportApi.ExportDefectDataSummary,
    params,
    null,
  );

  return result;
}
//导出  二级页面

export async function ExportDefectPointDetailRate(params) {
  const result = post(
    API.ExportApi.ExportDefectPointDetailRate,
    params,
    null,
  );

  return result;
}


//根据行政区获取 企业列表

export async function GetEntByRegion(params) {
  const result = post(API.RegionApi.GetEntByRegion, params);
  return result;
}