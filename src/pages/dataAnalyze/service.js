import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

// 获取污染物
export async function getPollutantList(params) {
  const result = await post(API.commonApi.GetAirOrDustPollutantAQI, params, null);
  return result;
}

// 获取单站多参图表及表格数据
export async function getChartAndTableData(params) {
  const result = await post(API.AirDataApi.GetAirPointData, params, null);
  return result;
}

// 单站多参图表及表格数据 - 导出
export async function exportData(params) {
  const result = await post(API.AirDataApi.ExportAirPointData, params, null);
  return result;
}

/**
 * 获取系统污染物
 */
export async function getPollutantTypeList(params) {
  const result = await post(API.commonApi.GetPollutantTypeList, {
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
  const result = await post(API.AirDataApi.GetDataAcquisitionRateColumn, params, null);
  return result;
}

// 获取数据获取率 - table数据
export async function getDataGainRateTableData(params) {
  const result = await post(API.AirDataApi.GetDataAcquisitionRate, params, null);
  return result;
}

// 获取数据获取率 - 详情污染物数据
export async function getDataGainRateDetailPollutantList(params) {
  const result = await post(API.commonApi.GetPollutantListByDgimn, params, null);
  return result;
}

// 获取数据获取率 - table数据
export async function queryhistorydatalist(params) {
  const result = await post(API.MonitorDataApi.GetAllTypeDataList, params);
  return result === null ? { data: null } : result;
}


// 报表数据
export async function getGasReport(params) {
  const result = await post(API.AirDataApi.GetAirQualityDayReport, params);
  return result === null ? { data: null } : result;
}

// 报表数据
export async function exportGasReport(params) {
  const result = await post(API.AirDataApi.ExportGetAirQualityDayReport, params);
  return result === null ? { data: null } : result;
}

// 获取综合指数月报
export async function getMonthComposite(params) {
  const result = post(API.AirDataApi.GetMonthComposite, params, null);
  return result;
}

// 获取综合指数年报
export async function getYearComposite(params) {
  const result = post(API.AirDataApi.GetYearComposite, params, null);
  return result;
}

// 导出综合指数月报
export async function exportMonthComposite(params) {
  const result = post(API.AirDataApi.ExportMonthCompositeNum, params, null);
  return result;
}

// 导出综合指数年报
export async function exportYearComposite(params) {
  const result = post(API.AirDataApi.ExportYearCompositeNum, params, null);
  return result;
}

// 综合指数范围报表
export async function queryCompositeRangeData(params) {
  const result = post(API.AirDataApi.GetTimeSlotComposite, params, null);
  return result;
}
// 导出综合指数范围报表
export async function exportRangeCompositeReport(params) {
  const result = post(API.AirDataApi.ExportTimeSlotCompositeNum, params, null);
  return result;
}

// 综合指数范围同比报表
export async function queryCompositeyoyRangeData(params) {
  const result = post(API.AirDataApi.GetTimeSlotCompositeCompare, params, null);
  return result;
}

// 综合指数范围同比报表 - 导出
export async function exportCompositeyoyRangeData(params) {
  const result = post(API.AirDataApi.ExportTimeSlotCompositeCompareNum, params, null);
  return result;
}

// 获取综合指数对比报表数据
export async function queryCompositeRangeContrastData(params) {
  const result = post(API.AirDataApi.GetTimeComparisonComposite, params, null);
  return result;
}

// 导出综合指数对比报表数据
export async function exportCompositeRangeContrast(params) {
  const result = post(API.AirDataApi.ExportTimeComparisonCompositeNum, params, null);
  return result;
}

// 获取优良天数报表 - 数据
export async function getExcellentDaysReport(params) {
  const result = post(API.AirDataApi.GetExcellentDays, params, null);
  return result;
}

// 优良天数报表 - 导出
export async function excellentDaysExportReport(params) {
  const result = post(API.AirDataApi.ExportExcellentDays, params, null);
  return result;
}

// 获取空气质量日排名 - 数据
export async function getAirDayRank(params) {
  const result = post(API.AirDataApi.GetAirDayDataRank, params, null);
  return result;
}

// 空气质量日排名 - 导出
export async function exportAirDayRank(params) {
  const result = post(API.AirDataApi.ExportAirDayDataRank, params, null);
  return result;
}


// 获取累计综合空气质量排名 - 数据
export async function getAddUpAirRank(params) {
  const result = post(API.AirDataApi.GetCumulativeAirRank, params, null);
  return result;
}

// 累计综合空气质量排名 - 导出
export async function exportAddUpAirRank(params) {
  const result = post(API.AirDataApi.ExportCumulativeAirRank, params, null);
  return result;
}

// 站点平局值对比分析
export async function getCompareWater(params) {
  const result = post('/api/rest/PollutantSourceApi/ReportApi/getCompareWater', params, null);
  return result;
}

// 获取监测同比分析数据--功率相关
export async function GetPowerWork(params) {
  const result = post(API.ElectricEnergyApi.GetPowerWork, params, null);
  return result;
}

// 获取电能环比
export async function GetPowerCompare(params) {
  const result = post(API.ElectricEnergyApi.GetPowerCompare, params, null);
  return result;
}

// 获取电能趋势
export async function GetPowerTrend(params) {
  const result = post(API.ElectricEnergyApi.GetPowerTrend, params, null);
  return result;
}






