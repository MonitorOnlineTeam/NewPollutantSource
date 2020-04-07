import { post, get, getNew } from '@/utils/request';

// 获取污染物
export async function getPollutantList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantList', params, null);
  return result;
}

// 获取单站多参图表及表格数据
export async function getChartAndTableData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetDataForGasPoint', params, null);
  return result;
}

// 获取单站多参图表及表格数据
export async function exportData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportDataForGasPoint', params, null);
  return result;
}

/**
 * 获取系统污染物
 */
export async function getPollutantTypeList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeList', params, null);
  return result;
}

/**
 * 获取企业
 */
export async function getEnterpriseList(params) {
  const result = await post(`/api/rest/PollutantSourceApi/MonitorTargetApi/GetTargetList?regionCode=${params.regionCode}&pollutantTypeCode=${params.pollutantTypeCode}`, {}, null);
  return result;
}

// 获取数据获取率 - 表头
export async function getDataGainRateColumn(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetDataAcquisitionRateColumn', params, null);
  return result;
}

// 获取数据获取率 - table数据
export async function getDataGainRateTableData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetDataAcquisitionRate', params, null);
  return result;
}

// 获取数据获取率 - 详情污染物数据
export async function getDataGainRateDetailPollutantList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantListByDgimn', params, null);
  return result;
}

// 获取数据获取率 - table数据
export async function queryhistorydatalist(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetAllTypeDataList', params);
  return result === null ? { data: null } : result;
}


// 报表数据
export async function getGasReport(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetGasReport', params);
  return result === null ? { data: null } : result;
}

// 报表数据
export async function exportGasReport(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportGasReport', params);
  return result === null ? { data: null } : result;
}

// 获取综合指数月报
export async function getMonthComposite(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/GetMonthComposite', params, null);
  return result;
}

// 获取综合指数年报
export async function getYearComposite(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/GetYearComposite', params, null);
  return result;
}

// 导出综合指数月报
export async function exportMonthComposite(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/ExportMonthCompositeNum', params, null);
  return result;
}

// 导出综合指数年报
export async function exportYearComposite(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/ExportYearCompositeNum', params, null);
  return result;
}

// 综合指数范围报表
export async function queryCompositeRangeData(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/GetTimeSlotComposite', params, null);
  return result;
}
// 导出综合指数范围报表
export async function exportRangeCompositeReport(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/ExportTimeSlotCompositeNum', params, null);
  return result;
}








