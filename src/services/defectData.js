import { post } from '@/utils/request';
import { API } from '@config/API'
/**
 * 缺失数据
 *
 */
export async function GetDefectModel(params) {
  const result = post(
    API.IntelligentDiagnosis.GetMissDataList,
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

export async function ExportGetAlarmDataList(params) {
  const result = post(
    API.IntelligentDiagnosis.ExportMissDataList,
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