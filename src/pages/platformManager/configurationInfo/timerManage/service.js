import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';

//定时器 列表
export async function GetOnlineTimerManageList(params) {
  const result = await post(API.AssetManagementApi.GetOnlineTimerManageList,params, null);
  return result;
}
//定时器 添加
export async function AddOnlineTimerManage(params) {
  const result = await post(API.AssetManagementApi.AddOnlineTimerManage,params, null);
  return result;
}

// 定时器 修改
export async function EditOnlineTimerManage(params) {
  const result = await post(API.AssetManagementApi.EditOnlineTimerManage,params, null);
  return result;
}
 
// 定时器  删除
export async function DelOnlineTimerManage(params) {
  const result = await post(API.AssetManagementApi.DelOnlineTimerManage,params, null);
  return result;
}