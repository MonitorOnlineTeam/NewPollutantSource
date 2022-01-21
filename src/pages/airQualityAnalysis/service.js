import { post } from '@/utils/request';

// 获取同比环比分析数据
export async function GetMonthPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetMonthPoint', params, null);
  return result;
}

export async function GetAirAQIMonth(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetAirAQIMonth', params, null);
  return result === null ? {
    data: null
  } : result;
}

export async function GetAirPrimaryPolMonth(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetAirPrimaryPolMonth', params, null);
  return result === null ? {
    data: null
  } : result;
}

// 获取污染日历数据
export async function GetPolCalendar(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetPolCalendar', params, null);
  return result;
}
