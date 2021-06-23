import { post } from '@/utils/request';







 // 联网率---省一级
export async function GetNetworkingRateForProvice(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/MonitorPointApi/GetNetworkingRateForProvice',
    params,
    null,
  );

  return result;
}
//联网率---市一级
export async function GetNetworkingRateForCity(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/MonitorPointApi/GetNetworkingRateForCity',
    params,
    null,
  );

  return result;
}

//联网率---监测点一级
export async function GetNetworkingRateForPoint(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/MonitorPointApi/GetNetworkingRateForPoint',
    params,
    null,
  );

  return result;
}
// 联网率---导出省一级
export async function ExportNetworkingRateForProvice(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/MonitorPointApi/ExportNetworkingRateForProvice',
    params,
    null,
  );

  return result;
}


//联网率---导出市一级

export async function ExportNetworkingRateForCity(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/MonitorPointApi/ExportNetworkingRateForCity',
    params,
    null,
  );

  return result;
}

// 联网率---导出监测点一级
export async function ExportNetworkingRateForPoint(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/MonitorPointApi/ExportNetworkingRateForPoint',
    params,
    null,
  );

  return result;
}



 // 首页联网率
 export async function GetHomePageNetworkingRate(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/MonitorPointApi/GetHomePageNetworkingRate',
    params,
    null,
  );

  return result;
}