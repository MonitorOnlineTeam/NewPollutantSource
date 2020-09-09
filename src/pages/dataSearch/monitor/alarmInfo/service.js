import { post, get, getNew } from '@/utils/request';


//报警列表
export async function GetAlarmDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetAlarmDataList', params, null);
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
