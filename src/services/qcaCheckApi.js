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

  
  








