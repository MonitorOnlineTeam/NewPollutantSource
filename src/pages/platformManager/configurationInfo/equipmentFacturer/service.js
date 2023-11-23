import { post, get, getNew } from '@/utils/request';
import { API} from '@config/API';

/**
 * 调试检测
 */

 
//设备厂家 列表  
export async function GetManufacturerList(params) {
  const result = await post(API.AssetManagementApi.GetEquipmentManufacturerList,params, null);
  return result;
}
//设备厂家 添加
export async function AddManufacturer(params) {
  const result = await post(API.AssetManagementApi.AddEquipmentManufacturerInfo,params, null);
  return result;
}

// 设备厂家 修改
export async function EditManufacturer(params) {
  const result = await post(API.AssetManagementApi.UpdateEquipmentManufacturerInfo,params, null);
  return result;
}
 
// 设备厂家  删除
export async function DelManufacturer(params) {
  const result = await post(API.AssetManagementApi.DeleteEquipmentManufacturerInfo,params, null);
  return result;
}

//设备厂家 列表  导出
export async function ExportManufacturerList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportManufacturerList',params, null);
  return result;
}
