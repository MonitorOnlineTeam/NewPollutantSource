import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'



// 一企一档查询
export async function GetEntsList(params) {
  const result = await post(`${API.BaseDataApi.GetEntRecordData}?indexStr=${params.indexStr}`, {}, null);
  return result;
}