import { post, get, getNew } from '@/utils/request';

//列表 督查总结
export async function GetInspectorSummaryList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetInspectorSummaryList',params, null);
  return result;
}

//督查类型
export async function GetInspectorCodeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetInspectorCodeList',params, null);
  return result;
}

//列表 关键参数督查汇总
export async function GetRemoteSummaryList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetRemoteSummaryList',params, null);
  return result;
}
//列表 全系统督查汇总
export async function GetOperationManageSummaryList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetOperationManageSummaryList',params, null);
  return result;
}

 
//导出运维督查信息
export async function ExportInspectorOperationManage(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ExportInspectorOperationManage',params, null);
  return result;
}