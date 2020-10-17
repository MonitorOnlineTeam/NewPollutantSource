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

// 获取table数据 - 师一级
export async function getExceptionAlarmListForRegion(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/GetExceptionAlarmListForRegion`, params);
  return result;
}

// 异常数据报警-师一级
export async function exportExceptionAlarm(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/ExportExceptionAlarmListForRegion`, params);
  return result;
}

// 异常数据报警 - 二级页面
export async function getExceptionAlarmListForEnt(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/GetExceptionAlarmListForEnt`, params);
  return result;
}

// 异常数据报警导出 - 二级页面
export async function exportExceptionAlarmListForEnt(params) {
  const result = post(`/api/rest/PollutantSourceApi/BaseDataApi/ExportExceptionAlarmListForEnt`, params);
  return result;
}

