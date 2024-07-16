import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

// 列表
export async function GetPGZXPointStatusList(params) {
  const result = await post(API.SystemManageApi.GetPGZXPointStatusList,params, null);
  return result;
}

//导出
export async function ExportPGZXPointStatusList(params) {
  const result = await post(API.SystemManageApi.ExportPGZXPointStatusList,params, null);
  return result;
}



