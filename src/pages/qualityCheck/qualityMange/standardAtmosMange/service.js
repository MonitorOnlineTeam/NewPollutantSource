import { post, get, getNew } from '@/utils/request';



// 质控核查 标气管理
export async function getQCAStandardManagement(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetQCAStandardManagement', params, null);
  return result.Datas === null ? {
    Datas: [],
  } : result;
}

// 导出数据
export async function exportDatas(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/ExportQCAStandardManagement', params, null);
  return result;
}