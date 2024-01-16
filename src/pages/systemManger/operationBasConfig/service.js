import { post, get, getNew } from '@/utils/request';

import { API} from '@config/API';

/*** 运维基础配置 */


//获取
export async function GetOperationSetting(params) {
  const result = await post(API.SystemManageApi.GetOperationSetting,params, null);
  return result;
}
//设置
export async function UpdOperationSetting(params) {
  const result = await post(API.SystemManageApi.UpdOperationSetting,params, null);
  return result;
}