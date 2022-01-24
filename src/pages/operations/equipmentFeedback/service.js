import { post, get, getNew } from '@/utils/request';

//设备故障反馈 列表
export async function GetFaultFeedbackList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetFaultFeedbackList', params, null);
  return result;
}

//编辑
export async function UpdateFaultFeedbackIsSolve(params) {
  const result = await post(`/api/rest/PollutantSourceApi/TaskFormApi/UpdateFaultFeedbackIsSolve/${params.ID}?IsSolve=${params.IsSolve}`, params, null);
  return result;
}

//设备故障反馈 导出
export async function ExportFaultFeedback(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ExportFaultFeedback', params, null);
  return result;
}

