import { post, get, getNew } from '@/utils/request';

// 获取企业及排口
export async function getEntAndPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEntAndPoint', params, null);
  return result;
}

// 获取标气
export async function getStandardGas(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/GetPollutantListByQC', params, null);
  return result;
}

// 获取质控报表
export async function GetQCAReport(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/GetQCAReport', params, null);
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
  const result = await get('/api/rest/PollutantSourceApi/QualityControlApi/GetCemsByQCAMN', params, null);
  return result;
}

// 发送质控命令
export async function SendQCACmd(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/SendQCACmd', params, null);
  return result;
}

// 获取自动质控信息
export async function getAutoQCAInfo(params) {
  const result = await get('/api/rest/PollutantSourceApi/QualityControlApi/GetAutoQCAInfo', params, null);
  return result;
}

// 取消计划
export async function cancelPlan(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/UpdateQCAInfoPlanState', params, null);
  return result;
}

// 获取企业达标率
export async function QCAResultStatic(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/QCAResultStatic', params, null);
  return result;
}

// 获取单个企业统计数据
export async function QCAResultStaticByEntCode(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/QCAResultStaticByEntCode', params, null);
  return result;
}

// 获取质控结果比对数据
export async function QCAResultCheckByDGIMN(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/QCAResultCheckByDGIMN', params, null);
  return result;
}

// 获取质控结果比对时间选择列表
export async function QCAResultCheckSelectList(params) {
  const result = await get('/api/rest/PollutantSourceApi/QualityControlApi/QCAResultCheckSelectList', params, null);
  return result;
}
/**
 * xpy
 * 获取质控仪状态列表
*/
export async function QCAStatusByDGIMN(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/QCAStatusByDGIMN', params, null);
  return result;
}
/**
 * xpy
 * 获取质控仪状态名称列表
 */
export async function QCAStatusName(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/QCAStatusName', params, null);
  return result;
}

// 获取参数记录 - 表格数据
export async function getParamsTableData(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/QCADynamicControlDataList', params, null);
  return result;
}

// 获取参数记录 - 图表数据
export async function getParamsChartData(params) {
  // TODO (WJQ) : 替换接口地址
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/QCADynamicControlDataList', params, null);
  return result;
}

// 获取参数记录 - 参数列表
export async function getDataTempletList(params) {
  const result = await get('/api/rest/PollutantSourceApi/QualityControlApi/GetDataTempletList', params, null);
  return result;
}

// 质控报警消息
export async function GetQCAAlarmMsgList(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/GetQCAAlarmMsgList', params, null);
  return result;
}

// 质控报警类型列表
export async function getAlarmType(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/getAlarmType', params, null);
  return result;
}

// 获取质控仪信息
export async function getCemsAndStandGasState(params) {
  const result = await get('/api/rest/PollutantSourceApi/QualityControlApi/GetCemsAndStandGasState', params, null);
  return result;
}

// 获取稳定时间
export async function getStabilizationTime(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/GetStabilizationTime', params, null);
  return result;
}

// 获取质控结果
export async function getQCAResult(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/GetQCAResultByQCAMN', params, null);
  return result;
}

// 获取质控记录时间轴
export async function getQCATimelineRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetQCARecord', params, null);
  return result;
}


// 根据时间轴获取质控流程图
export async function getQCADataForRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetQCADataForRecord', params, null);
  return result;
}


// 添加工作模式
export async function workPatternAdd(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/WorkModelAdd', params, null);
  return result;
}

// 工作模式列表
export async function getWorkPatternList(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/WorkModelList', params, null);
  return result;
}

// 删除工作模式
export async function workPatternDelete(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/WorkModelDel', params, null);
  return result;
}

// 获取编辑工作模式数据
export async function getWorkPatternEditData(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/WorkModelDetail', params, null);
  return result;
}

// 工作模式编辑保存数据
export async function workModelUps(params) {
  const result = await post('/api/rest/PollutantSourceApi/QualityControlApi/WorkModelUps', params, null);
  return result;
}


