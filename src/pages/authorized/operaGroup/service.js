/*
 * @Author: outman0611
 * @Date: 2024-09-29 17:13:21
 * @LastEditors: outman0611
 * @LastEditTime: 2024-10-09 09:30:16
 * @Description: 
 */
import { post, get, getNew } from '@/utils/request';
import { API} from '@config/API';


/*** 运维小组 */


//列表
export async function GetOperationTeamList(params) {
  const result = await post(API.AssetManagementApi.GetOperationTeamList,params, null);
  return result;
}
//添加编辑
export async function AddOrUpdOperationTeam(params) {
  const result = await post(API.AssetManagementApi.AddOrUpdOperationTeam,params, null);
  return result;
}


// 删除
export async function DelOperationTeam(params) {
  const result = await post(API.AssetManagementApi.DelOperationTeam,params, null);
  return result;
}

// 运维小组人员列表
export async function GetOperationTeamUser(params) {
  const result = await post(API.AssetManagementApi.GetOperationTeamUser,params, null);
  return result;
}

// 添加运维小组人员
export async function AddSetOperationTeamUser(params) {
  const result = await post(API.AssetManagementApi.AddSetOperationTeamUser,params, null);
  return result;
}

// 获取运维小组权限点位信息
export async function GetOperationTeamPoint(params) {
  const result = await post(API.AssetManagementApi.GetOperationTeamPoint,params, null);
  return result;
}

// 添加运维小组权限点位信息
export async function AddSetOperationTeamPoint(params) {
  const result = await post(API.AssetManagementApi.AddSetOperationTeamPoint,params, null);
  return result;
}
