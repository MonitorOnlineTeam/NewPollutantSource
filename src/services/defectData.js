import { post } from '@/utils/request';

/**
 * 缺失数据
 *
 */
export async function GetDefectModel(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetDefectModel',
    params,
    null,
  );

  return result;
}

//关注列表
export async function GetAttentionDegreeList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetAttentionDegreeList',
    params,
    null,
  );

  return result;
}

//导出

export async function ExportGetAlarmDataList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/ExportGetAlarmDataList',
    params,
    null,
  );

  return result;
}


//根据行政区获取 企业列表

export async function GetEntByRegion(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetEntByRegion?RegionCode=' +
      params.RegionCode,
    null,
    null,
  );

  return result;
}