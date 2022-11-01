import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

// 获取系统入口
export async function getSysPollutantTypeList() {
  const result = await post(API.systemApi.GetSysList, {}, null);
  return result;
}