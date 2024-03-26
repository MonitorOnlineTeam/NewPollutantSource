import { post } from '@/utils/request';
import { API } from '@config/API'



//节点服务
export async function GetCompleteNodeServerAnalysis(params) {
  const result = post(API.AfterSalesServiceManageApi.GetCompleteNodeServerAnalysis, params);
  return result;
}

//节点服务 导出
export async function ExportCompleteNodeServerAnalysis(params) {
  const result = post(API.AfterSalesServiceManageApi.ExportCompleteNodeServerAnalysis, params);
  return result;
}

//收费服务
export async function GetChargeServiceAnalysis(params) {
  const result = post(API.AfterSalesServiceManageApi.GetChargeServiceAnalysis, params);
  return result;
}
//收费服务  导出
export async function ExportChargeServiceAnalysis(params) {
  const result = post(API.AfterSalesServiceManageApi.ExportChargeServiceAnalysis, params);
  return result;
}
//赠送服务
export async function GetGiveServerAnalysis(params) {
  const result = post(API.AfterSalesServiceManageApi.GetGiveServerAnalysis, params);
  return result;
}
//赠送服务  导出
export async function ExportGiveServerAnalysis(params) {
  const result = post(API.AfterSalesServiceManageApi.ExportGiveServerAnalysis, params);
  return result;
}
//配合其它工作
export async function GetCooperateOtherWorkAnalysis(params) {
  const result = post(API.AfterSalesServiceManageApi.GetCooperateOtherWorkAnalysis, params);
  return result;
}
//配合其它工作  导出
export async function ExportCooperateOtherWorkAnalysis(params) {
  const result = post(API.AfterSalesServiceManageApi.ExportCooperateOtherWorkAnalysis, params);
  return result;
}
//配合检查
export async function GetCooperateInspectionAnalysis(params) {
  const result = post(API.AfterSalesServiceManageApi.GetCooperateInspectionAnalysis, params);
  return result;
}
//配合检查  导出
export async function ExportCooperateInspectionAnalysis(params) {
  const result = post(API.AfterSalesServiceManageApi.ExportCooperateInspectionAnalysis, params);
  return result;
}

// 服务详情
export async function GetServiceDispatchForAnalysis(params) {
  const result = post(API.AfterSalesServiceManageApi.GetServiceDispatchForAnalysis, params);
  return result;
}
// 服务详情 导出
export async function ExportServiceDispatchForAnalysis(params) {
  const result = post(API.AfterSalesServiceManageApi.ExportServiceDispatchForAnalysis, params);
  return result;
}
// 获取服务大区
export async function GetLargeRegionList(params) {
  const result = post(API.AfterSalesServiceManageApi.GetLargeRegionList, params);
  return result;
}