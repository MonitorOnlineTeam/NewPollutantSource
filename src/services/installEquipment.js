import { post } from '@/utils/request';
import { API } from '@config/API'

//获取设备安装审核信息
export async function GetEquipmentAuditList(params) {
  const result = post(API.SupervisionInspecApi.GetEquipmentAuditList, params);
  return result;
}
//设备安装审核信息 导出
export async function ExportEquipmentAudit(params) {
  const result = post(API.SupervisionInspecApi.ExportEquipmentAudit, params);
  return result;
}

//单条设备安装导出
export async function ExportAuditPhoto(params) {
  const result = post(API.SupervisionInspecApi.ExportAuditPhoto, params);
  return result;
}

//获取设备安装审核照片详细
export async function GetAuditPhoto(params) {
  const result = post(API.SupervisionInspecApi.GetAuditPhoto, params);
  return result;
}

//安装照片审核
export async function AddAuditInfo(params) {
  const result = post(API.SupervisionInspecApi.AddAuditInfo, params);
  return result;
}

//移交安装照片审核
export async function TransferReview(params) {
  const result = post(API.SupervisionInspecApi.TransferReview, params);
  return result;
}


