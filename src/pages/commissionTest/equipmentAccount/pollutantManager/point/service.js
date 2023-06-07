import { post } from '@/utils/request';



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
// 获取站点CEMS参数信息 
export async function GetCEMSSystemList(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetCEMSSystemList', params);
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