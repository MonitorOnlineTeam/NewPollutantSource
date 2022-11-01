import {
  post,
} from '@/utils/request';
import { API } from '@config/API'
/** 获取用户信息组件 */
export async function GetUserList(params) {
  const body = {
    ...params,
  };
  const result = post(API.AuthorityApi.GetUserRolesGroupList, body, null);
  return result;
}
// 获取角色树(带根节点)
export async function getrolestreeandobj(params) {
  const result = post(API.AuthorityApi.GetRolesTreeAndObj, params);
  return result;
}
// 获取部门树(带根节点)
export async function getdeparttreeandobj(params) {
  const result = post(API.AuthorityApi.GetDepartTreeAndObj, params);
  return result === null ? {
    data: null,
  } : result;
}
