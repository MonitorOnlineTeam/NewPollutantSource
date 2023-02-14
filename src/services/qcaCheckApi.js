import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'


// 获取响应时间核查数据
export async function getResTimeCheckTableData(params) {
  const result = await post(API.QualityControlApi.GetResponseDataList, params, null);
  return result;
}

// 获取零点核查数据
export async function getZeroCheckTableData(params) {
  const result = await post(API.QualityControlApi.GetZeroDataList, params, null);
  return result;
}

// 获取关键参数
export async function getKeyParameterList(params) {
  const result = await post(API.DymaicControlApi.GetParameterSnapshot, params, null);
  return result;
}

// 获取质控日志
export async function getQCLog(params) {
  const result = await post(API.QualityControlApi.GetQCLog, params, null);
  return result;
}

// 获取质控日志和质控过程
export async function getQCProcessData(params) {
  const result = await post(API.QualityControlApi.GetQCProcessData, params, null);
  return result;
}

// 获取量程核查数据
export async function getRangeDataList(params) {
  const result = await post(API.QualityControlApi.GetRangeDataList, params, null);
  return result;
}
// 获取盲样核查数据
export async function getBlindDataList(params) {
  const result = await post(API.QualityControlApi.GetSampleDataList, params, null);
  return result;
}

// 获取线性核查数据
export async function getLinearDataList(params) {
  const result = await post(API.QualityControlApi.GetLinearDataList, params, null);
  return result;
}

// 零点导出
export async function exportZeroDataList(params) {
  const result = await post(API.QualityControlApi.ExportZeroDataList, params, null);
  return result;
}

// 响应时间导出
export async function exportResponseDataList(params) {
  const result = await post(API.QualityControlApi.ExportResponseDataList, params, null);
  return result;
}

// 量程导出
export async function exportRangeDataList(params) {
  const result = await post(API.QualityControlApi.ExportRangeDataList, params, null);
  return result;
}

// 盲样导出
export async function exportSampleDataList(params) {
  const result = await post(API.QualityControlApi.ExportSampleDataList, params, null);
  return result;
}

// 线性导出
export async function exportLinearDataList(params) {
  const result = await post(API.QualityControlApi.ExportLinearDataList, params, null);
  return result;
}

// 获取示值误差核查数据
export async function getErrorValueDataList(params) {
  const result = await post(API.QualityControlApi.GetErrorValueDataList, params, null);
  return result;
}

// 导出 - 示值误差核查数据
export async function exportErrorValueCheck(params) {
  const result = await post(API.QualityControlApi.ExportErrorValueDataList, params, null);
  return result;
}

// 获取质控记录污染物
export async function getQCAPollutantByDGIMN(params) {
  const result = await post(API.QualityControlApi.GetQCStandard, params, null);
  return result;
}



