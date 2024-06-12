import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//获取现场签到统计信息
export async function GetSignInList(params) {
  const result = post(API.PerformanceApi.GetSignInList, params);
  return result;
}
//现场签到统计信息 导出
export async function ExportSignInList(params) {
  const result = post(API.PerformanceApi.ExportSignInList, params);
  return result;
}
//获取打卡类型
export async function GetSignInType(params) {
  const result = post(API.PerformanceApi.GetSignInType, params);
  return result;
}
