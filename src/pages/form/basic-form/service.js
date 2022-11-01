import request from '@/utils/request';
import { API } from '@config/API'
export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}
