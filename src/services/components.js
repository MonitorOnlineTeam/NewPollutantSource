import { post, get } from '@/utils/request';

// 获取导航树
export async function getTreeNodeData(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetTreeNodeData', params);
  return result;
}

// 获取站点详情
export async function getSiteInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPointModelInfo', params);
  return result;
}

// 获取仪器信息table
export async function getPointInstrument(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPointInstrument', params);
  return result;
}

// 获取污染物信息
export async function getPollutantByDgimn(params) {
  const result = await get('/api/rest/PollutantSourceApi/StandardLibraryApi/GetStandardPollutantsByDgimn', params);
  return result;
}