import { post, get, getNew } from '@/utils/request';

// CEMS型号清单 列表
export async function GetSystemModelList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestGetSystemModelList',params, null);
  return result;
}