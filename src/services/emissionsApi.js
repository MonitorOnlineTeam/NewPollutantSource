/* eslint-disable import/prefer-default-export */
/**
 * 功  能：排放量统计接口
 * 创建人：吴建伟
 * 创建时间：2019.09.25
 */

import { post, get } from '@/utils/request';
import { async } from 'q';



/**
 * 【企业】根据因子、年份获取所有月份企业的排放总量
 * @params {"BeginTime": "2019-01-01 00:00:00","EndTime": "2020-01-01 00:00:00","PollutantCodes": ["01"]}
 */
export async function getAllMonthEntPollutantEmissions(params) {
  const result = await post('/api/rest/PollutantSourceApi/EmissionsApi/GetAllMonthEntPollutantEmissions', params);

  return result;
}

/**
* 【企业】根据因子、月份获取所有企业指定月企业的排放总量
* @params {"MonthTime": "2019-09-01 00:00:00","PollutantCodes": ["01"]}
*/
export async function getSingleMonthEntPollutantEmissions(params) {

  const result = await post('/api/rest/PollutantSourceApi/EmissionsApi/GetSingleMonthEntPollutantEmissions', params);

  return result;
}

/**
* 【排口】根据企业、因子、年份获取所有月份排口的排放总量
* @params {"BeginTime": "2019-01-01 00:00:00","EndTime": "2020-01-01 00:00:00","EnterpriseCodes": ["09411654"],"PollutantCodes": ["01"]}
*/
export async function getAllMonthPointPollutantEmissions(params) {

  const result = await post('/api/rest/PollutantSourceApi/EmissionsApi/GetAllMonthPointPollutantEmissions', params);

  return result;
}

/**
* 【排口】根据企业、因子、月份获取所有排口的排放总量
* @params {"MonthTime": "2019-09-01 00:00:00","EnterpriseCodes": ["09411654"],"PollutantCodes": ["01"]}
*/
export async function getSingleMonthAllPointEmissions(params) {

  const result = await post('/api/rest/PollutantSourceApi/EmissionsApi/GetSingleMonthAllPointEmissions', params);

  return result;
}

/**
* 【排口】根据企业、因子、月份、排口获取单个排口每一天的排放总量
* @params {"MonthTime": "2019-09-01 11:11:31","DGIMN": "62020131jhdj03","EnterpriseCodes": ["09411654"],"PollutantCodes": ["01"]}
*/
export async function getSinglePointDaysEmissions(params) {

  const result = await post('/api/rest/PollutantSourceApi/EmissionsApi/GetSinglePointDaysEmissions', params);

  return result;
}
