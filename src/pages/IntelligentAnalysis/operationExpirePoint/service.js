import { post, get, getNew } from '@/utils/request';

// 获取测量参数列表
export async function GetEquipmentParametersInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationBasicApi/GetEquipmentParametersInfo?DGIMN='+params.DGIMN, {}, null);
  return result;
}

