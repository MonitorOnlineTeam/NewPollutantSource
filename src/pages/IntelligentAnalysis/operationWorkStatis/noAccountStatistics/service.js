import { post } from '@/utils/request';

/**
 * 无台账工单统计（企业） 列表
 *
 */
export async function GetTaskFormBookSta(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TaskFormApi/GetTaskFormBookSta',
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

export async function ExportTaskFormBookSta(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TaskFormApi/ExportTaskFormBookSta',
    params,
    null,
  );

  return result;
}


//根据行政区获取 污水处理厂

// export async function GetEntByRegion(params) {
//   const result = post(
//     '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetEntByRegion?IsSewage=1&RegionCode=' +
//       params.RegionCode,
//     null,
//     null,
//   );

//   return result;
// }