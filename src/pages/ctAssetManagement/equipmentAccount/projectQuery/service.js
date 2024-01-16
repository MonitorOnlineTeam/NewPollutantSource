import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'


//获取项目列表
export async function GetCTProjectList(params) {
  const result = post(API.CtAssetManagementApi.GetCTProjectList, params);
  return result;
}  
// 项目修改
export async function updateCTProject(params) {
  const result = await post(API.CtAssetManagementApi.UpdateCTProject,params, null);
  return result;
}

// 获取项目与站点管理关系
export async function getrojectPointRelationList(params) {
  const result = await post(API.CtAssetManagementApi.GetrojectPointRelationList,params, null);
  return result;
}

// 添加成套项目与站点关联关系
export async function addProjectPointRelation(params) {
  const result = await post(API.CtAssetManagementApi.AddProjectPointRelation,params, null);
  return result;
}
// 添加成套项目与企业关联关系
export async function addProjectEntRelation(params) {
  const result = await post(API.CtAssetManagementApi.AddProjectEntRelation,params, null);
  return result;
}


//获取项目列表 导出
export async function exportCTProjectList(params) {
  const result = post(API.CtAssetManagementApi.ExportCTProjectList, params);
  return result;
}