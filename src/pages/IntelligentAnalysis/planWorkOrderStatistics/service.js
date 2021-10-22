import { post, get, getNew } from '@/utils/request';

// 计划工单统计
export async function getTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskWorkOrderList',params, null);
  return result;
}

// 计划工单统计 市级别
export async function cityGetTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskWorkOrderList',params, null);
  return result;
}

// 计划工单统计 市级别 弹框
export async function cityDetailGetTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskWorkOrderList',params, null);
  return result;
}
//计划工单统计 省级
export async function abnormalGetTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskWorkOrderList',params, null);
  return result;
}

//计划工单统计 市级
export async function cityAbnormalGetTaskWorkOrderList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskWorkOrderList',params, null);
  return result;
}

//计划工单统计  企业
export async function getPointGetTaskWorkOrderListt(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTaskWorkOrderList',params, null);
  return result;
}
