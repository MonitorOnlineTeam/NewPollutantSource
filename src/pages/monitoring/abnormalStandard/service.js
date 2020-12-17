import { post } from '@/utils/request';

/**
 * 排放标准
 *
 */


//异常标准
export async function GetExceptionStandValue(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/GetExceptionStandValue',
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



//导出  异常 
export async function ExportExceptionStandValue(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/BaseDataApi/ExportExceptionStandValue',
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