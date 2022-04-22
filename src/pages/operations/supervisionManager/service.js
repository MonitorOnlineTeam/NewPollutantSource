import { post, get, getNew } from '@/utils/request';

//列表
export async function GetInspectorOperationManageList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetInspectorOperationManageList',params, null);
  return result;
}
//获取单个督查表实体
export async function GetInspectorOperationInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetInspectorOperationInfoList?ID='+params.ID,params, null);
  return result;
}

//获取单个排口默认值
export async function GetPointParames(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetPointParames?DGIMN='+params.DGIMN,params, null);
  return result;
}
