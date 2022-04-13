import { post, get, getNew } from '@/utils/request';

// 获取
export async function GetData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetFaultUnitList',params, null);
  return result;
}
// 保存
export async function SaveData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddFaultUnit',params, null);
  return result;
}
