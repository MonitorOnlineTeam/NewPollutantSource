import { post, get } from '@/utils/request';
import { API } from '@config/API'

/** 添加停产 */
export async function addoutputstop(params) {
  const result = post(API.BaseDataApi.AddOutputStop, params);
  return result === null ? {
    data: null,
  } : result;
}
