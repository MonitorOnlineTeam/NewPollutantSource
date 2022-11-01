import { post } from '@/utils/request';
import { API } from '@config/API'

// 获取关注程度
export async function getAttentionDegreeList(params) {
  const result = post(API.commonApi.GetAttentionDegreeList, params);
  return result;
}

// 获取表格数据
export async function getTableDataSource(params) {
  const result = post(API.MonitorDataApi.GetOverDataAnalysisList, params);
  return result;
}

// 导出表格数据
export async function exportData(params) {
  const result = post(API.ExportApi.ExportOverDataAnalysisList, params);
  return result;
}

