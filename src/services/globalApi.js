import { post, get } from '@/utils/request';
import { API } from '@config/API'


export async function getAlarmNotices(params) {
  const result = await post(API.AlarmApi.GetAlarmNotices, params, null);
  return result;
  //return { IsSuccess: false, Datas: [], Message: "" };
}
export async function getSystemConfigInfo() {

  const result = await get('/api/rest/PollutantSourceApi/ConfigureApi/GetSystemConfigInfo');

  return result;
}
//报警关联列表
export async function GetAlarmPushDepOrRole(params) {
  const result = await post(API.AuthorityApi.GetAlarmPushDepOrRole, params);
  return result;
}
//报警关联  选择
export async function InsertAlarmDepOrRole(params) {
  const result = post(
    API.AuthorityApi.InsertAlarmDepOrRole,
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