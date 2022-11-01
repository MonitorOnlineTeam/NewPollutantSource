import request from '@/utils/request';
import { API } from '@config/API'
export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}
