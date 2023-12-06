import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';

//运维任务报告 列表
export async function GetOperationReportList(params) {
  const result = await post(API.PredictiveMaintenanceApi.GetOperationReportList, params, null);
  return result;
}
//运维任务报告 生成报告
export async function ExportOperationReport(params) {
  const result = await post(API.PredictiveMaintenanceApi.ExportOperationReport, params, null);
  return result;
}
