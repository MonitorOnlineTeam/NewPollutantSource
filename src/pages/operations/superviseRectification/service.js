import { post, get, getNew } from '@/utils/request';

//督查整改 列表
export async function GetInspectorRectificationManageList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetInspectorRectificationManageList',params, null);
  return result;
}


//督查整改 详情
export async function GetInspectorRectificationView(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetInspectorRectificationView/'+params.ID ,params, null);
  return result;
}

//督查整改 导出
export async function ExportInspectorRectificationManageList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ExportInspectorRectificationManageList',params, null);
  return result;
}
//更新 督查整改状态
export async function UpdateRectificationStatus(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/UpdateRectificationStatus',params, null);
  return result;
}

