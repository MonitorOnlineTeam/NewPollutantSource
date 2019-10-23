import { post, get } from '@/utils/request';
import { async } from 'q';
export async function getAlarmNotices(params) {
  const result = await post('/api/rest/PollutantSourceApi/AlarmDataApi/GetAlarmNotices', params, null);
  return result;
}
export async function getSystemConfigInfo() {

  const result = await get('/api/rest/PollutantSourceApi/SystemSettingApi/GetSystemConfigInfo');

  return result;
}
