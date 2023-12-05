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
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestAddManufacturer',params, null);
  return result;
}

// 设备厂商 修改
export async function EditManufacturer(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestEditManufacturer',params, null);
  return result;
}
 
// 设备厂商  删除
export async function DelManufacturer(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestDelManufacturer',params, null);
  return result;
}


