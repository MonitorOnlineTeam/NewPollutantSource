import { post } from '@/utils/request';
import { API } from '@config/API'

/**
 * 传输有效率 行政区下
 *
 */
export async function GetTransmissionEfficiencyForRegion(params) {
  const result = post(
    API.StatisticAnalysisApi.GetTransmissionEfficiencyForRegion,
    params,
    null,
  );

  return result;
}

//传输有效率  排口

export async function GetTransmissionEfficiencyForPoint(params) {
  const result = post(
    API.StatisticAnalysisApi.GetTransmissionEfficiencyForPoint,
    params,
    null,
  );

  return result;
}
//传输有效率  企业

export async function GetTransmissionEfficiencyForEnt(params) {
  const result = post(
    API.StatisticAnalysisApi.GetTransmissionEfficiencyForEnt,
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

//行政区导出

export async function ExportTransmissionEfficiencyForRegion(params) {
  const result = post(
    API.ExportApi.ExportTransmissionEfficiencyForRegion,
    params,
    null,
  );

  return result;
}

//企业导出

export async function ExportTransmissionEfficiencyForEnt(params) {
  const result = post(
    API.ExportApi.ExportTransmissionEfficiencyForEnt,
    params,
    null,
  );

  return result;
}

//年度考核企业列表

export async function GetAnnualAssessmentEntList(params) {
  const result = post(
    API.BaseDataApi.GetAnnualAssessmentEntList,
    params,
  );

  return result;
}

//导出年度考核企业列表

export async function ExportAnnualAssessmentEnt(params) {
  const result = post(
    API.ExportApi.ExportAnnualAssessmentEnt,
    params,
    null,
  );

  return result;
}

//删除年度考核企业列表
export async function DeleteAnnualAssessmentEntByID(params) {
  const result = post(
    API.BaseDataApi.DeleteAnnualAssessmentEntByID,
    params,
    null,
  );

  return result;
}

//添加年度考核企业列表

export async function AddAnnualAssessmentEnt(params) {
  const result = post(
    API.BaseDataApi.AddAnnualAssessmentEnt,
    params,
    null,
  );

  return result;
}

//待选年度考核企业列表

export async function GetAnnualAssessmentEntAndPoint(params) {
  const result = post(
    API.BaseDataApi.GetAnnualAssessmentEntAndPoint,
    params,
    null,
  );

  return result;
}
