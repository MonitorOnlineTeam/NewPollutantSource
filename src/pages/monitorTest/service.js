import { post } from '@/utils/request';

export async function GetMonitorTest(params) {
  const result = await post('/api/rest/PollutantSourceApi/ReportApi/GetMonitorTest', params, null);
  return result === null ? {
    data: null
  } : result;
}

