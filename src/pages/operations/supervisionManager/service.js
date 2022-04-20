import { post, get, getNew } from '@/utils/request';

//列表
export async function GetStandardGasList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetStandardGasList',params, null);
  return result;
}
// 添加
export async function AddStandardGas(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddStandardGas',params, null);
  return result;
}

// 修改
export async function EditStandardGas(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/EditStandardGas',params, null);
  return result;
}
 
//  删除
export async function DelStandardGas(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DelStandardGas',params, null);
  return result;
}
