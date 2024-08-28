import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//异常精准识别整改率 行政区 列表
export async function getModelWarningCheckedRectificationForRegion(params) {
  const result = post(API.AbnormalIdentifyModel.GetModelWarningCheckedRectificationForRegion, params);
  return result;                                   
}
//异常精准识别整改率 市 列表
export async function getModelWarningCheckedRectificationForCity(params) {
  const result = post(API.AbnormalIdentifyModel.GetModelWarningCheckedRectificationForCity, params);
  return result;
}
//异常精准识别整改率  企业 列表
export async function getModelWarningCheckedRectificationForEnt(params) {
  const result = post(API.AbnormalIdentifyModel.GetModelWarningCheckedRectificationForEnt, params);
  return result;   
}
//异常精准识别整改率 监测点 列表
export async function getModelWarningCheckedRectificationForPoint(params) {
  const result = post(API.AbnormalIdentifyModel.GetModelWarningCheckedRectificationForPoint, params);
  return result;
}
//异常精准识别整改率 整改详情
export async function getCheckedRectificationApprovals(params) {
  const result = post(API.AbnormalIdentifyModel.GetCheckedRectificationApprovals, params);
  return result;
}
//异常精准识别整改率 行政区 导出
export async function exportModelWarningCheckedRectificationForRegion(params) {
  const result = post(API.AbnormalIdentifyModel.ExportModelWarningCheckedRectificationForRegion, params);
  return result;
}
//异常精准识别整改率 市 导出
export async function exportModelWarningCheckedRectificationForCity(params) {
  const result = post(API.AbnormalIdentifyModel.ExportModelWarningCheckedRectificationForCity, params);
  return result;
}
//异常精准识别整改率 企业 导出
export async function exportModelWarningCheckedRectificationForEnt(params) {
  const result = post(API.AbnormalIdentifyModel.ExportModelWarningCheckedRectificationForEnt, params);
  return result;
}
