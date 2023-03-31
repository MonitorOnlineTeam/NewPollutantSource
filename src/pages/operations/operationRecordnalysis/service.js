import { post, get, getNew } from '@/utils/request';


//运维分析列表
export async function GetOperationRecordAnalyList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetOperationRecordAnalyList',params, null);
  return result;
}
//运维分析详情列表
export async function GetOperationRecordAnalyInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetOperationRecordAnalyInfoList',params, null);
  return result;
}
//运维分析列表 导出
export async function ExportOperationRecordAnalyList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/ExportOperationRecordAnalyList',params, null);
  return result;
}
//运维分析详情列表 导出
export async function ExportOperationRecordAnalyInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/ExportOperationRecordAnalyInfoList',params, null);
  return result;
}
//获取工单类型
export async function GetTaskTypeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetTaskTypeList',params, null);
  return result;
}
