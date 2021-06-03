import { post } from '@/utils/request';


// 参数列表
export async function GetEmissionsEntPointPollutant(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/EmissionsApi/GetEmissionsEntPointPollutant',
    params,
    null,
  );

  return result;
}

//企业监测点
export async function GetPointByEntCode(params) {
  const result = post(
      '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetPointByEntCode?EntCode='+params.EntCode,
      null,
      null
  )
  return result
}
//空气站监测点
export async function GetAirPoint(params) {
    const result = post(
        '/api/rest/PollutantSourceApi/BaseDataApi/GetPointSummary',
        params,
        null
    )
    return result
}

//手工计算 企业
export async function GetRecalculateEffectiveTransmissionEnt(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetRecalculateEffectiveTransmissionEnt',
    params,
    null,
  );

  return result;
}

//  手工计算 空气站
export async function GetRecalculateEffectiveTransmissionAir(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetRecalculateEffectiveTransmissionAir',
    params,
    null,
  );

  return result;
}
