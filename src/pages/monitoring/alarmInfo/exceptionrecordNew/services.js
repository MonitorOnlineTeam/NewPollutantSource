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

// 获取table数据 - 师一级
export async function getExceptionAlarmListForRegion(params) {
  const result = post(API.AlarmApi.GetExceptionAlarmListForRegion, params);
  return result;
}

// 异常数据报警-师一级
export async function exportExceptionAlarm(params) {
  const result = post(API.ExportApi.ExportExceptionAlarmListForRegion, params);
  return result;
}

// 异常数据报警 - 二级页面
export async function getExceptionAlarmListForEnt(params) {
  const result = post(API.AlarmApi.GetExceptionAlarmListForEnt, params);
  return result;
}

// 异常数据报警导出 - 二级页面
export async function exportExceptionAlarmListForEnt(params) {
  const result = post(API.ExportApi.ExportExceptionAlarmListForEnt, params);
  return result;
}

