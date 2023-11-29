import {
  post,
} from '@/utils/request';
import { API } from '@config/API'
/** 获取用户信息组件 */
export async function GetUserList(params) {
  const body = {
    ...params,
  };
  const result = post(API.AssetManagementApi.GetUserList, body, null);
  return result;
}
// 获取角色树(带根节点)
export async function getrolestreeandobj(params) {
  const result = post(API.AssetManagementApi.GetRolesTreeAndObj, params, null);
  return result === null ? {
    data: null,
  } : result;
}
// 获取部门树(带根节点)
export async function getdeparttreeandobj(params) {
  const result = post(API.AssetManagementApi.GetDepartTreeAndObj, params, null);
  return result === null ? {
    data: null,
  } : result;
}
