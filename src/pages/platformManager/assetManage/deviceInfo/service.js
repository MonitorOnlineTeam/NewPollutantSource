import { post, get, getNew } from '@/utils/request';

//设备信息 列表
export async function GetEquipmentInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEquipmentInfoList',params, null);
  return result;
}
//设备信息 添加
export async function AddEquipmentInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddEquipmentInfo',params, null);
  return result;
}

// 设备信息 修改
export async function EditEquipmentInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/EditEquipmentInfo',params, null);
  return result;
}
 
// 设备信息  删除
export async function DelEquipmentInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DelEquipmentInfo',params, null);
  return result;
}
//  获取监测类别
export async function GetMonitoringTypeList(params) {
  const result = await post(`/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantById/${params.id}?type=${params.type}`, null);
  return result;
}
//  获取监测类型
export async function GetPollutantById(params) {
  const result = await post(`/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantById/${params.id}?type=${params.type}`, null);
  return result;
}
//获取设备名称 
export async function  GetEquipmentName(params) {
  const result = await post(`/api/rest/PollutantSourceApi/BaseDataApi/GetPollutantById/${params.id}?type=${params.type}`, null);
  return result;
}
//  获取设备厂商列表
export async function GetManufacturerList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetManufacturerList',params, null);
  return result;
}

//设备信息 导出
export async function ExportEquipmentInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportEquipmentInfoList',params, null);
  return result;
}