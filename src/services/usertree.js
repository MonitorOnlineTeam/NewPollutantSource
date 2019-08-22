import {
  post,
} from '@/utils/request';
/** 获取用户信息组件 */
export async function GetUserList(params) {
  const body = {
    ...params,
  };
  const result = post('/api/rest/PollutantSourceApi/UserApi/GetUserRolesGroupList', body, null);
  return result;
}
