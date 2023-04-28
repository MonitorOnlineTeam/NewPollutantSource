import { post, get, getNew } from '@/utils/request';

//任务管理相关列表
export async function BWWebService(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/BWWebService',params, null);
  return result;
}