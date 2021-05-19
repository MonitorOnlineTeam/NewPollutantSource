import { post } from '@/utils/request';

/**
 * 传输有效率 空气站  行政区下 
 *
 */
export async function GetAirTransmissionEfficiencyForEnt(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetAirTransmissionEfficiencyForEnt',
    params,
    null,
  );

  return result;
}

//传输有效率 空气站 排口

export async function GetAirTransmissionEfficiencyForPoint(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetAirTransmissionEfficiencyForPoint',
    params,
    null,
  );

  return result;
}



//空气站 企业级别导出

export async function ExportAirTransmissionEfficiencyForEnt(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/ExportAirTransmissionEfficiencyForEnt',
    params,
    null,
  );

  return result;
}

//排口级别导出

export async function ExportAirTransmissionEfficiencyForPoint(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/ExportAirTransmissionEfficiencyForPoint',
    params,
    null,
  );

  return result;
}
