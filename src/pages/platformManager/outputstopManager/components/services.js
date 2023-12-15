import { post, get } from '@/utils/request';
import { API } from '@config/API'

/** 添加停产 */
export async function addoutputstop(params) {
  debugger;
  const result = post(API.IntelligentDiagnosis.AddOutputStop, params, null);
  return result === null ? {
    data: null,
  } : result;
}
