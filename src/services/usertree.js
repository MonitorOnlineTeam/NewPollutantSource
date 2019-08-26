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
// 获取角色树(带根节点)
export async function getrolestreeandobj(params) {
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetRolesTreeAndObj', params, null);
  return result === null ? {
    data: null,
  } : result;
}
// 获取部门树(带根节点)
export async function getdeparttreeandobj(params) {
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetDepartTreeAndObj', params, null);
  return result === null ? {
    data: null,
  } : result;
}
