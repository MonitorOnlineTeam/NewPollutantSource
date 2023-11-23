import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'
//系统信息
export async function GetSystemModelOfPoint(params) {
  const result = await post(API.AssetManagementApi.GetPointSystemList,params, null);
  return result;
}
//系统信息 导出
export async function ExportSystemModelOfPoint(params) {
  const result = await post(API.AssetManagementApi.ExportPointSystemList,params, null);
  return result;
}

//数据核查
export async function GetVerificationItemOfPoint(params) {
  const result = await post(API.AssetManagementApi.GetPointVerificationItemList,params, null);
  return result;
}
//数据核查 导出
export async function ExportVerificationItemOfPoint(params) {
  const result = await post(API.AssetManagementApi.ExportPointVerificationItemList,params, null);
  return result;
}
//设备参数项
export async function GetMonitorPointParamOfPoint(params) {
  const result = await post(API.AssetManagementApi.GetPointEquipmentParametersList,params, null);
  return result;
}
//设备参数项 导出
export async function ExportMonitorPointParamOfPoint(params) {
  const result = await post(API.AssetManagementApi.ExportPointEquipmentParametersList,params, null);
  return result;
}
//监测点信息
export async function GetPointInfoList(params) {
  const result = await post(API.AssetManagementApi.GetPointList,params, null);
  return result;
}
//监测点信息 导出
export async function ExportPointInfoList(params) {
  const result = await post(API.AssetManagementApi.ExportPointList,params, null);
  return result;
}

//运维信息
export async function GetEntProjectRelationList(params) {
  const result = await post(API.AssetManagementApi.GetPointProjectRelationList, params, null);
  return result;
}
//运维信息 导出
export async function ExportEntProjectRelationList(params) {
  const result = await post(API.AssetManagementApi.ExportPointProjectRelationList, params, null);
  return result;
}
//企业信息 
export async function GetEntInfoList(params) {
  const result = await post(API.AssetManagementApi.GetEntList,params, null);
  return result;
}
//企业信息 导出
export async function ExportEntInfoList(params) {
  const result = await post(API.AssetManagementApi.ExportEntList,params, null);
  return result;
}

//设备信息
export async function GetEquipmentParametersOfPont(params) {
  const result = await post(API.AssetManagementApi.GetPointEquipmentList,params, null);
  return result;
}
//设备信息 导出
export async function ExportEquipmentParametersOfPont(params) {
  const result = await post(API.AssetManagementApi.ExportPointEquipmentList,params, null);
  return result;
}
  //设备信息  获取监测类型
  export async function GetPollutantById(params) { 
    const result = await post(API.CommonApi.GetPollutantTypeMonitoringCategoryInfo,params, null);
    return result;
  }