import { post, get, getNew } from '@/utils/request';


// 获取响应时间核查数据
export async function getResTimeCheckTableData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetResponseDataList', params, null);
  return result;
}

// 获取
export async function getZeroCheckTableData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetZeroDataList', params, null);
  return result;
}






