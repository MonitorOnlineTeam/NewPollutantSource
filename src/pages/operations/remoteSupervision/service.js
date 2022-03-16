import { post, get, getNew } from '@/utils/request';

// 列表
export async function GetFaultFeedbackList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetFaultFeedbackList', params, null);
  return result;
}

//编辑
export async function UpdateFaultFeedbackIsSolve(params) {
  const result = await post(`/api/rest/PollutantSourceApi/TaskFormApi/UpdateFaultFeedbackIsSolve/${params.ID}?IsSolve=${params.IsSolve}`, params, null);
  return result;
}

// 根据企业获取排口
export async function getPointByEntCode(params) {
  const result = await post('/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetPointByEntCode', params, null);
  return result;
}