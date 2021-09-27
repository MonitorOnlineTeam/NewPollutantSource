import { post, get, getNew } from '@/utils/request';


// 获取响应时间核查数据
export async function getResTimeCheckTableData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetResponseDataList', params, null);
  return result;
}

// 获取零点核查数据
export async function getZeroCheckTableData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetZeroDataList', params, null);
  return result;
}

// 获取关键参数
export async function getKeyParameterList(params) {
  const result = await post('/api/rest/PollutantSourceApi/MonDataApi/GetKeyParameterList', params, null);
  return result;
}

// 获取质控日志和质控过程
export async function getqcaLogAndProcess(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetZeroDataOne', params, null);
  return result;
}

// 获取量程核查数据
export async function getRangeDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetRangeDataList', params, null);
  return result;
}
// 获取盲样核查数据
export async function getBlindDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetSampleDataList', params, null);
  return result;
}

// 获取线性核查数据
export async function getLinearDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetLinearDataList', params, null);
  return result;
}

// 零点导出
export async function exportZeroDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportZeroDataList', params, null);
  return result;
}

// 响应时间导出
export async function exportResponseDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/exportResponseDataList', params, null);
  return result;
}

// 量程导出
export async function exportRangeDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportRangeDataList', params, null);
  return result;
}

// 盲样导出
export async function exportSampleDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportSampleDataList ', params, null);
  return result;
}

// 线性导出
export async function exportLinearDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportLinearDataList ', params, null);
  return result;
}

// 获取示值误差核查数据
export async function getErrorValueDataList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/getErrorValueDataList', params, null);
  return result;
}

// 导出 - 示值误差核查数据
export async function exportErrorValueCheck(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/exportErrorValueCheck', params, null);
  return result;
}




