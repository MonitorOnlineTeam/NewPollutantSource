import { post, get, getNew } from '@/utils/request';


/*** 日志管理 */


//列表
export async function GetSystemExceptionList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetSystemExceptionList',params, null);
  return result;
}

// 删除
export async function DeleteSystemException(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DeleteSystemException',params, null);
  return result;
}


