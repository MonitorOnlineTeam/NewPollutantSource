import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API';

//督查总结的督查类别
export async function GetInspectorCodeList(params) {
  const result = await post(API.SupervisionVerificaApi.GetSupervisionTypeList,params, null);
  return result;
}
//列表 督查总结
export async function GetInspectorSummaryList(params) {
  const result = await post(API.SupervisionVerificaApi.GetSupervisionSummaryList,params, null);
  return result;
}

//导出 督查总结
export async function ExportInspectorSummaryList(params) {
  const result = await post(API.SupervisionVerificaApi.ExportSupervisionSummaryList,params, null);
  return result;
}
//列表 督查总结---按省统计
export async function GetInspectorSummaryForRegionList(params) {
  const result = await post(API.SupervisionVerificaApi.GetInspectorSummaryForRegionList,params, null);
  return result;
}

 
//导出 督查总结---按省统计
export async function ExportInspectorSummaryForRegion(params) {
  const result = await post(API.SupervisionVerificaApi.ExportInspectorSummaryForRegion,params, null);
  return result;
}

//列表 关键参数督查汇总
export async function GetRemoteSummaryList(params) {
  const result = await post(API.SupervisionVerificaApi.GetKeyParameterSummaryList,params, null);
  return result;
}
 
//导出 关键参数督查汇总
export async function ExportRemoteSummaryList(params) {
  const result = await post(API.SupervisionVerificaApi.ExportKeyParameterSummaryList,params, null);
  return result;
}

//列表 全系统督查汇总 点位统计2
export async function GetOperationManageSummaryList(params) {
  const result = await post(API.SupervisionVerificaApi.GetSystemFacilityVerificationSummaryList,params, null);
  return result;
}

 
//导出 全系统督查汇总 点位统计2
export async function ExportOperationManageSummaryList(params) {
  const result = await post(API.SupervisionVerificaApi.ExportSystemFacilityVerificationSummaryList,params, null);
  return result;
}

//列表 全系统督查汇总 问题统计
export async function GetOperationManageSummaryTypeList(params) {
  const result = await post(API.SupervisionVerificaApi.GetOperationManageSummaryTypeList,params, null);
  return result;
}
//导出 全系统督查汇总 问题统计
export async function ExportOperationManageSummaryType(params) {
  const result = await post(API.SupervisionVerificaApi.ExportOperationManageSummaryType,params, null);
  return result;
}
//列表 全系统督查汇总 点位统计1
export async function GetOperationManageSummaryListNew(params) {
  const result = await post(API.SupervisionVerificaApi.GetOperationManageSummaryListNew,params, null);
  return result;
}
//导出 全系统督查汇总 点位统计1
export async function ExportOperationManageSummaryListNew(params) {
  const result = await post(API.SupervisionVerificaApi.ExportOperationManageSummaryListNew,params, null);
  return result;
}