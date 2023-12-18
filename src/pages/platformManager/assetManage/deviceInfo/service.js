import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';
//设备信息 列表
export async function GetEquipmentInfoList(params) {
  const result = await post(API.AssetManagementApi.GetEquipmentList,params, null);
  return result;
}
//设备信息 添加
export async function AddEquipmentInfo(params) {
  const result = await post(API.AssetManagementApi.AddEquipmentInfo,params, null);
  return result;
}

// 设备信息 修改
export async function EditEquipmentInfo(params) {
  const result = await post(API.AssetManagementApi.UpdateEquipmentInfo,params, null);
  return result;
}
 
// 设备信息  删除
export async function DelEquipmentInfo(params) {
  const result = await post(API.AssetManagementApi.DeleteEquipmentInfo,params, null);
  return result;
}
//  获取监测类别
export async function GetMonitoringTypeList(params) {
  const result = await post(API.CommonApi.GetPollutantTypeMonitoringCategoryInfo,params, null);
  return result;
}
//  获取监测类型
export async function GetPollutantById(params) {
  const result = await post(API.CommonApi.GetPollutantTypeMonitoringCategoryInfo,params, null);
  return result;
}
//获取设备名称 
export async function  GetEquipmentName(params) {
  const result = await post(API.CommonApi.GetPollutantTypeMonitoringCategoryInfo,params, null);
  return result;
}
//  获取设备厂商列表
export async function GetManufacturerList(params) {
  const result = await post(API.AssetManagementApi.GetEquipmentManufacturerList,params, null);
  return result;
}

//设备信息 导出
export async function ExportEquipmentInfoList(params) {
  const result = await post(API.AssetManagementApi.ExportEquipmentList,params, null);
  return result;
}