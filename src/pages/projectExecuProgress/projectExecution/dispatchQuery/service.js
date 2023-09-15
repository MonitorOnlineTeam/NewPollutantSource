import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//派单信息查询
export async function getServiceDispatch(params) {
  const result = post(API.ProjectExecuProgressApi.GetServiceDispatch, params);
  return result;
}

//派单查询 服务填报内容 要加载的项
export async function getServiceDispatchTypeAndRecord(params) {
  const result = post(API.ProjectExecuProgressApi.GetServiceDispatchTypeAndRecord, params);
  return result;
}
//派单查询 服务填报内容 详情内容
export async function getAcceptanceServiceRecord(params) {
  const result = post(API.ProjectExecuProgressApi.GetAcceptanceServiceRecord, params);
  return result;
}
