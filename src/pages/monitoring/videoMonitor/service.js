import { post } from '@/utils/request';

/**
 * 视频列表  企业
 *
 */
export async function GetCameraListEnt(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/VideoApi/GetCameraListEnt',
    params,
    null,
  );

  return result;
}
/**
 * 视频列表  大气
 *
 */
export async function GetCameraListStation(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/VideoApi/GetCameraListStation',
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

export async function ExportSewageHistoryList(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/MonDataApi/ExportSewageHistoryList',
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