import { post, get, getNew } from '@/utils/request';

// 获取系统入口
export async function getSysPollutantTypeList() {
  const result = await post('/api/rest/PollutantSourceApi/AuthorApi/GetSysList', {}, null);
  return result;
}