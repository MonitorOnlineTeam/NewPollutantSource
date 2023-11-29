import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'
//列表
export async function GetStandardGasList(params) {
  const result = await post(API.AssetManagementApi.GetStandardGasList,params, null);
  return result;
}
// 添加
export async function AddStandardGas(params) {
  const result = await post(API.AssetManagementApi.AddReferenceMaterialsInfo,params, null);
  return result;
}

// 修改
export async function EditStandardGas(params) {
  const result = await post(API.AssetManagementApi.UpdateReferenceMaterialsInfo,params, null);
  return result;
}
 
//  删除
export async function DelStandardGas(params) {
  const result = await post(API.AssetManagementApi.DeleteReferenceMaterialsInfo,params, null);
  return result;
}
