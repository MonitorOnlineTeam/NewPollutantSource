import { post } from '@/utils/request';
import { API } from '@config/API'



// 获取系统信息列表 
export async function TestGetSystemModelList(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/TestGetSystemModelList', params);
  return result;
}

// 获取设备信息列表
export async function GetTestEquipmentInfoList(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetTestEquipmentInfoList', params);
  return result;
}


//添加或修改 监测点
export async function addOrEditCommonPointList(params) {
  const result = post(API.CtAssetManagementApi.AddOrEditCommonPointList, params);
  return result;
}

//获取行业和监测点类型信息
export async function getPointIndustryList(params) {
  const result = post(API.CtAssetManagementApi.GetPointIndustryList, params);
  return result;
}
//获取监测点，系统信息，系统变更信息仪表信息，仪表变更信息
export async function getCEMSSystemList(params) {
  const result = post(API.CtAssetManagementApi.GetCEMSSystemList, params);
  return result;
}
//添加或修改系统型号
export async function addOrEditCEMSSystem(params) {
  const result = post(API.CtAssetManagementApi.AddOrEditCEMSSystem, params);
  return result;
}
//添加或修改系统更换记录
export async function addOrEditCEMSSystemChange(params) {
  const result = post(API.CtAssetManagementApi.AddOrEditCEMSSystemChange, params);
  return result;
}
//添加或修改仪表信息
export async function addOrEditEquipment(params) {
  const result = post(API.CtAssetManagementApi.AddOrEditEquipment, params);
  return result;
}
//添加或修改仪表更换记录
export async function addOrEditEquipmentChange(params) {
  const result = post(API.CtAssetManagementApi.AddOrEditEquipmentChange, params);
  return result;
}

//监测点排序
export async function pointSort(params) {
  const result = post(API.CtAssetManagementApi.PointSort, params);
  return result;
}

