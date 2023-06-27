import { post, get, getNew } from '@/utils/request';

//首页 运维信息统计
export async function GetOperatePointList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetOperatePointList', params, null);
  return result;
}

//首页 运维工单统计
export async function GetOperationTaskList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetOperationTaskList', params, null);
  return result;
}

//首页 近期运维情况
export async function GetOperationPlanTaskRate(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetOperationPlanTaskRate', params, null);
  return result;
}

//首页 计划完成率
export async function GetOperationRegionPlanTaskRate(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetOperationRegionPlanTaskRate', params, null);
  return result;
}

//首页 异常打卡统计
export async function GetExceptionSignTaskRate(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetExceptionSignTaskRate', params, null);
  return result;
}

//首页 传输有效率
export async function GetEffectiveTransmissionRateList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetEffectiveTransmissionRateList', params, null);
  return result;
}

//首页 数据报警响应统计
export async function GetAlarmResponse(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetAlarmResponse', params, null);
  return result;
}

//首页 耗材统计
export async function GetConsumablesList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetConsumablesList', params, null);
  return result;
}

//首页 设备异常统计 
export async function GetOpertionExceptionList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetOpertionExceptionList', params, null);
  return result;
}





//首页 地图
export async function GetMapPointList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetMapPointList', params, null);
  return result;
}

// 获取所有污染物  地图
export async function GetPollutantList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeCode', params, null);
  return result;
}
// 获取监测点infoWindow数据
export async function GetInfoWindowData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AllTypeSummaryList', params, null);
  return result;
}

// 报警响应及时率 
export async function GetResponseList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetResponseList', params, null);
  return result;
}