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
// //计划工单统计 省级
// export async function abnormalGetTaskWorkOrderList(params) {
//   const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskWorkOrderList',params, null);
//   return result;
// }

// //计划工单统计 市级
// export async function cityAbnormalGetTaskWorkOrderList(params) {
//   const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskWorkOrderList',params, null);
//   return result;
// }


