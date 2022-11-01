import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

// 获取所有污染物
export async function GetProcessFlowChartStatus(params) {
  const result = await get(API.DymaicControlApi.GetProcessFlowChartStatus, params, null);
  return result === null ? {
    data: null
  } : result;
}