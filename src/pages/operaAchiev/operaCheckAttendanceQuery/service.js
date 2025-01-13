import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//获取签到考勤查询信息
export async function GetSignInAndOffsiteSignList(params) {
  const result = post(API.PerformanceApi.GetSignInAndOffsiteSignList, params);
  return result;
}
//获取所有工作类型  运维+成套
export async function GetAllWorkTypeList(params) {
  const result = post(API.PerformanceApi.GetAllWorkTypeList, params);
  return result;
}

//签到考勤查询信息 导出
export async function ExportSignInAndOffsiteSign(params) {
  const result = post(API.PerformanceApi.ExportSignInAndOffsiteSign, params);
  return result;
}



