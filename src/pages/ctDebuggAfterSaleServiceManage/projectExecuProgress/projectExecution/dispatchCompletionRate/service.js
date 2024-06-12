import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//派单完成率信息
export async function GetCTServiceDispatchRateList(params) {
  const result = post(API.CtProjectExecuProgressApi.GetCTServiceDispatchRateList, params);
  return result;
}

//派单完成率 导出
export async function ExportCTServiceDispatchRateList(params) {
  const result = post(API.CtProjectExecuProgressApi.ExportCTServiceDispatchRateList, params);
  return result;
}
