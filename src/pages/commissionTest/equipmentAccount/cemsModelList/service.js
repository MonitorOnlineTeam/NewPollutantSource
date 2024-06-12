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

// 获取系统型号与系统类别关联信息
export async function GetMonitorCategorySystemList(params) {
  const result = await post(API.CtAssetManagementApi.GetMonitorCategorySystemList,params, null);
  return result;
}
// 更新系统型号与系统类别关联信息设备类别状态
export async function UpdateMonitorCategorySystemStatus(params) {
  const result = await post(API.CtAssetManagementApi.UpdateMonitorCategorySystemStatus,params, null);
  return result;
}
// 添加系统型号与系统类别关联
export async function AddMonitorCategorySystem(params) {
  const result = await post(API.CtAssetManagementApi.AddMonitorCategorySystem,params, null);
  return result;
}
// 删除系统型号与系统类别关联
export async function DeleteMonitorCategorySystem(params) {
  const result = await post(API.CtAssetManagementApi.DeleteMonitorCategorySystem,params, null);
  return result;
}
