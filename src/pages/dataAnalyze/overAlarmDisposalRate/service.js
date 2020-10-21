/*
 * @Description:超标报警处置率
 * @LastEditors: hxf
 * @Date: 2020-10-16 17:02:34
 * @LastEditTime: 2020-10-21 14:21:22
 * @FilePath: /NewPollutantSource/src/pages/dataAnalyze/overAlarmDisposalRate/service.js
 */
import { post } from '@/utils/request';

// 获取关注程度
export async function getAttentionDegreeList(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetAttentionDegreeList', params);
  return result;
}

// xinjiang根据企业类型查询监测因子
export async function getPollutantCodeList(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantCodeList`, params);
  return result;
}

// 根据企业类型查询监测因子
export async function getPollutantByType(params) {
  const result = post(
    `/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantByType?type=${params.type}`,
    {},
  );
  return result;
}

// 异常数据查询-师一级
export async function getAlarmManagementRate(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/GetAlarmManagementRate`, params);
  return result;
}

// 异常数据查询-师一级
export async function getExceptionList(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/GetExceptionList`, params);
  return result;
}

// 异常数据导出-师一级
export async function exportExceptionList(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/ExportExceptionList`, params);
  return result;
}

// 异常数据查询 - 二级页面
export async function getExceptionPointList(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/GetExceptionPointList`, params);
  return result;
}

// 异常数据导出 - 二级页面
export async function exportExceptionPointList(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/ExportExceptionPointList`, params);
  return result;
}
