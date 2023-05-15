import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'


//获取系统参数
export async function GetProcessFlowTableHistoryDataList(params) {
  const result = await post(API.DymaicControlApi.GetProcessFlowTableHistoryDataList, params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

//获取仪器列表 参数
export async function GetHistoryParaCodeList(params) {
  const result = await post(API.DymaicControlApi.GetHistoryParaCodeList, params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}


// 导出数据
export async function exportDatas(params) {
  const result = await post('/rest/PollutantSourceApi/MonDataApi/ExportProcessFlowTableHistoryDataList', params, null);
   return result;
}

