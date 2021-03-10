import { post, get, getNew } from '@/utils/request';

// 获取测量参数列表
export async function GetEquipmentParametersInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationBasicApi/GetEquipmentParametersInfo?DGIMN='+params.DGIMN, {}, null);
  return result;
}

// 获取下拉列表框中的测量参数
export async function GetParametersInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationBasicApi/GetParametersInfo?PolltantType='+params.PolltantType, {}, null);
  return result;
}

// 添加 or 修改
export async function AddOrUpdateEquipmentParametersInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationBasicApi/AddOrUpdateEquipmentParametersInfo', params, null);
  return result;
}

// 删除
export async function DeleteEquipmentParametersInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationBasicApi/DeleteEquipmentParametersInfo/'+params.ID, {}, null);
  return result;
}