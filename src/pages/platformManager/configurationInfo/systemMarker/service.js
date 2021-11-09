import { post, get, getNew } from '@/utils/request';

// //系统型号 列表
export async function GetSystemModelList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetSystemModelList',params, null);
  return result;
}
//系统型号 添加
export async function AddSystemModel(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddSystemModel',params, null);
  return result;
}

// 系统型号 修改
export async function EditSystemModel(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/EditSystemModel',params, null);
  return result;
}
 
// 系统型号  删除
export async function DelSystemModel(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DelSystemModel',params, null);
  return result;
}
// 系统型号 获取监测类别
export async function GetMonitoringTypeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetMonitoringTypeList',params, null);
  return result;
}
// 系统型号 获取设备厂商列表
export async function GetManufacturerList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetManufacturerList',params, null);
  return result;
}

