import { post, get, getNew } from '@/utils/request';


// 获取气瓶数据
export async function getBottleDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetQCAStandardManagement', params, null);
  return result;
}

  
  








