
/**
 * 功  能：排污税统计接口
 * 创建人：吴建伟
 * 创建时间：2019.10.14
 */

import { post, get } from '@/utils/request';
import { API } from '@config/API'
import { async } from 'q';



/**
 * 获取排污税表格列头（污染物）
 */
export async function getEffluentFeeTableColumns(params) {
  const result = await get('/api/rest/PollutantSourceApi/EffluentFeeApi/GetEffluentFeeTableColumns', params);

  return result;
}

/**
* 获取所有监控目标排污税列表
*/
export async function getEffluentFeeForAllTarget(params) {

  const result = await get('/api/rest/PollutantSourceApi/EffluentFeeApi/GetEffluentFeeForAllTarget', params);

  return result;
}

/**
* 获取单个监控目标每个月份排污税列表（某个时间段每个月份）
*/
export async function getEffluentFeeForSingleTargetMonths(params) {

  const result = await get('/api/rest/PollutantSourceApi/EffluentFeeApi/GetEffluentFeeForSingleTargetMonths', params);

  return result;
}

/**
* 获取所有监控点排污税列表
*/
export async function getEffluentFeeForAllPoint(params) {

  const result = await get('/api/rest/PollutantSourceApi/EffluentFeeApi/GetEffluentFeeForAllPoint', params);

  return result;
}

