import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';

/**
 * 功  能：设备故障率
 * 创建人：jab
 * 创建时间：2021.2.25
 */

//  行政区
export async function regGetFailureRateList(params) {
  const result = await post(API.VisualKanbanApi.GetEquipmentFailureRateList,params, null);
  return result;
}

// 行政区详情
export async function regDetailGetFailureRateList(params) {
  const result = await post(API.VisualKanbanApi.GetEquipmentFailureRateList,params,params, null);
  return result;
}

// 监测点
export async function pointGetFailureRateList(params) {
  const result = await post(API.VisualKanbanApi.GetEquipmentFailureRateList,params,params, null);
  return result;
}


// 导出
export async function exportFailureRateList(params) {
  const result = await post(API.VisualKanbanApi.ExportEquipmentFailureRateList,params, null);
  return result;
}
