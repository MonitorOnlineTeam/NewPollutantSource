import { post, get, getNew } from '@/utils/request';

// 获取企业及排口
export async function getEntAndPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEntAndPoint', params, null);
  return result;
}

// 获取标气
export async function getStandardGas(params) {
  const result = await get('/api/rest/PollutantSourceApi/QualityControlApi/GetPollutantListByQC', params, null);
  return result;
}

// 添加质控仪
export async function addQualityControl(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/AddQCAnalyzerInfoAndPoint', params, null);
  return result;
}

// 获取质控仪数据
export async function getQualityControlData(params) {
  const result = await get(`/api/rest/PollutantSourceApi/QualityControlApi/GetQCAnalyzerInfoAndPoint/${params.ID}`, null, null);
  return result;
}
