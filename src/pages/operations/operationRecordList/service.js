import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';

//运维记录列表
export async function GetOperationRecordListByDGIMN(params) {
  const result = await post(API.PredictiveMaintenanceApi.GetOperationRecordListByDGIMN,params, null);
  return result;
}
//运维记录列表 导出
export async function ExportOperationRecordListByDGIMN(params) {
  const result = await post(API.PredictiveMaintenanceApi.ExportOperationRecordListByDGIMN,params, null);
  return result;
}
//获取工单类型
export async function GetTaskTypeList(params) {
  const result = await post(API.PredictiveMaintenanceApi.GetTaskTypeList,params, null);
  return result;
}