import { post, get, getNew } from '@/utils/request';


/*** 日志管理 */


//异常日志 列表
export async function GetSystemExceptionList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetSystemExceptionList',params, null);
  return result;
}

//异常日志 删除
export async function DeleteSystemException(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DeleteSystemException',params, null);
  return result;
}

//登录日志 列表
export async function GetSystemLongInLogs(params) {
  const result = await post('/api/rest/PollutantSourceApi/AuthorApi/GetSystemLongInLogs',params, null);
  return result;
}
//登录日志 删除
export async function DeleteSystemLongInLogs(params) {
  const result = await post('/api/rest/PollutantSourceApi/AuthorApi/DeleteSystemLongInLogs',params, null);
  return result;
}


//操作日志 列表
export async function GetUserOprationLogsList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetUserOprationLogsList',params, null);
  return result;
}
//操作日志 删除
export async function DeleteUserOprationLogs(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DeleteUserOprationLogs',params, null);
  return result;
}

