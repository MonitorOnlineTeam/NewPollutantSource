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

//参比仪器设备清单 列表
export async function GetTestParamInfoList (params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetTestParamInfoList',params, null);
  return result;
} 

// 操作站点CEMS参数信息
export async function OperationCEMSSystem(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/OperationCEMSSystem', params);
  return result;
}

// 获取参比仪器信息
export async function GetParamList(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetParamList', params);
  return result;
}

// 操作站点参比仪器信息
export async function OperationParam(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/OperationParam', params);
  return result;
}

// 添加或修改调试检测排口
export async function AddOrUpdateTestPoint(params) {
  const result = post('/api/rest/PollutantSourceApi/TaskFormApi/AddOrUpdateTestPoint', params);
  return result;
}	
//添加或修改 监测点
export async function addOrEditCommonPointList(params) {
  const result = post(API.ctAssetManagementApi.AddOrEditCommonPointList, params);
  return result;
}

//获取行业和监测点类型信息
export async function getPointIndustryList(params) {
  const result = post(API.ctAssetManagementApi.GetPointIndustryList, params);
  return result;
}
//获取监测点，系统信息，系统变更信息仪表信息，仪表变更信息
export async function getCEMSSystemList(params) {
  const result = post(API.ctAssetManagementApi.GetCEMSSystemList, params);
  return result;
}
//添加或修改系统型号
export async function addOrEditCEMSSystem(params) {
  const result = post(API.ctAssetManagementApi.AddOrEditCEMSSystem, params);
  return result;
}