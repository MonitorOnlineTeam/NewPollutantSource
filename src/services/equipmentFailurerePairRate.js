import { post, get, getNew } from '@/utils/request';

/**
 * 功  能：设备故障修复率
 * 创建人：jab
 * 创建时间：2021.2.25
 */

//  行政区
export async function regGetRepairRateList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetRepairRateList',params, null);
  return result;
}

// 行政区详情
export async function regDetailGetRepairRateList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetRepairRateList',params, null);
  return result;
}

// 监测点
export async function pointGetRepairRateList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetRepairRateList',params, null);
  return result;
}


