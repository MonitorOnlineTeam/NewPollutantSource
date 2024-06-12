import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';

// 耗材统计 行政区
export async function regGetConsumablesRIHList(params) {
  const result = await post(API.VisualKanbanApi.GetConsumablesStatisticsInfo,params, null);
  return result;
}

// 耗材统计 行政区详情
export async function regDetailGetConsumablesRIHList(params) {
  const result = await post(API.VisualKanbanApi.GetConsumablesStatisticsInfo,params, null);
  return result;
}

// 耗材统计 监测点
export async function pointGetConsumablesRIHList(params) {
  const result = await post(API.VisualKanbanApi.GetConsumablesStatisticsInfo,params, null);
  return result;
}

// 耗材统计  汇总
export async function summaryGetConsumablesRIHList(params) {
  const result = await post(API.VisualKanbanApi.GetConsumablesStatisticsInfo,params, null);
  return result;
}

// 耗材统计  明细
export async function detailedGetConsumablesRIHList(params) {
  const result = await post(API.VisualKanbanApi.GetConsumablesStatisticsInfo,params, null);
  return result;
}


// 耗材统计  导出
export async function exportConsumablesRIHList(params) {
  const result = await post(API.VisualKanbanApi.ExportConsumablesStatisticsInfo,params, null);
  return result;
}



