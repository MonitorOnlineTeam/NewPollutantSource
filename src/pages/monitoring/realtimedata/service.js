import { post, get, getNew } from '@/utils/request';

// 获取所有污染物
export async function GetProcessFlowChartStatus(params) {
    const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetProcessFlowChartStatus', params, null);
    return result === null ? {
      data: null
    } : result;
  }