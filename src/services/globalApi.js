import { post, get } from '@/utils/request';
import { async } from 'q';
export async function getAlarmNotices(params) {
   const result = await post('/api/rest/PollutantSourceApi/AlarmDataApi/GetAlarmNotices', params, null);
   return result;
  //return { IsSuccess: false, Datas: [], Message: "" };
}
export async function getSystemConfigInfo() {

  const result = await get('/api/rest/PollutantSourceApi/SystemSettingApi/GetSystemConfigInfo');

  return result;
}
//报警关联列表
export async function GetAlarmPushDepOrRole(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/AuthorApi/GetAlarmPushDepOrRole',
    params,
    null,
  );

  return result;
}
//报警关联  选择
export async function InsertAlarmDepOrRole(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/AuthorApi/InsertAlarmDepOrRole',
    params,
    null,
  );

  return result;
}