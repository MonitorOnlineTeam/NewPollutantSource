import { post } from '@/utils/request';

import { API } from '@config/API';






 // 联网率---省一级
export async function GetNetworkingRateForProvice(params) {
  const result = post(
    API.VisualKanbanApi.GetProviceNetworkingRate,
    params,
    null,
  );

  return result;
}
//联网率---市一级
export async function GetNetworkingRateForCity(params) {
  const result = post(
    API.VisualKanbanApi.GetCityNetworkingRate,
    params,
    null,
  );

  return result;
}

//联网率---监测点一级
export async function GetNetworkingRateForPoint(params) {
  const result = post(
    API.VisualKanbanApi.GetPointNetworkingRate,
    params,
    null,
  );

  return result;
}
// 联网率---导出省一级
export async function ExportNetworkingRateForProvice(params) {
  const result = post(
    API.VisualKanbanApi.ExportProviceNetworkingRate,
    params,
    null,
  );

  return result;
}


//联网率---导出市一级

export async function ExportNetworkingRateForCity(params) {
  const result = post(
    API.VisualKanbanApi.ExportCityNetworkingRate,
    params,
    null,
  );

  return result;
}

// 联网率---导出监测点一级
export async function ExportNetworkingRateForPoint(params) {
  const result = post(
    API.VisualKanbanApi.ExportPointNetworkingRate,
    params,
    null,
  );

  return result;
}



 // 首页联网率
 export async function GetHomePageNetworkingRate(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/OperationHomeApi/GetHomePageNetworkingRate',
    params,
    null,
  );

  return result;
}