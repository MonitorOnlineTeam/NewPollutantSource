import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';

//运维信息 耗材统计详情

export async function getOperateRIHPointList(params) {
  const result = await post(API.VisualKanbanApi.GetOperatePointList,params, null);
  return result;
}

//运维信息 耗材统计详情 导出
export async function exportOperateRIHPointList(params) {
  const result = await post(API.VisualKanbanApi.ExportOperatePointList,params, null);
  return result;
}
