import { post, get, getNew } from '@/utils/request';

//关键参数核查整改信息
export async function GetKeyParameterQuestionList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetKeyParameterQuestionList',params, null);
  return result;
}
//关键参数核查整改信息 导出
export async function ExportKeyParameterQuestionList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/ExportKeyParameterQuestionList',params, null);
  return result;
}
//关键参数核查整改详情
export async function GetKeyParameterQuestionDetailList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetKeyParameterQuestionDetailList',params, null);
  return result;
}
//关键参数核查整改
export async function CheckItemKeyParameterQuestion(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/CheckItemKeyParameterQuestion',params, null);
  return result;
}
//通过或驳回关键参数核查整改
export async function UpdateKeyParameterQuestionStatus(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/UpdateKeyParameterQuestionStatus',params, null);
  return result;
}