import { post } from '@/utils/request';
import { API } from '@config/API'

//超标率
export async function GetOverDataRate(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TaskFormApi/GetOverDataRate',
    params,
    null,
  );

  return result;
}
//运转率
export async function GetDeviceDataRate(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TaskFormApi/GetDeviceDataRate',
    params,
    null,
  );

  return result;
}
//故障率
export async function GetExceptionDataRate(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TaskFormApi/GetExceptionDataRate',
    params,
    null,
  );

  return result;
}


//关注列表
export async function GetAttentionDegreeList(params) {
  const result = post(
    API.CommonApi.GetAttentionDegreeList,
    params,
    null,
  );

  return result;
}

//导出 
// ExportOverDataRate  超标率导出
// ExportDeviceDataRate  运转率导出
// ExportExceptionDataRate  故障率导出 
export async function ExportOverDataRate(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TaskFormApi/ExportOverDataRate',
    params,
    null,
  );

  return result;
}
export async function ExportDeviceDataRate(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TaskFormApi/ExportDeviceDataRate',
    params,
    null,
  );

  return result;
}
export async function ExportExceptionDataRate(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TaskFormApi/ExportExceptionDataRate',
    params,
    null,
  );

  return result;
}

//根据行政区获取 污水处理厂

export async function GetEntByRegion(params) {
  const result = post(API.CommonApi.GetEntByRegion,{regionCode:params.RegionCode,isSewage:1},  null)
  return result;
}
 //污水处理厂流量分析
export async function GetSewageFlowList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/MonDataApi/GetSewageFlowList',
    params,
    null,
  );

  return result;
}

//监测点状态
export async function GetPointStatusList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/XJHomeApi/GetPointStatusList',
    params,
    null,
  );

  return result;
}
//超标监测点
export async function GetOverList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/XJHomeApi/GetOverList',
    params,
    null,
  );
  return result;
}
//运维工单统计
export async function GetOperationWorkOrderList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/XJHomeApi/GetOperationWorkOrderList',
    params,
    null,
  );
  return result;
}
//数据响应报警统计
export async function GetAlarmResponse(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/XJHomeApi/GetAlarmResponse',
    params,
    null,
  );
  return result;
}
//空气质量实时数据
export async function GetAQIList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/XJHomeApi/GetAQIList',
    params,
    null,
  );
  return result;
}

// 空气日报统计 - wjq
export async function getAirDayReportData(params) {
  const result = post('/api/rest/PollutantSourceApi/XJHomeApi/GetAQIStatistics', params);
  return result;
}

// 获取实时报警数据 - wjq
export async function getAlarmDataList(params) {
  const result = post('/api/rest/PollutantSourceApi/XJHomeApi/GetRealAlarmDataList', params);
  return result;
}

// 获取故障率 - wjq
export async function getGZRateList(params) {
  const result = post('/api/rest/PollutantSourceApi/XJHomeApi/GetFailureRateList', params);
  return result;
}

// 获取超标率 - wjq
export async function getCBRateList(params) {
  const result = post('/api/rest/PollutantSourceApi/XJHomeApi/GetOverStandardRateList', params);
  return result;
}

// 获取运转率 - wjq
export async function getYZRateList(params) {
  const result = post('/api/rest/PollutantSourceApi/XJHomeApi/GetDeviceOperationRateList', params);
  return result;
}

// 获取传输有效 - wjq
export async function getCSYXRateList(params) {
  const result = post('/api/rest/PollutantSourceApi/XJHomeApi/GetEffectiveTransmissionRateList ', params);
  return result;
}

