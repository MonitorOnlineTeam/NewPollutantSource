import { post, get, getNew } from '@/utils/request';


//获取系统参数
export async function GetProcessFlowTableHistoryDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetProcessFlowTableHistoryDataList', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

//获取仪器列表 参数
export async function GetHistoryParaCodeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetHistoryParaCodeList', params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}
