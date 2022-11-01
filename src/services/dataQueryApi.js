import { post } from '@/utils/request';
import { API } from '@config/API'

// 获取数据获取率 - 详情污染物数据
export async function getDataGainRateDetailPollutantList(params) {
  const result = await post(API.commonApi.GetPollutantListByDgimn, params);
  return result;
}

// 获取数据
export async function getAllTypeDataForFlag(params) {
  const result = await post(API.MonitorDataApi.GetAllTypeDataForFlag, {
    IsWry: false,
    ...params
  }, null);
  return result;
}

// 修改数据标识
export async function updateDataFlag(params) {
  const result = await post(API.MonitorDataApi.UpdateDataAirFlag, params, null);
  return result;
}

// 修改数据标识
export async function exportDataAuditReport(params) {
  const result = await post(API.MonitorDataApi.ExportAllTypeDataForFlag, {
    IsWry: false,
    ...params
  }, null);
  return result;
}

// 导出历史数据报表
export async function exportHistoryReport(params) {
  const result = await post(API.ExportApi.ExportAllTypeDataList, params, null);
  return result;
}

// 导出历史数据报表
export async function getAllTypeDataForWryFlag(params) {
  const result = await post(API.MonitorDataApi.GetAllTypeDataForFlag, {
    IsWry: true,
    ...params
  }, null);
  return result;
}

// 修改数据标记
export async function updateDataWryFlag(params) {
  const result = await post(API.MonitorDataApi.UpdateDataWryFlag, params, null);
  return result;
}

// 数据标记 - 导出
export async function exportDataFlagReport(params) {
  const result = await post(API.MonitorDataApi.ExportAllTypeDataForFlag, {
    IsWry: true,
    ...params
  }, null);
  return result;
}

// 二氧化碳物料衡算法-获取数据
export async function getCO2SumData(params) {
  const result = await post(API.CO2EmissionsApi.GetCO2SumData, params, null);
  return result;
}


