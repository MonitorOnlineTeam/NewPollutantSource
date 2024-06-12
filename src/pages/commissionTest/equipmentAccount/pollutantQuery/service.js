import { post, get, getNew } from '@/utils/request';
//调试企业信息
export async function GetTestEntList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetTestEntList',params, null);
  return result;
}
//调试企业信息 导出
export async function ExportTestEntList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportTestEntList',params, null);
  return result;
}

//调试站点信息
export async function GetTestPointList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetTestPointList',params, null);
  return result;
}
//调试站点信息 导出
export async function ExportTestPointList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportTestPointList',params, null);
  return result;
}
//调试站点CEMS设备信息
export async function GetTestPointEquipmentList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetTestPointEquipmentList',params, null);
  return result;
}
//调试站点CEMS设备信息 导出
export async function ExportTestPointEquipmentList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportTestPointEquipmentList',params, null);
  return result;
}
//调试站点CEMS型号信息
export async function GetTestPointSystemList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetTestPointSystemList',params, null);
  return result;
}
//调试站点CEMS型号信息 导出
export async function ExportTestPointSystemList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportTestPointSystemList',params, null);
  return result;
}

//调试站点参比仪器设备信息
export async function GetTestPointParamList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetTestPointParamList', params, null);
  return result;
}
//调试站点参比仪器设备信息 导出
export async function ExportTestPointParamList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportTestPointParamList', params, null);
  return result;
}
