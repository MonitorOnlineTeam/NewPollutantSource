import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

//cems设备清单

//设备信息 列表
export async function GetEquipmentInfoList(params) {
  const result = await post(API.CtAssetManagementApi.GetCemsEquipmentInventory,params, null);
  return result;
}
//设备信息 添加
export async function AddEquipmentInfo(params) {
  const result = await post(API.CtAssetManagementApi.AddCemsEquipmentInfo,params, null);
  return result;
}

// 设备信息 修改
export async function EditEquipmentInfo(params) {
  const result = await post(API.CtAssetManagementApi.UpdCemsEquipmentInfo,params, null);
  return result;
}
 
// 设备信息  删除
export async function DelEquipmentInfo(params) {
  const result = await post(API.CtAssetManagementApi.DeleteCemsEquipmentInfo,params, null);
  return result;
}



