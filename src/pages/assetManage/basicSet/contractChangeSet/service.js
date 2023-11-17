import { post, get, getNew } from '@/utils/request';


/*** 合同变更设置 */


//列表
export async function GetOperationUserList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetOperationUserList',params, null);
  return result;
}
//添加
export async function UpdateOperationUser(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/UpdateOperationUser',params, null);
  return result;
}


// 删除
export async function DeleteOperationUser(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DeleteOperationUser',params, null);
  return result;
}


