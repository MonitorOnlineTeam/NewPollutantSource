import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

//获取项目权限列表
export async function GetProjectAuthorList(params) {
  const result = await post(API.AssetManagementApi.GetAccessibleProjectList,params, null);
  return result;
}

//分配项目权限
export async function AddProjectAuthor(params) {
  const result = await post(API.AssetManagementApi.AddAccessibleProjectInfo,params, null);
  return result;
}

// 获取当前人员未分配的项目权限
export async function GetAddProjectAuthorList(params) {
  const result = await post(API.AssetManagementApi.GetAccessibleProjectList,params, null);
  return result;
}
 
// 删除项目权限
export async function DeleteProjectAuthor(params) {
  const result = await post(API.AssetManagementApi.DeleteAccessibleProjectInfo,params, null);
  return result;
}

// 角色列表
export async function GetUserList(params) {
  const result = await post(API.CommonApi.GetUserList,params, null);
  return result;
}