import { post } from '@/utils/request';

/**
 * 传输有效率 行政区下
 *
 */
export async function GetTransmissionEfficiencyForRegion(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetTransmissionEfficiencyForRegion',
    params,
    null,
  );

  return result;
}

//传输有效率  排口

export async function GetTransmissionEfficiencyForPoint(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetTransmissionEfficiencyForPoint',
    params,
    null,
  );

  return result;
}
//传输有效率  企业

export async function GetTransmissionEfficiencyForEnt(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetTransmissionEfficiencyForEnt',
    params,
    null,
  );

  return result;
}

//根据行政区获取 企业列表

export async function GetEntByRegion(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetEntByRegion?RegionCode=' +
      params.RegionCode +
      '',
    null,
    null,
  );

  return result;
}

//行政区导出

export async function ExportTransmissionEfficiencyForRegion(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/ExportTransmissionEfficiencyForRegion',
    params,
    null,
  );

  return result;
}

//企业导出

export async function ExportTransmissionEfficiencyForEnt(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/ExportTransmissionEfficiencyForEnt',
    params,
    null,
  );

  return result;
}
