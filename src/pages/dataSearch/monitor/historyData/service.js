import { post, get, getNew } from '@/utils/request';

// 获取历史数据 数据类型
export async function getAllTypeDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetAllTypeDataList', params, null);
  return result.Datas === null ? {
   ...result, Datas: [],
  } : result;
}


// 获取类型  表头
export async function GetpollutantListByDgimn(params) {
    const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantListByDgimn', params, null);
    return result.Datas === null ? {
      Datas: [],
    } : result;
  }

// 获取历史数据  单参 多参 图表数据
export async function getAllChatDataLists(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetDataForHistory', params, null);
  return result.Datas === null ? {
    ...result, Datas: [],
  } : result;
}
 
/**
 * 获取排口下的污染物
 * @params {    "DGIMNs": "31011500000002"  }
 */
export async function querypollutantlist(params) {
  const result = await post( '/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantListByDgimn', params, null, );
  return result === null? {   Datas: [] } : result;
}

// 导出历史数据报表
export async function exportHistoryReport(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/ExportAllTypeDataList', params, null);
  return result;
}