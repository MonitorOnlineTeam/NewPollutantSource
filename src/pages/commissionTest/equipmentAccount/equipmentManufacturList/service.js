import { post, get, getNew } from '@/utils/request';

//设备厂商 列表
export async function GetManufacturerList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetTestManufacturerList',params, null);
  return result;
}
//设备厂商 添加
export async function AddManufacturer(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddTestManufacturer',params, null);
  return result;
}

// 设备厂商 修改
export async function EditManufacturer(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/EditTestManufacturer',params, null);
  return result;
}
 
// 设备厂商  删除
export async function DelManufacturer(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DelTestManufacturer',params, null);
  return result;
}


