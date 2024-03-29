import { post } from '@/utils/request';

// 获取关注程度
export async function getAttentionDegreeList(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetAttentionDegreeList', params);
  return result;
}

// 根据企业类型查询监测因子
export async function getPollutantByType(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantByType?type=${params.type}`, {});
  return result;
}

// 异常数据查询-师一级
export async function getExceptionList(params) {
  const result = post(`/api/rest/PollutantSourceApi/ExceptionApi/GetExceptionList`, params);
  return result;
}

// 异常数据导出-师一级
export async function exportExceptionList(params) {
  const result = post(`/api/rest/PollutantSourceApi/ExceptionApi/ExportExceptionList`, params);
  return result;
}

// 异常数据查询 - 二级页面
export async function getExceptionPointList(params) {
  const result = post(`/api/rest/PollutantSourceApi/ExceptionApi/GetExceptionPointList`, params);
  return result;
}

// 异常数据导出 - 二级页面
export async function exportExceptionPointList(params) {
  const result = post(`/api/rest/PollutantSourceApi/ExceptionApi/ExportExceptionPointList`, params);
  return result;
}

