import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//获取签到考勤查询信息
export async function GetSignInAndOffsiteSignList(params) {
  const result = post(API.CtProjectExecuProgressApi.GetSignInAndOffsiteSignList, params);
  return result;
}

//签到考勤查询信息 导出
export async function ExportSignInAndOffsiteSign(params) {
  const result = post(API.CtProjectExecuProgressApi.ExportSignInAndOffsiteSign, params);
  return result;
}
//工作类型
export async function GetOffWorkType(params) {
  const result = post(API.CtProjectExecuProgressApi.GetOffWorkType, params);
  return result;
}
