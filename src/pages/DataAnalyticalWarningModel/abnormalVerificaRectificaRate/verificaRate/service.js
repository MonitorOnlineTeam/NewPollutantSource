import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//异常精准识别核实率 列表
export async function getOperationPlanTaskList(params) {
  const result = post(API.ProjectExecuProgressApi.GetOperationPlanTaskList, params);
  return result;
}

//异常精准识别核实率 导出
export async function exportOperationPlanTaskList(params) {
  const result = post(API.ProjectExecuProgressApi.ExportOperationPlanTaskList, params);
  return result;
}


