import { post, get, getNew } from '@/utils/request';

//列表
export async function GetInspectorOperationManageList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetInspectorOperationManageList',params, null);
  return result;
}