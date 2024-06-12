import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'


/*** 调试检测 */


//设备厂商 列表
export async function GetManufacturerList(params) {
  const result = await post(API.CtAssetManagementApi.GetEquipmentManufacturerInventory,params, null);
  return result;
}
//设备厂商 添加
export async function AddManufacturer(params) {
  const result = await post(API.CtAssetManagementApi.AddEquipmentManufacturerInfo,params, null);
  return result;
}

// 设备厂商 修改
export async function EditManufacturer(params) {
  const result = await post(API.CtAssetManagementApi.UpdateEquipmentManufacturerInfo,params, null);
  return result;
}
 
// 设备厂商  删除
export async function DelManufacturer(params) {
  const result = await post(API.CtAssetManagementApi.DeleteEquipmentManufacturerInfo,params, null);
  return result;
}


