import { post } from '@/utils/request';

// 获取关注程度
export async function getAttentionDegreeList(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetAttentionDegreeList', params);
  return result;
}

// 获取表格数据
export async function getTableDataSource(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetOverDataAnalysisList', params);
  return result;
}

// 导出表格数据
export async function exportData(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/ExportOverDataAnalysisList', params);
  return result;
}

