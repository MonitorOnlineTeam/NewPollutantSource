import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//异常精准识别核实率 行政区 列表
export async function getOperationPlanTaskList(params) {
  const result = post(API.ProjectExecuProgressApi.GetOperationPlanTaskList, params);
  return result;
}
//异常精准识别核实率 市 列表
export async function GetModelWarningCheckedForCity(params) {
  const result = post(API.ProjectExecuProgressApi.GetModelWarningCheckedForCity, params);
  return result;
}
//异常精准识别核实率  企业 列表
export async function GetModelWarningCheckedForEnt(params) {
  const result = post(API.ProjectExecuProgressApi.GetModelWarningCheckedForEnt, params);
  return result;
}
//异常精准识别核实率  监测点 列表
export async function GetModelWarningCheckedForPoint(params) {
  const result = post(API.ProjectExecuProgressApi.GetModelWarningCheckedForPoint, params);
  return result;
}
//异常精准识别核实率 导出
export async function exportOperationPlanTaskList(params) {
  const result = post(API.ProjectExecuProgressApi.ExportOperationPlanTaskList, params);
  return result;
}


