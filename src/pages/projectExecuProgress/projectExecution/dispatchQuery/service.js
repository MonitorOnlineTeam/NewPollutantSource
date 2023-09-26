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
//派单查询 服务填报内容  验收服务报告
export async function getAcceptanceServiceRecord(params) {
  const result = post(API.ProjectExecuProgressApi.GetAcceptanceServiceRecord, params);
  return result;
}
//派单查询 服务填报内容  现场勘查信息 等信息
export async function getPublicRecord(params) {
  const result = post(API.ProjectExecuProgressApi.GetPublicRecord, params);
  return result;
}
//派单查询 服务填报内容   工作记录
export async function getWorkRecord(params) {
  const result = post(API.ProjectExecuProgressApi.GetWorkRecord, params);
  return result;
}
//派单查询 服务填报内容   安装照片
export async function getInstallationPhotosRecord(params) {
  const result = post(API.ProjectExecuProgressApi.GetInstallationPhotosRecord, params);
  return result;
}
//派单查询 服务填报内容  参数设置照片
export async function getParameterSettingsPhotoRecord(params) {
  const result = post(API.ProjectExecuProgressApi.GetParameterSettingsPhotoRecord, params);
  return result;
}
//派单查询 服务填报内容  配合检查
export async function getCooperateRecord(params) {
  const result = post(API.ProjectExecuProgressApi.GetCooperateRecord, params);
  return result;
}

//派单查询 服务填报内容  维修记录
export async function getRepairRecord(params) {
  const result = post(API.ProjectExecuProgressApi.GetRepairRecord, params);
  return result;
}
//派单信息  导出
export async function exportServiceDispatch(params) {
  const result = post(API.ProjectExecuProgressApi.ExportServiceDispatch, params);
  return result;
}

