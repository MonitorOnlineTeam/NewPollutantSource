import { post, get, getNew } from '@/utils/request';


//无数据点位统计 导出
export async function ExportSystemModelList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportSystemModelList',params, null);
  return result;
}