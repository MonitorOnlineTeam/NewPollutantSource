import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//异常精准识别核实率 行政区 列表
export async function getModelWarningCheckedForRegion(params) {
  const result = post(API.AbnormalModelAnalysisApi.GetModelWarningCheckedForRegion, params);
  return result;
}
//异常精准识别核实率 市 列表
export async function getModelWarningCheckedForCity(params) {
  const result = post(API.AbnormalModelAnalysisApi.GetModelWarningCheckedForCity, params);
  return result;
}
//异常精准识别核实率  企业 列表
export async function getModelWarningCheckedForEnt(params) {
  const result = post(API.AbnormalModelAnalysisApi.GetModelWarningCheckedForEnt, params);
  return result;
}
//异常精准识别核实率 监测点 列表
export async function getModelWarningCheckedForPoint(params) {
  const result = post(API.AbnormalModelAnalysisApi.GetModelWarningCheckedForPoint, params);
  return result;
}
//异常精准识别核实率 行政区 导出
export async function exportModelWarningCheckedForRegion(params) {
  const result = post(API.AbnormalModelAnalysisApi.ExportModelWarningCheckedForRegion, params);
  return result;
}
//异常精准识别核实率 市 导出
export async function exportModelWarningCheckedForCity(params) {
  const result = post(API.AbnormalModelAnalysisApi.ExportModelWarningCheckedForCity, params);
  return result;
}
//异常精准识别核实率 市 导出
export async function exportModelWarningCheckedForEnt(params) {
  const result = post(API.AbnormalModelAnalysisApi.ExportModelWarningCheckedForEnt, params);
  return result;
}

