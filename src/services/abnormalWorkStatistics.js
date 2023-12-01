import { post, get, getNew } from '@/utils/request';
import { API} from '@config/API';

// 异常工单统计
export async function exceptionTaskList(params) {
  const result = await post(API.PredictiveMaintenanceApi.GetExceptionTaskOrderList,params, null);
  return result;
}

// 异常工单统计 市级别
export async function cityExceptionTaskList(params) {
  const result = await post(API.PredictiveMaintenanceApi.GetExceptionTaskOrderList,params, null);
  return result;
}

// 异常工单统计 市级别 弹框
export async function cityDetailExceptionTaskList(params) {
  const result = await post(API.PredictiveMaintenanceApi.GetExceptionTaskOrderList,params, null);
  return result;
}
//异常打卡 省级
export async function abnormalExceptionTaskList(params) {
  const result = await post(API.PredictiveMaintenanceApi.GetExceptionTaskOrderList,params, null);
  return result;
}

//异常打卡 市级
export async function cityAbnormalExceptionTaskList(params) {
  const result = await post(API.PredictiveMaintenanceApi.GetExceptionTaskOrderList,params, null);
  return result;
}

//异常打卡 企业
export async function getPointExceptionSignList(params) {
  const result = await post(API.PredictiveMaintenanceApi.GetExceptionTaskOrderSignList,params, null);
  return result;
}

//行政区 导出
export async function exportExceptionTaskList(params) {
  const result = await post(API.PredictiveMaintenanceApi.ExportExceptionTaskOrderList,params, null);
  return result;
}
//行政区 打卡异常 导出
export async function exportCardResExceptionTaskList(params) {
  const result = await post(API.PredictiveMaintenanceApi.ExportExceptionTaskOrderList,params, null);
  return result;
}
//行政区 市级 详情 导出
export async function regDetaiExportExceptionTaskList(params) {
  const result = await post(API.PredictiveMaintenanceApi.ExportExceptionTaskOrderList,params, null);
  return result;
}
//行政区 市级 打卡异常 导出
export async function abnormalExceptionTaskListExport(params) {
  const result = await post(API.PredictiveMaintenanceApi.ExportExceptionTaskOrderList,params, null);
  return result;
}
//行政区 市级弹框 详情 导出
export async function cityDetailExceptionTaskListExport(params) {
  const result = await post(API.PredictiveMaintenanceApi.ExportExceptionTaskOrderList,params, null);
  return result;
}

//企业 响应超时 导出
export async function exportEntResExceptionTaskList(params) {
  const result = await post(API.PredictiveMaintenanceApi.ExportExceptionTaskOrderList,params, null);
  return result;
}