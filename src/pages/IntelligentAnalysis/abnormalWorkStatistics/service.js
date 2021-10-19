import { post, get, getNew } from '@/utils/request';

// 异常工单统计
export async function exceptionTaskList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ExceptionTaskList',params, null);
  return result;
}

// 异常工单统计 市级别
export async function cityExceptionTaskList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ExceptionTaskList',params, null);
  return result;
}

// 异常工单统计 市级别 弹框
export async function cityDetailExceptionTaskList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ExceptionTaskList',params, null);
  return result;
}
//异常打卡 省级
export async function abnormalExceptionTaskList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ExceptionTaskList',params, null);
  return result;
}

//异常打卡 市级
export async function cityAbnormalExceptionTaskList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ExceptionTaskList',params, null);
  return result;
}

//异常打卡 企业
export async function getPointExceptionSignList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetPointExceptionSignList',params, null);
  return result;
}
