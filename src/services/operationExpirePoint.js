import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';

// 运维到期点位统计
export async function GetOperationExpirePointList(params) {
  const result = await post(API.PredictiveMaintenanceApi.GetOperationExpireAnalysis, params, null);
  return result;
}

//导出
export async function ExportOperationExpirePointList(params) {
  const result = await post(API.PredictiveMaintenanceApi.ExportOperationExpireAnalysis, params, null);
  return result;
}

