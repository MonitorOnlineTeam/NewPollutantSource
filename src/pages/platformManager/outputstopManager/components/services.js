import { post, get } from '@/utils/request';

/** 添加停产 */
export async function addoutputstop(params) {
  debugger;
  const result = post('/api/rest/PollutantSourceApi/OutputStopApi/AddOutputStop', params, null);
  return result === null ? {
    data: null,
  } : result;
}
