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
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeList', {
    ...params,
    pollutantCodes: sessionStorage.getItem('sysPollutantCodes') || params.pollutantCodes
  }, null);
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

// 综合指数范围同比报表
export async function queryCompositeyoyRangeData(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/GetTimeSlotCompositeCompare', params, null);
  return result;
}

// 综合指数范围同比报表 - 导出
export async function exportCompositeyoyRangeData(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/ExportTimeSlotCompositeCompareNum', params, null);
  return result;
}

// 获取综合指数对比报表数据
export async function queryCompositeRangeContrastData(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/GetTimeComparisonComposite', params, null);
  return result;
}

// 导出综合指数对比报表数据
export async function exportCompositeRangeContrast(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/ExportTimeComparisonCompositeNum', params, null);
  return result;
}

// 获取优良天数报表 - 数据
export async function getExcellentDaysReport(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/GetExcellentDays', params, null);
  return result;
}

// 优良天数报表 - 导出
export async function excellentDaysExportReport(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/ExportExcellentDays', params, null);
  return result;
}

// 获取空气质量日排名 - 数据
export async function getAirDayRank(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/GetAirRank', params, null);
  return result;
}

// 空气质量日排名 - 导出
export async function exportAirDayRank(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/ExportAirRank', params, null);
  return result;
}


// 获取累计综合空气质量排名 - 数据
export async function getAddUpAirRank(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/GetCumulativeAirRank', params, null);
  return result;
}

// 累计综合空气质量排名 - 导出
export async function exportAddUpAirRank(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/ExportCumulativeAirRank', params, null);
  return result;
}

// 站点平局值对比分析
export async function getCompareWater(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/getCompareWater', params, null);
  return result;
}






