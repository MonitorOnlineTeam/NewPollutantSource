import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

// 获取测量参数列表
export async function GetEquipmentParametersInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationBasicApi/GetEquipmentParametersInfo?DGIMN='+params.DGIMN, {}, null);
  return result;
}

// 获取 设定 参数列表
export async function GetEquipmentParameters(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationBasicApi/GetEquipmentParameters?DGIMN='+params.DGIMN, {}, null);
  return result;
}