import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';

//运维信息

export async function getOperateRIHPointList(params) {
  const result = await post(params.isBW? API.VisualKanbanApi.GetBWOperatePointList : API.VisualKanbanApi.GetOperatePointList,params, null);
  return result;
}

//运维信息  导出
export async function exportOperateRIHPointList(params) {
  const result = await post(params.isBW? API.VisualKanbanApi.ExportBWOperatePointList : API.VisualKanbanApi.ExportOperatePointList,params, null);
  return result;
}
