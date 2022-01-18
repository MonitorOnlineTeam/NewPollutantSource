import { post } from '@/utils/request';

// 获取所有企业及排口信息
export async function getHomePage(params) {
  const result = await post('/api/rest/PollutantSourceApi/HomePageApi/GetHomePage', params, null);
  return result === null ? {
    data: null
  } : result;
}

