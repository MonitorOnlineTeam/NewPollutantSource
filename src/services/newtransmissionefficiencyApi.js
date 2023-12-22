import { post } from '@/utils/request';
import { API } from '@config/API'

/**
 * 传输有效率 行政区下
 *
 */
export async function GetTransmissionEfficiencyForRegion(params) {
  const result = post(
    API.WholeProcessMonitorApi.GetTransmissionEfficiencyRateList,
    params,
    null,
  );

  return result;
}
//传输有效率  企业

export async function GetTransmissionEfficiencyForEnt(params) {
  const result = post(
    API.WholeProcessMonitorApi.GetTransmissionEfficiencyRateList,
    params,
    null,
  );

  return result;
}

//传输有效率  排口

export async function GetTransmissionEfficiencyForPoint(params) {
  const result = post(
    API.WholeProcessMonitorApi.GetTransmissionEfficiencyRateList,
    params,
    null,
  );

  return result;
}
//根据行政区获取 企业列表

export async function GetEntByRegion(params) {
  const result = post(API.CommonApi.GetEntByRegion,{regionCode:params.RegionCode},  null)
  return result;
}

//行政区导出

export async function ExportTransmissionEfficiencyForRegion(params) {
  const result = post(
    API.WholeProcessMonitorApi.ExportTransmissionEfficiencyRateList,
    params,
    null,
  );

  return result;
}

//企业导出

export async function ExportTransmissionEfficiencyForEnt(params) {
  const result = post(
    API.WholeProcessMonitorApi.ExportTransmissionEfficiencyRateList,
    params,
    null,
  );

  return result;
}
