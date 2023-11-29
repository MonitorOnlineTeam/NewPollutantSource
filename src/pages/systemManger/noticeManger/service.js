import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'

 
// 列表  
export async function GetNoticeContentList(params) {
  const result = await post(API.SystemManageApi.GetNoticeList,params, null);
  return result;
}
// 添加or修改 
export async function AddOrUpdNoticeContent(params) {
  const result = await post(API.SystemManageApi.AddOrUpdateNoticeInfo,params, null);
  return result;
}


// 设备厂家  删除
export async function DeleteNoticeContent(params) {
  const result = await post(API.SystemManageApi.DeleteNoticeInfo,params, null);
  return result;
}


