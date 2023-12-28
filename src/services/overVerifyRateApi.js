import { post } from '@/utils/request';
import { API } from '@config/API'
// 根据企业类型查询监测因子
export async function GetPollutantByType(params) {
  const result = post(API.CommonApi.GetPollutantCodeList, params,null);
  return result;
}

/**
 * 超标核实率列表
 *
 */
export async function GetDefectModel(params) {
  const result = post(
    API.IntelligentDiagnosisApi.GetAlarmVerifyRate,
    params,
    null,
  );

  return result;
}
/**
 * 超标核实率详情
 *
 */
export async function GetDefectPointDetail(params) {
  const result = post(
    API.IntelligentDiagnosisApi.GetAlarmVerifyRateDetail,
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

//导出 报警核实率首页

export async function ExportDefectDataSummary(params) {
  const result = post(
    API.IntelligentDiagnosisApi.ExportAlarmVerifyRate,
    params,
    null,
  );

  return result;
}

//导出 报警核实率  详情
export async function ExportDefectPointDetail(params) {
  const result = post(
    API.IntelligentDiagnosisApi.ExportAlarmVerifyRateDetail,
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