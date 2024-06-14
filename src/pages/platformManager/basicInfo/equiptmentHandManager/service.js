import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

// 获取项目管理列表
export async function GetProjectInfoList(params) {
  const result = await post(API.AssetManagementApi.GetProjectList,params, null);
  return result;
}
