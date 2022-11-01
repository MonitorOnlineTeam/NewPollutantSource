import request from '@/utils/request';
import { API } from '@config/API'
export async function queryBasicProfile() {
  return request('/api/profile/basic');
}
