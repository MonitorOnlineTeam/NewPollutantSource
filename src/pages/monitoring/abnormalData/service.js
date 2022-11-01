import { post } from '@/utils/request';
import { API } from '@config/API'

// 获取关注程度
export async function getAttentionDegreeList(params) {
  const result = post(API.commonApi.GetAttentionDegreeList, params);
  return result;
}

// 根据企业类型查询监测因子
export async function getPollutantByType(params) {
  const result = post(`${API.commonApi.GetPollutantByType}?type=${params.type}`, {});
  return result;
}

// 异常数据查询-师一级
export async function getExceptionList(params) {
  const result = post(API.MonitorDataApi.GetExceptionList, params);
  return result;
}

// 异常数据导出-师一级
export async function exportExceptionList(params) {
  const result = post(API.ExportApi.ExportExceptionList, params);
  return result;
}

// 异常数据查询 - 二级页面
export async function getExceptionPointList(params) {
  const result = post(API.MonitorDataApi.GetExceptionPointList, params);
  return result;
}

// 异常数据导出 - 二级页面
export async function exportExceptionPointList(params) {
  const result = post(API.ExportApi.ExportExceptionPointList, params);
  return result;
}

