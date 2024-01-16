import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';

//关键参数核查整改信息
export async function GetKeyParameterQuestionList(params) {
  const result = await post(API.SupervisionVerificaApi.GetKeyParameterQuestionList,params, null);
  return result;
}
//关键参数核查整改信息 导出
export async function ExportKeyParameterQuestionList(params) {
  const result = await post(API.SupervisionVerificaApi.ExportKeyParameterQuestionList,params, null);
  return result;
}
//关键参数核查整改详情
export async function GetKeyParameterQuestionDetailList(params) {
  const result = await post(API.SupervisionVerificaApi.GetKeyParameterQuestionDetailList,params, null);
  return result;
}
//关键参数核查整改
export async function CheckItemKeyParameterQuestion(params) {
  const result = await post(API.SupervisionVerificaApi.CheckItemKeyParameterQuestion,params, null);
  return result;
}
//通过或驳回关键参数核查整改
export async function UpdateKeyParameterQuestionStatus(params) {
  const result = await post(API.SupervisionVerificaApi.UpdateKeyParameterQuestionStatus,params, null);
  return result;
}