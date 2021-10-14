import { post, get, getNew } from '@/utils/request';

// 获取项目管理列表
export async function GetProjectInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetProjectInfoList',params, null);
  return result;
}
// 获取项目管理列表  添加和修改
export async function AddOrUpdateProjectInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddOrUpdateProjectInfo',params, null);
  return result;
}
 
// 获取项目管理列表  删除
export async function DeleteProjectInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DeleteProjectInfo',params, null);
  return result;
}



