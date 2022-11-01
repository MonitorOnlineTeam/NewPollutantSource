import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'


// 获取系统参数
export async function getFlowTableData(params) {
  const result = await post(API.DymaicControlApi.GetProcessFlowTable, params, null);
  return result;
}

//数据可视化数据
export async function GetVisualizationChartList(params) {
  const result = await post(API.DymaicControlApi.GetVisualizationChartList, params, null);
  return result;
}



