import { post } from '@/utils/request';

// 获取所有企业及排口信息
export async function getHomePage(params) {
  const result = await post('/api/rest/PollutantSourceApi/HomePageApi/GetHomePage', params, null);
  return result === null ? {
    data: null
  } : result;
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

export async function GetMonthPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetMonthPoint', params, null);
  return result === null ? {
    data: null
  } : result;
}

