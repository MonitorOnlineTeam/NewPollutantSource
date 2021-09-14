import { post, get, getNew } from '@/utils/request';

// 运维到期点位统计
export async function GetOperationExpirePointList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetOperationExpirePointList', params, null);
  return result;
}

//导出
export async function ExportOperationExpirePointList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportOperationExpirePointList', params, null);
  return result;
}

