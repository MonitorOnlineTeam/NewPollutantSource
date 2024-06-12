import { post } from '@/utils/request';
import { API } from '@config/API'



// 获取系统信息列表 
export async function TestGetSystemModelList(params) {
  const result = post(API.CtAssetManagementApi.GetCemsSystemModelInventory, params);
  return result;
}

// 获取设备信息列表
export async function GetTestEquipmentInfoList(params) {
  const result = post(API.CtAssetManagementApi.GetCemsEquipmentInventory, params);
  return result;
}

//参比仪器设备清单 列表
export async function GetTestParamInfoList (params) {
  const result = await post(API.CtAssetManagementApi.GetReferenceInstrumentInventory,params, null);
  return result;
} 
// 获取站点CEMS参数信息 
export async function GetCEMSSystemList(params) {
  const result = post(API.CtDebugServiceApi.GetPointCemsSystemList, params);
  return result;
}

// 操作站点CEMS参数信息
export async function OperationCEMSSystem(params) {
  const result = post(API.CtDebugServiceApi.OperationPointCemsSystemInfo, params);
  return result;
}

// 获取参比仪器信息
export async function GetParamList(params) {
  const result = post(API.CtDebugServiceApi.GetPointReferenceInstrumentList, params);
  return result;
}

// 操作站点参比仪器信息
export async function OperationParam(params) {
  const result = post(API.CtDebugServiceApi.OperationPointReferenceInstrumentInfo, params);
  return result;
}

// 添加或修改调试检测排口
export async function AddOrUpdateTestPoint(params) {
  const result = post(API.CtDebugServiceApi.AddOrUpdateTestPoint, params);
  return result;
}	