import { post, get, getNew } from '@/utils/request';


//关键参数核查分析 列表
export async function GetKeyParameterAnalyseList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetKeyParameterAnalyseList',params, null);
  return result;
}
//关键参数核查分析 导出
export async function ExportKeyParameterAnalyseList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/ExportKeyParameterAnalyseList',params, null);
  return result;
}
