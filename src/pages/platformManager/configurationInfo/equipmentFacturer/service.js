import { post, get, getNew } from '@/utils/request';

/**
 * 调试检测
 */

 
//设备厂家 列表  
export async function GetManufacturerList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetManufacturerList',params, null);
  return result;
}
//设备厂家 添加
export async function AddManufacturer(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddManufacturer',params, null);
  return result;
}

// 设备厂家 修改
export async function EditManufacturer(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/EditManufacturer',params, null);
  return result;
}
 
// 设备厂家  删除
export async function DelManufacturer(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DelManufacturer',params, null);
  return result;
}


