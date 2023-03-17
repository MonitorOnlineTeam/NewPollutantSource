import { post, get, getNew } from '@/utils/request';

// 获取项目管理列表
export async function GetProjectInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetProjectInfoList',params, null);
  return result;
}
// 获取项目管理列表  添加和修改
export async function AddOrUpdateProjectInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddOrUpdateProjectInfo',params, null);
  return result;
}
 


// 运维监测点信息
export async function GetProjectPointList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetProjectPointList',params, null);
  return result;
}

// 导出 项目管理列表
export async function ExportProjectInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportProjectInfoList',params, null);
  return result;
}

// 导出 运维监测点信息
export async function ExportProjectPointList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportProjectPointList',params, null);
  return result;
}