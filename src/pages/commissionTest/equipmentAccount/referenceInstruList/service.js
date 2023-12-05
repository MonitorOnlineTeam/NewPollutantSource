import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'
//参比仪器设备清单 列表
export async function GetTestParamInfoList (params) {
  const result = await post(API.CtAssetManagementApi.GetReferenceInstrumentInventory,params, null);
  return result;
}
//参比仪器设备清单 添加
export async function TestAddParamInfo(params) {
  const result = await post(API.CtAssetManagementApi.AddReferenceInstrumentInfo,params, null);
  return result;
}

// 参比仪器设备清单 修改
export async function TestEditParamInfo (params) {
  const result = await post(API.CtAssetManagementApi.UpdReferenceInstrumentInfo,params, null);
  return result;
}
 
// 参比仪器设备清单  删除
export async function TestDelParamInfo(params) {
  const result = await post(API.CtAssetManagementApi.DeleteReferenceInstrumentInfo,params, null);
  return result;
}
