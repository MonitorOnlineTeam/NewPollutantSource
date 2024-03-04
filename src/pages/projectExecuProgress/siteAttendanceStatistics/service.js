import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//获取现场签到统计信息
export async function GetSignInAnalysis(params) {
  const result = post(API.CtProjectExecuProgressApi.GetSignInAnalysis, params);
  return result;
}

//现场签到统计信息 导出
export async function ExportSignInAnalysis(params) {
  const result = post(API.CtProjectExecuProgressApi.ExportSignInAnalysis, params);
  return result;
}
//获取现场签到统计详情信息
export async function GetSignInAnalysisInfo(params) {
  const result = post(API.CtProjectExecuProgressApi.GetSignInAnalysisInfo, params);
  return result;
}
//获取现场签到统计详情信息 导出
export async function ExportSignInAnalysisInfo(params) {
  const result = post(API.CtProjectExecuProgressApi.ExportSignInAnalysisInfo, params);
  return result;
}
