import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

//设备故障反馈 列表
export async function GetFaultFeedbackList(params) {
  const result = await post(API.IntelligentDiagnosis.GetEquipmentFaultFeedbackList, params, null);
  return result;
}

//编辑
export async function UpdateFaultFeedbackIsSolve(params) {
  const result = await post(`${API.IntelligentDiagnosis.UpdateEquipmentFaultFeedbackStatus}?ID=${params.ID}&&IsSolve=${params.IsSolve}`, params, null);
  return result;
}

//设备故障反馈 导出
export async function ExportFaultFeedback(params) {
  const result = await post(API.IntelligentDiagnosis.ExportEquipmentFaultFeedbackList, params, null);
  return result;
}


//设备故障反馈 企业下拉列表
export async function GetFaultFeedbackEntPoint(params) {
  const result = await post(API.CommonApi.GetEntByRegion, {EntCode:params.entCode}, null);
  return result;
}
