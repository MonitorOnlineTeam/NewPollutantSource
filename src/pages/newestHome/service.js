import { post, get, getNew } from '@/utils/request';

// 运营信息统计
export async function GetOperatePointList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetOperatePointList', params, null);
  return result;
}

//运维工单统计
export async function GetOperationTaskList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetOperationTaskList', params, null);
  return result;
}

//近期运维情况
export async function GetOperationPlanTaskRate(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetOperationPlanTaskRate', params, null);
  return result;
}

