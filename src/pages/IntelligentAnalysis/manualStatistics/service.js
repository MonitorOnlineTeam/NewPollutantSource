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

//手工计算 企业
export async function GetRecalculateEffectiveTransmissionEnt(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetRecalculateEffectiveTransmissionEnt',
    params,
    null,
  );

  return result;
}

  