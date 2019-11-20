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

// 获取企业达标率
export async function QCAResultStatic(params) {
  const result = await post(`/api/rest/PollutantSourceApi/QualityControlApi/QCAResultStatic`, params, null);
  return result;
}

// 获取单个企业统计数据
export async function QCAResultStaticByEntCode(params) {
  const result = await post(`/api/rest/PollutantSourceApi/QualityControlApi/QCAResultStaticByEntCode`, params, null);
  return result;
}

// 获取质控结果比对数据
export async function QCAResultCheckByDGIMN(params) {
  const result = await post(`/api/rest/PollutantSourceApi/QualityControlApi/QCAResultCheckByDGIMN`, params, null);
  return result;
}

// 获取质控结果比对时间选择列表
export async function QCAResultCheckSelectList(params) {
  const result = await get(`/api/rest/PollutantSourceApi/QualityControlApi/QCAResultCheckSelectList`, params, null);
  return result;
}

// 获取参数记录 - 表格数据
export async function getParamsTableData(params) {
  const result = await post(`/api/rest/PollutantSourceApi/QualityControlApi/QCADynamicControlDataList`, params, null);
  return result;
}

// 获取参数记录 - 图表数据
export async function getParamsChartData(params) {
  // TODO (WJQ) : 替换接口地址
  const result = await post(`/api/rest/PollutantSourceApi/QualityControlApi/QCADynamicControlDataList`, params, null);
  return result;
}

// 获取参数记录 - 参数列表
export async function getDataTempletList(params) {
  const result = await get(`/api/rest/PollutantSourceApi/QualityControlApi/GetDataTempletList`, params, null);
  return result;
}












