import { post } from '@/utils/request';

// 获取关注程度
export async function getAttentionDegreeList(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetAttentionDegreeList', params);
  return result;
}

// 获取table数据 - 师一级
export async function getTableDataSource(params) {
  const result = post(
    `/api/rest/PollutantSourceApi/BaseDataApi/GetExceptionAlarmRateListForRegion`,
    params,
  );
  return result;
}

// 导出数据 - 师一级
export async function exportReport(params) {
  const result = post(
    `/api/rest/PollutantSourceApi/BaseDataApi/ExportExceptionAlarmRateListForRegion`,
    params,
  );
  return result;
}

// 获取table数据 - 二级页面
export async function getSecondTableDataSource(params) {
  const result = post(
    `/api/rest/PollutantSourceApi/BaseDataApi/GetExceptionAlarmRateListForPoint`,
    params,
  );
  return result;
}

// 导出数据 - 二级页面
export async function exportSecond(params) {
  const result = post(
    `/api/rest/PollutantSourceApi/BaseDataApi/ExportExceptionAlarmRateListForPoint`,
    params,
  );
  return result;
}

// 根据行政区查询企业
export async function getEntByRegion(params) {
  console.log('params.RegionCode=', params.RegionCode);
  let RegionCode = params.RegionCode || '';
  const result = post(
    `/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetEntByRegion?RegionCode=${RegionCode}`,
    {},
  );
  return result;
}
