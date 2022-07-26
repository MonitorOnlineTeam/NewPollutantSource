import { post, get, getNew } from '@/utils/request';

/**
 * 调试检测
 */

 
//设备厂家 列表  
export async function GetManufacturerList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetTestManufacturerList',params, null);
  return result;
}
//设备厂家 添加
export async function AddManufacturer(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestAddManufacturer',params, null);
  return result;
}

// 设备厂家 修改
export async function EditManufacturer(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestEditManufacturer',params, null);
  return result;
}
 
// 设备厂家  删除
export async function DelManufacturer(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/TestDelManufacturer ',params, null);
  return result;
}


