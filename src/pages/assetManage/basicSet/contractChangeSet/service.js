import { post, get, getNew } from '@/utils/request';
import { API} from '@config/API';


/*** 合同变更设置 */


//列表
export async function GetOperationUserList(params) {
  const result = await post(API.AssetManagementApi.GetOperationUserList,params, null);
  return result;
}
//添加
export async function UpdateOperationUser(params) {
  const result = await post(API.AssetManagementApi.UpdateOperationUser,params, null);
  return result;
}


// 删除
export async function DeleteOperationUser(params) {
  const result = await post(API.AssetManagementApi.DeleteOperationUser,params, null);
  return result;
}


