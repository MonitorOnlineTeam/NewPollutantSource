import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'

/*运维督查KPI */

// 列表
export async function getParamKPIList(params) {
  const result = post(API.SupervisionVerificaApi.GetParamKPIList, params);
  return result;
}
//导出
export async function exportParamKPIList(params) {
  const result = post(API.SupervisionVerificaApi.ExportParamKPIList, params);
  return result;
}
