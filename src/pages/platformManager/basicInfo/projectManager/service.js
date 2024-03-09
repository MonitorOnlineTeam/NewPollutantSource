import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'
// 获取项目管理列表
export async function GetProjectInfoList(params) {
  const result = await post(API.AssetManagementApi.GetProjectList,params, null);
  return result;
}
// 获取项目管理列表  添加和修改
export async function AddOrUpdateProjectInfo(params) {
  const result = await post(API.AssetManagementApi.AddOrUpdateProjectInfo,params, null);
  return result;
}
 
// 获取项目管理列表  删除
export async function DeleteProjectInfo(params) {
  const result = await post(API.AssetManagementApi.DeleteProjectInfo,params, null);
  return result;
}
// // 运维信息列表 查看
// export async function GetProjectInfo(params) {
//   const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetProjectInfo',params, null);
//   return result;
// }
// 运维监测点信息
export async function GetProjectPointList(params) {
  const result = await post(API.AssetManagementApi.GetProjectPointList,params, null);
  return result;
}

// 导出 项目管理列表
export async function ExportProjectInfoList(params) {
  const result = await post(API.AssetManagementApi.ExportProjectList,params, null);
  return result;
}

// 导出 运维监测点信息
export async function ExportProjectPointList(params) {
  const result = await post(API.AssetManagementApi.ExportProjectPointList,params, null);
  return result;
}

//获取卖房公司信息
export async function GetSellerCompanyList(params) {
  const result = await post(API.AssetManagementApi.GetSellerCompanyList,params, null);
  return result;
}
//添加卖房公司信息
export async function AddOrUpdSellerCompany(params) {
  const result = await post(API.AssetManagementApi.AddOrUpdSellerCompany,params, null);
  return result;
}
//删除卖房公司信息
export async function DelSellerCompany(params) {
  const result = await post(API.AssetManagementApi.DelSellerCompany,params, null);
  return result;
}