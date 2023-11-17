import { post, get, getNew } from '@/utils/request';

// 计划工单统计
export async function regEntGetTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskWorkOrderList',params, null);
  return result;
}

// 计划工单统计 市级别
export async function cityGetTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskWorkOrderList',params, null);
  return result;
}
//计划工单统计  行政区
export async function regPointGetTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskWorkOrderList',params, null);
  return result;
}
// 计划工单统计 省级别&&市级别 工单弹框 计划内 计划外
export async function  insideOrOutsideWorkGetTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskWorkOrderList',params, null);
  return result;
}
// 计划工单统计 行政区市  计划外 市详情
export async function cityDetailGetTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskWorkOrderList',params, null);
  return result;
}

//计划工单统计 企业 计划外监测点 
export async function entOutsidePointGetTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskWorkOrderList',params, null);
  return result;
}
//导出  行政区和企业第一个页面
export async function exportTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ExportTaskWorkOrderList',params, null);
  return result;
}
//导出  行政区 市级别详情
export async function exportCityDetailTaskWorkList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ExportTaskWorkOrderList',params, null);
  return result;
}

//导出  行政区
export async function workRegExportTaskWorkList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ExportTaskWorkOrderList',params, null);
  return result;
}
//导出  行政区 市级别
export async function cityRegExportTaskWorkList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ExportTaskWorkOrderList',params, null);
  return result;
}
//导出  行政区 监测点
export async function operaPointExportTaskWorkList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ExportTaskWorkOrderList',params, null);
  return result;
}
//导出  企业  工单弹框
export async function  workEntExportTaskWorkList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ExportTaskWorkOrderList',params, null);
  return result;
}


/*实际校准完成率 */


// 计划工单统计 
export async function regEntActualGetTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetTaskWorkOrderList',params, null);
  return result;
}

// 计划工单统计 市级别
export async function cityActualGetTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetTaskWorkOrderList',params, null);
  return result;
}

// 计划工单统计 省级别&&市级别 工单弹框 计划内 计划外
export async function  insideOrOutsideWorkActualGetTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetTaskWorkOrderList',params, null);
  return result;
}


export async function exportActualTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/ExportTaskWorkOrderList',params, null);
  return result;
}