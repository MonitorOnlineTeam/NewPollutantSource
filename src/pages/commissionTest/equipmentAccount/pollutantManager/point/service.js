import { post } from '@/utils/request';

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