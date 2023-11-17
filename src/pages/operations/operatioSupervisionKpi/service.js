import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'

/*运维督查KPi */

// 列表
export async function getParamKPIList(params) {
  const result = post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetParamKPIList', params);
  return result;
}
//导出
export async function exportParamKPIList(params) {
  const result = post('/api/rest/PollutantSourceApi/TaskProcessingApi/ExportParamKPIList', params);
  return result;
}
