import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//异常精准识别整改率 行政区 列表
export async function getModelWarningCheckedRectificationForRegion(params) {
  const result = post(API.AbnormalModelAnalysisApi.GetModelWarningCheckedRectificationForRegion, params);
  return result;                                   
}
//异常精准识别整改率 市 列表
export async function getModelWarningCheckedRectificationForCity(params) {
  const result = post(API.AbnormalModelAnalysisApi.GetModelWarningCheckedRectificationForCity, params);
  return result;
}
//异常精准识别整改率  企业 列表
export async function getModelWarningCheckedRectificationForEnt(params) {
  const result = post(API.AbnormalModelAnalysisApi.GetModelWarningCheckedRectificationForEnt, params);
  return result;   
}
//异常精准识别整改率 监测点 列表
export async function getModelWarningCheckedRectificationForPoint(params) {
  const result = post(API.AbnormalModelAnalysisApi.GetModelWarningCheckedRectificationForPoint, params);
  return result;
}
//异常精准识别整改率 整改详情
export async function getCheckedRectificationApprovals(params) {
  const result = post(API.AbnormalModelAnalysisApi.GetCheckedRectificationApprovals, params);
  return result;
}
//异常精准识别整改率 行政区 导出
export async function exportModelWarningCheckedRectificationForRegion(params) {
  const result = post(API.AbnormalModelAnalysisApi.ExportModelWarningCheckedRectificationForRegion, params);
  return result;
}
//异常精准识别整改率 市 导出
export async function exportModelWarningCheckedRectificationForCity(params) {
  const result = post(API.AbnormalModelAnalysisApi.ExportModelWarningCheckedRectificationForCity, params);
  return result;
}
//异常精准识别整改率 企业 导出
export async function exportModelWarningCheckedRectificationForEnt(params) {
  const result = post(API.AbnormalModelAnalysisApi.ExportModelWarningCheckedRectificationForEnt, params);
  return result;
}
