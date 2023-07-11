import { post, get, getNew } from '@/utils/request';

/**省区经理管理**/
//列表
export async function GetProvinceManagerList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetProvinceManagerList', params, null);
  return result;
}

//添加or修改
export async function AddorUpdateProvinceManager(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/AddorUpdateProvinceManager', params, null);
  return result;
}

//删除
export async function DeleteProvinceManager(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/DeleteProvinceManager', params, null);
  return result;
}

//详情
export async function GetProvinceManagerByID(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetProvinceManagerByID', params, null);
  return result;
}
