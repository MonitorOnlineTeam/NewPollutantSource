import { post, get, getNew } from '@/utils/request';

// 获取污染物类型 - 表头
export async function getPollutantList(params) {
  const result = await post('/api/rest/PollutantSourceApi/DataList/GetPollutantTypeCode', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取站点日报数据
export async function getSiteDailyDayReport(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetDayReport', params, null);
  return result === null ? {
    data: null
  } : result;
}

/**
 * 获取系统污染物
 */
export async function getPollutantTypeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeList', params, null);
  return result === null ? { data: null } : result;
}

/**
 * 获取企业
 */
export async function getEnterpriseList(params) {
  const result = await get('/api/rest/PollutantSourceApi/AutoFormDataApi/GetListPager', params, null);
  return result === null ? { data: null } : result;
}

/**
 * 获取汇总日报数据
 */
export async function getDailySummaryList(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetSummaryDayReport', params, null);
  return result === null ? { data: null } : result;
}

/**
 * 报表导出
 */
export async function reportExcel(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetReportExcel', params, null);
  return result === null ? { data: null } : result;
}

/**
 * 汇总报表导出
 */
export async function summaryReportExcel(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetSummaryReportExcel', params, null);
  return result === null ? { data: null } : result;
}

/**
 * 获取站点月报数据
 */
export async function getMonthlyReport(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetMonthReport', params, null);
  return result === null ? { data: null } : result;
}

/**
 * 获取站点年报表
 */
export async function getAnnalsReport(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetYearReport', params, null);
  return result === null ? { data: null } : result;
}

/**
 * 获取汇总月报数据
 */
export async function getSummaryMonthReport(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetSummaryMonthReport', params, null);
  return result === null ? { data: null } : result;
}

/**
 * 获取汇总年报数据
 */
export async function getSummaryYearReport(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetSummaryYearReport', params, null);
  return result === null ? { data: null } : result;
}

