import { post, get, getNew } from '@/utils/request';

/**
 * 功  能：设备异常率
 * 创建人：jab
 * 创建时间：2021.2.24
 */

//  行政区
export async function regGetExecptionRateList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetExecptionRateList',params, null);
  return result;
}

// 行政区详情
export async function regDetailGetExecptionRateList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetExecptionRateList',params, null);
  return result;
}

// 监测点
export async function pointGetExecptionRateList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetExecptionRateList',params, null);
  return result;
}


