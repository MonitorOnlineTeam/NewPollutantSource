import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

/**省区经理管理**/
//列表
export async function GetProvinceManagerList(params) {
  const result = await post(API.AssetManagementApi.GetProvinceManagerList, params, null);
  return result;
}

//添加or修改
export async function AddorUpdateProvinceManager(params) {
  const result = await post(API.AssetManagementApi.AddorUpdateProvinceManager, params, null);
  return result;
}

//删除
export async function DeleteProvinceManager(params) {
  const result = await post(API.AssetManagementApi.DeleteProvinceManager, params, null);
  return result;
}

//详情
export async function GetProvinceManagerByID(params) {
  const result = await post(API.AssetManagementApi.GetProvinceManagerByID, params, null);
  return result;
}
