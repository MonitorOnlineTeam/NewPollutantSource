import request from '@/utils/request';
import { API } from '@config/API'
export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}
