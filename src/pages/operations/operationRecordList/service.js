import { post, get, getNew } from '@/utils/request';

//运维记录列表
export async function GetOperationRecordListByDGIMN(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetOperationRecordListByDGIMN',params, null);
  return result;
}
//运维记录列表 导出
export async function ExportOperationRecordListByDGIMN(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/ExportOperationRecordListByDGIMN',params, null);
  return result;
}
//获取工单类型
export async function GetTaskTypeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetTaskTypeList',params, null);
  return result;
}