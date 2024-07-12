import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'

//交接和报告列表
export async function getProjectReportList(params) {
  const result = post(API.AssetManagementApi.GetProjectReportList, params);
  return result;
}
//交接和报告 编辑
export async function addOrUpdProjectReportInfo(params) {
  const result = post(API.AssetManagementApi.AddOrUpdProjectReportInfo, params);
  return result;
}
//交接和报告 导出
export async function exportProjectReportList(params) {
  const result = post(API.AssetManagementApi.ExportProjectReportList, params);
  return result;
}