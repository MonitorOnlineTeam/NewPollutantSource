import { post, get, getNew } from '@/utils/request';

// 获取污染物类型 - 表头
export async function getPollutantList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeCode', params, null);
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
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeList', {
    ...params,
    pollutantCodes: sessionStorage.getItem('sysPollutantCodes') || params.pollutantCodes
  }, null);
  return result === null ? { data: null } : result;
}

/**
 * 获取企业
 */
export async function getEnterpriseList(params) {
  const result = await post(`/api/rest/PollutantSourceApi/MonitorTargetApi/GetTargetList?regionCode=${params.regionCode}&pollutantTypeCode=${params.pollutantTypeCode}`, {}, null);
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
 * 获取上报数据月报
 */
export async function getStatisticsReportDataList(params) {
 
  const result = await post('/api/rest/PollutantSourceApi/DataReportApi/GetStatisticsReportDataList', params, null);
  return result === null ? { data: null } : result;
}

/**
 * 获取上报数据月报
 */
export async function getEntSewageList(params) {
 
  const result = await post('/api/rest/PollutantSourceApi/DataReportApi/GetEntSewageList', params, null);
  return result === null ? { data: null } : result;
}

/**
 * 导出上报数据月报
 */
export async function getStatisticsReportDataExcel(params) {
 
  const result = await post('/api/rest/PollutantSourceApi/DataReportApi/GetStatisticsReportDataExcel', params, null);
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

/**
 * 获取企业及排口
 */
export async function getEntAndPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEntAndPoint', {
    ...params,
    PollutantTypes: sessionStorage.getItem('sysPollutantCodes') || params.PollutantTypes
  }, null);
  return result;
}

/**
 * 获取企业及排口
 */
export async function getSmokeReportData(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetAllTypeDataListGas', params, null);
  return result;
}

/**
 * 烟气报表导出
 */
export async function exportSmokeReport(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/ExportAllTypeDataListGas', params, null);
  return result;
}


// 二氧化碳 - 获取企业列表
export async function getEntByRegionAndAtt(params) {
  const result = post('/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetEntByRegionAndAtt', params, null)
  return result
}


