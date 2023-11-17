import { post, get, getNew } from '@/utils/request';

// 获取项目管理列表
export async function GetProjectInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetProjectInfoList',params, null);
  return result;
}
