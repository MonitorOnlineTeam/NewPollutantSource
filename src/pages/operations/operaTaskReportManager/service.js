import { post, get, getNew } from '@/utils/request';

//运维任务报告 列表
export async function GetOperationReportList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetOperationReportList', params, null);
  return result;
}

