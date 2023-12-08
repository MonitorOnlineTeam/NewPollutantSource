/*
 * @Description:超标报警处置率
 * @LastEditors: hxf
 * @Date: 2020-10-16 17:02:34
 * @LastEditTime: 2020-10-23 09:00:16
 * @FilePath: /NewPollutantSource/src/pages/dataAnalyze/overAlarmDisposalRate/service.js
 */
import { post } from '@/utils/request';
import { API } from '@config/API'
// 获取关注程度
export async function getAttentionDegreeList(params) {
  const result = post(API.CommonApi.GetAttentionDegreeList, params);
  return result;
}

// xinjiang根据企业类型查询监测因子
export async function getPollutantCodeList(params) {
  const result = post(API.CommonApi.GetPollutantCodeList, params);
  return result;
}

// 根据企业类型查询监测因子
export async function getPollutantByType(params) {
  const result = post(
    `${API.CommonApi.GetPollutantByType}?type=${params.type}`,
    {},
  );
  return result;
}

// // 超标报警处置率-一级
// export async function getAlarmManagementRate(params) {
//   const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/GetAlarmManagementRate`, params);
//   return result;
// }

// // 超标报警处置率导出-师一级
// export async function exportAlarmManagementRate(params) {
//   const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/ExportAlarmManagementRate`, params);
//   return result;
// }

// // 超标报警处置率-二级
// export async function getAlarmManagementRateDetail(params) {
//   const result = post(
//     `/api/rest/PollutantSourceApi/BaseDataApi/GetAlarmManagementRateDetail`,
//     params,
//   );
//   return result;
// }

// // 超标报警处置率导出-二级
// export async function exportAlarmManagementRateDetail(params) {
//   const result = post(
//     `/api/rest/PollutantSourceApi/BaseDataApi/exportAlarmManagementRateDetail`,
//     params,
//   );
//   return result;
// }

// 根据行政区获取 企业列表
export async function GetEntByRegion(params) {
  const result = post(API.CommonApi.GetEntByRegion,{regionCode:params.RegionCode},  null)
  return result;
}

// 异常数据查询-行政区一级
export async function getExceptionList(params) {
  const result = post(API.IntelligentDiagnosis.GetExceptionList, params);
  return result;
}

// 异常数据导出-行政区一级
export async function exportExceptionList(params) {
  const result = post(API.IntelligentDiagnosis.ExportExceptionList, params);
  return result;
}

// 异常数据查询 - 二级页面
export async function getExceptionPointList(params) {
  const result = post(API.IntelligentDiagnosis.GetExceptionPointList, params);
  return result;
}

// 异常数据导出 - 二级页面
export async function exportExceptionPointList(params) {
  const result = post(API.IntelligentDiagnosis.ExportExceptionPointList, params);
  return result;
}
