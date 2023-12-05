import { async } from 'q';
import { post, get } from '@/utils/request';

import { API } from '@config/API';



// 获取部门详细信息及层级关系
export async function  getTestGroupList(params) {
  const result = post(API.CtDebugServiceApi.GetDebuggingAreaGroupList, params, null);
  return result;
}

// 新增部门信息
export async function addOrUpdTestGroup(params) {
  const result = post(API.CtDebugServiceApi.AddOrUpdateDebuggingAreaGroupInfo, params, null);
  return result;
}

// 删除部门信息
export async function  deleteTestGroup(params) {
  const result = post(API.CtDebugServiceApi.DeleteDebuggingAreaGroupInfo, params, null);
  return result;
}

// 获取所有的用户
export async function getAllUser(params) {
  const result = post(API.AssetManagementApi.GetAllUser, params, null);
  return result;
}



// 获取当前部门的用户
export async function getTestMonitorUserList(params) {

  const result = post(API.CtDebugServiceApi.GetDebuggingAreaUserList, params,);
  return result;
}


// 添加用户
export async function addTestMonitorUser(params) {

  const result = post(API.CtDebugServiceApi.OperationDebuggingAreaUserInfo, params, null);
  return result;
}

// 给部门添加行政区（可批量）
export async function insertRegionByUser(params) {
  const result = post(API.AssetManagementApi.InsertRegionByUser, params, null);
  return result;
}
// 获取当前部门的行政区
export async function getRegionByDepID(params) {
  const result = post(API.AssetManagementApi.GetRegionByDepID, params, null);
  return result;
}
