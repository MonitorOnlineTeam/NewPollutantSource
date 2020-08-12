import { post, get, getNew } from '@/utils/request';


// 获取历史数据 
export async function getFlowTableData(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetProcessFlowTable', params, null);
  return result;
}





