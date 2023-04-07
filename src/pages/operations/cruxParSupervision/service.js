import { post, get, getNew } from '@/utils/request';

//获取关键参数核查列表
export async function GetKeyParameterCheckList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetKeyParameterCheckList',params, null);
  return result;
}
//获取关键参数核查列表 导出
export async function ExportKeyParameterCheckList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/ExportKeyParameterCheckList',params, null);
  return result;
}
//获取关键参数核查列表详情
export async function GetKeyParameterCheckDetailList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetKeyParameterCheckDetailList',params, null);
  return result;
}
//核查
export async function CheckItemKeyParameter(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/CheckItemKeyParameter',params, null);
  return result;
}
///保存或提交关键参数核查
export async function SubCheckItem(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/SubCheckItem',params, null);
  return result;
}
//删除关键参数核查项
export async function DeleteKeyParameterItemCheck(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/DeleteKeyParameterItemCheck',params, null);
  return result;
}
//删除关键参数核查信息
export async function DeleteKeyParameterCheck(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/DeleteKeyParameterCheck',params, null);
  return result;
}
//下发关键参数核查信息
export async function IssuedKeyParameter(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/IssuedKeyParameter',params, null);
  return result;
}
//转发任务单
export async function RetransmissionKeyParameter(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/RetransmissionKeyParameter',params, null);
  return result;
}
