import { post, get, getNew } from '@/utils/request';

// //设备厂商 列表
// export async function GetManufacturerList(params) {
//   const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetManufacturerList',params, null);
//   return result;
// }
//设备厂商 添加
export async function AddManufacturer(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddManufacturer',params, null);
  return result;
}

// 设备厂商 修改
export async function EditManufacturer(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/EditManufacturer',params, null);
  return result;
}
 
// 设备厂商  删除
export async function DelManufacturer(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DelManufacturer',params, null);
  return result;
}
// 设备厂商  删除
export async function DelManufacturer(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DelManufacturer',params, null);
  return result;
}
// 设备厂商 获取监测类别
export async function GetMonitoringTypeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetMonitoringTypeList',params, null);
  return result;
}
// 设备厂商 获取设备厂商列表
export async function GetManufacturerList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetManufacturerList',params, null);
  return result;
}



