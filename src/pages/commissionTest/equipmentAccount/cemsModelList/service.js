import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'
// CEMS型号清单 列表
export async function GetSystemModelList(params) {
  const result = await post(API.CtAssetManagementApi.GetCemsSystemModelInventory,params, null);
  return result;
}
//CEMS型号清单 添加
export async function AddSystemModel(params) {
  const result = await post(API.CtAssetManagementApi.AddCemsSystemModelInfo,params, null);
  return result;
}

// CEMS型号清单 修改
export async function EditSystemModel(params) {
  const result = await post(API.CtAssetManagementApi.UpdCemsSystemModelInfo,params, null);
  return result;
}
 
// CEMS型号清单  删除
export async function DelSystemModel(params) {
  const result = await post(API.CtAssetManagementApi.DeleteCemsSystemModelInfo,params, null);
  return result;
}


// CEMS型号清单 获取系统信息名称列表
export async function GetSystemModelNameList(params) {
  const result = await post(API.AssetManagementApi.GetSystemNameList,params, null);
  return result;
}