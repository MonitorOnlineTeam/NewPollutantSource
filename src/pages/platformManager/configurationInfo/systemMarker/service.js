import { post, get, getNew } from '@/utils/request';
import { API} from '@config/API';

//系统型号 列表
export async function GetSystemModelList(params) {
  const result = await post(API.AssetManagementApi.GetSystemModelList,params, null);
  return result;
}
//系统型号 添加
export async function AddSystemModel(params) {
  const result = await post(API.AssetManagementApi.AddSystemModelInfo,params, null);
  return result;
}

// 系统型号 修改
export async function EditSystemModel(params) {
  const result = await post(API.AssetManagementApi.UpdateSystemModelInfo,params, null);
  return result;
}
 
// 系统型号  删除
export async function DelSystemModel(params) {
  const result = await post(API.AssetManagementApi.DeleteSystemModelInfo,params, null);
  return result;
}
// 系统型号 获取监测类别
export async function GetMonitoringTypeList(params) {
  const result = await post(API.AssetManagementApi.GetMonitoringCategoryList,params, null);
  return result;
}
// 系统型号 获取设备厂商列表
export async function GetManufacturerList(params) {
  const result = await post(API.AssetManagementApi.GetEquipmentManufacturerList,params, null);
  return result;
}


// 系统型号 获取系统名称列表
export async function GetSystemModelNameList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetSystemModelNameList',params, null);
  return result;
}

//系统型号 导出
export async function ExportSystemModelList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportSystemModelList',params, null);
  return result;
}