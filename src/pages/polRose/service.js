import { post } from '@/utils/request';

export async function GetPollutantAQI(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetPollutantAQI', params, null);
  return result === null ? {
    data: null
  } : result;
}

export async function GetRoleData(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetRoleData', params, null);
  return result === null ? {
    data: null
  } : result;
}

