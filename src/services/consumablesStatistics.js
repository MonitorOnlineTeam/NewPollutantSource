import { post, get, getNew } from '@/utils/request';

// 耗材统计
export async function regGetConsumablesRIHList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetConsumablesRIHList',params, null);
  return result;
}

