import { post, get, getNew } from '@/utils/request';

// 耗材统计 行政区
export async function regGetConsumablesRIHList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetConsumablesRIHList',params, null);
  return result;
}

// 耗材统计 行政区详情
export async function regDetailGetConsumablesRIHList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetConsumablesRIHList',params, null);
  return result;
}

// 耗材统计 监测点
export async function pointGetConsumablesRIHList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetConsumablesRIHList',params, null);
  return result;
}