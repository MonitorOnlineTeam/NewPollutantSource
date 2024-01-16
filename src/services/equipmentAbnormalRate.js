import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';

/**
 * 功  能：设备异常率
 * 创建人：jab
 * 创建时间：2021.2.24
 */

//行政区
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



// 获取省、市、监测点完好率和故障率（评估中心）
export async function getStatePointExecptionRateList(params) {
  const result = await post(API.VisualKanbanApi.GetStatePointExecptionRateList,params, null);
  return result;
}
//导出省、市、监测点完好率和故障率（评估中心）
export async function exportStatePointExecptionRateList(params) {
  const result = await post(API.VisualKanbanApi.ExportStatePointExecptionRateList,params, null);
  return result;
}
