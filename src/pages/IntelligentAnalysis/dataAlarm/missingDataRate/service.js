import { post } from '@/utils/request';

/**
 * 缺失数据  响应
 *
 */
export async function GetDefectModel(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetDefectDataSummary',
    params,
    null,
  );

  return result;
}

//缺失数据查询响应率 二级
export async function GetDefectPointDetailRate(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetDefectPointDetailRate',
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
//导出 缺失数据报警
export async function ExportDefectDataSummary(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/ExportDefectDataSummary',
    params,
    null,
  );

  return result;
}
//导出  二级页面

export async function ExportDefectPointDetailRate(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/ExportDefectPointDetailRate',
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