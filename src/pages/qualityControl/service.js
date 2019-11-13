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

// 获取质控仪数据
export async function getCEMSList(params) {
  const result = await get(`/api/rest/PollutantSourceApi/QualityControlApi/GetCemsByQCAMN`, params, null);
  return result;
}

// 发送质控命令
export async function SendQCACmd(params) {
  const result = await post(`/api/rest/PollutantSourceApi/QualityControlApi/SendQCACmd`, params, null);
  return result;
}

// 获取自动质控信息
export async function getAutoQCAInfo(params) {
  const result = await get(`/api/rest/PollutantSourceApi/QualityControlApi/GetAutoQCAInfo`, params, null);
  return result;
}

// 取消计划
export async function cancelPlan(params) {
  const result = await post(`/api/rest/PollutantSourceApi/QualityControlApi/UpdateQCAInfoPlanState`, params, null);
  return result;
}




