import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';


//运维分析列表
export async function GetOperationRecordAnalyList(params) {
  const result = await post(API.PredictiveMaintenanceApi.GetOperationRecordAnalyList,params, null);
  return result;
}
//运维分析详情列表
export async function GetOperationRecordAnalyInfoList(params) {
  const result = await post(API.PredictiveMaintenanceApi.GetOperationRecordAnalyInfoList,params, null);
  return result;
}
//运维分析列表 导出
export async function ExportOperationRecordAnalyList(params) {
  const result = await post(API.PredictiveMaintenanceApi.ExportOperationRecordAnaly,params, null);
  return result;
}
//运维分析详情列表 导出
export async function ExportOperationRecordAnalyInfoList(params) {
  const result = await post(API.PredictiveMaintenanceApi.ExportOperationRecordAnalyInfo,params, null);
  return result;
}
//获取工单类型
export async function GetTaskTypeList(params) {
  const result = await post(API.PredictiveMaintenanceApi.GetTaskTypeList,params, null);
  return result;
}
