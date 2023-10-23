import { post, get, getNew } from '@/utils/request';


/*** 日志管理 */


//异常日志 列表
export async function GetSystemExceptionList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetSystemExceptionList',params, null);
  return result;
}
