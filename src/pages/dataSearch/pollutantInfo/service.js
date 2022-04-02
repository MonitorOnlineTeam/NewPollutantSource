import { post, get, getNew } from '@/utils/request';

//系统信息
export async function GetSystemModelOfPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetSystemModelOfPoint',params, null);
  return result;
}
//系统信息 导出
export async function ExportSystemModelOfPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportSystemModelOfPoint',params, null);
  return result;
}

//数据核查
export async function GetVerificationItemOfPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetVerificationItemOfPoint',params, null);
  return result;
}
//数据核查 导出
export async function ExportVerificationItemOfPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportVerificationItemOfPoint',params, null);
  return result;
}
//设备参数项
export async function GetMonitorPointParamOfPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetMonitorPointParamOfPoint',params, null);
  return result;
}
//设备参数项 导出
export async function ExportMonitorPointParamOfPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportMonitorPointParamOfPoint',params, null);
  return result;
}
//监测点信息
export async function GetPointInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPointInfoList',params, null);
  return result;
}
//监测点信息 导出
export async function ExportPointInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportPointInfoList',params, null);
  return result;
}