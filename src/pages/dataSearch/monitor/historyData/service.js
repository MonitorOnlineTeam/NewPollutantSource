import { post, get, getNew } from '@/utils/request';

// 获取历史数据 
export async function getAllTypeDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/DataList/GetAllTypeDataList', params, null);
  return result.Datas === null ? {
    Datas: [],
  } : result;
}


// 获取类型  表头
export async function GetpollutantListByDgimn(params) {
    const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantListByDgimn', params, null);
    return result.Datas === null ? {
      Datas: [],
    } : result;
  }

