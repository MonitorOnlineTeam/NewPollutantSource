import { post, get, getNew } from '@/utils/request';


// 获取系统参数
export async function getFlowTableData(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetProcessFlowTable', params, null);
  return result;
}

//数据可视化数据
export async function GetVisualizationChartList(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetVisualizationChartList', params, null);
  return result;
}



