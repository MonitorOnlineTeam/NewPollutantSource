import { post } from '@/utils/request';


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
    '/api/rest/PollutantSourceApi/BaseDataApi/GetAttentionDegreeList',
    params,
    null,
  );

  return result;
}

//导出

export async function ExportSewageHistoryList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/MonDataApi/ExportSewageHistoryList',
    params,
    null,
  );

  return result;
}


//根据行政区获取 污水处理厂

export async function GetEntByRegion(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetEntByRegion?IsSewage=1&RegionCode=' +
    params.RegionCode,
    null,
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

// 空气日报统计 - wjq
export async function getAirDayReportData(params) {
  const result = post('/api/rest/PollutantSourceApi/XJHomeApi/GetAQIStatistics', params);
  return result;
}

