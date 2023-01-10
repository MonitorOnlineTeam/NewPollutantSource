import { post, get, getNew } from '@/utils/request';


//督查类型
export async function GetInspectorCodeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetInspectorCodeList',params, null);
  return result;
}
//列表 督查总结
export async function GetInspectorSummaryList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetInspectorSummaryList',params, null);
  return result;
}

//导出 督查总结
export async function ExportInspectorSummaryList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/ExportInspectorSummaryList',params, null);
  return result;
}
//列表 督查总结---按省统计
export async function GetInspectorSummaryForRegionList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetInspectorSummaryForRegionList',params, null);
  return result;
}

 
//导出 督查总结---按省统计
export async function ExportInspectorSummaryForRegion(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/ExportInspectorSummaryForRegion',params, null);
  return result;
}

//列表 关键参数督查汇总
export async function GetRemoteSummaryList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetRemoteSummaryList',params, null);
  return result;
}
 
//导出 关键参数督查汇总
export async function ExportRemoteSummaryList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/ExportRemoteSummaryList',params, null);
  return result;
}

//列表 全系统督查汇总
export async function GetOperationManageSummaryList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetOperationManageSummaryList',params, null);
  return result;
}

 
//导出 全系统督查汇总
export async function ExportOperationManageSummaryList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/ExportOperationManageSummaryList',params, null);
  return result;
}
