import { post, get } from '@/utils/request';
import { async } from 'q';

import { API } from '@config/API'

export async function getAlarmNotices(params) {
   const result = await post('/api/rest/PollutantSourceApi/AlarmDataApi/GetAlarmNotices', params, null);
   return result;
  //return { IsSuccess: false, Datas: [], Message: "" };
}
export async function getSystemConfigInfo() {

  const result = await get(API.SystemApi.GetSystemConfigInfo);

  return result;
}

//报警关联列表
export async function GetAlarmPushDepOrRole(params) {
  const result = post(
    API.AssetManagementApi.GetAlarmPushDepOrRole,
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

// 获取系统入口
export async function getSysPollutantTypeList() {
  const result = await post(API.systemApi.GetSysList, {}, null);
  return result;
}