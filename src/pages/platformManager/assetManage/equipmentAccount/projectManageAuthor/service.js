import { post, get, getNew } from '@/utils/request';

//获取项目权限列表
export async function GetProjectAuthorList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetProjectAuthorList',params, null);
  return result;
}

//分配项目权限
export async function AddProjectAuthor(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddProjectAuthor',params, null);
  return result;
}

// 获取当前人员未分配的项目权限
export async function GetAddProjectAuthorList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetAddProjectAuthorList',params, null);
  return result;
}
 
// 删除项目权限
export async function DeleteProjectAuthor(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DeleteProjectAuthor',params, null);
  return result;
}

// 角色列表
export async function GetUserList(params) {
  const result = await post('/api/rest/PollutantSourceApi/AuthorApi/GetUserList',params, null);
  return result;
}