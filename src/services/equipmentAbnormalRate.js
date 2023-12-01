import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';

/**
 * 功  能：设备异常率
 * 创建人：jab
 * 创建时间：2021.2.24
 */

//  行政区
export async function regGetExecptionRateList(params) {
  const result = await post(API.VisualKanbanApi.GetEquipmentExecptionRateList,params, null);
  return result;
}

// 行政区详情
export async function regDetailGetExecptionRateList(params) {
  const result = await post(API.VisualKanbanApi.GetEquipmentExecptionRateList,params, null);
  return result;
}

// 监测点
export async function pointGetExecptionRateList(params) {
  const result = await post(API.VisualKanbanApi.GetEquipmentExecptionRateList,params, null);
  return result;
}

//导出
export async function exportExecptionRateList(params) {
  const result = await post(API.VisualKanbanApi.ExportEquipmentExecptionRateList,params, null);
  return result;
}
