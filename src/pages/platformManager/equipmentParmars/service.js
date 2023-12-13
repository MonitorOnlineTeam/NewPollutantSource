import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

// 获取量程设定列表 
export async function GetEquipmentParametersInfo(params) {
  const result = await post(`${API.AbnormalModelAnalysisApi.GetEquipmentParametersInfo}?DGIMN=${params.DGIMN}`, {}, null);
  return result;
}

// 获取下拉列表框中的测量参数
export async function GetParametersInfo(params) {
  const result = await post(`${API.AbnormalModelAnalysisApi.GetParametersInfo}?PolltantType=${params.PolltantType}`, {}, null);
  return result;
}

// 添加 or 修改 量程设定
export async function AddOrUpdateEquipmentParametersInfo(params) {
  const result = await post(API.AbnormalModelAnalysisApi.AddOrUpdateEquipmentParametersInfo, params, null);
  return result;
}

// 删除 量程设定
export async function DeleteEquipmentParametersInfo(params) {
  const result = await post(`${API.AbnormalModelAnalysisApi.DeleteEquipmentParametersInfo}?ID=${params.ID}`, {}, null);
  return result;
}
// 获取 烟气流量、颗粒物参数、其他参数设定
export async function GetEquipmentParameters(params) {
  const result = await post(`${API.AbnormalModelAnalysisApi.GetEquipmentParameters}?DGIMN=${params.DGIMN}`, {}, null);
  return result;
}
// 添加 or 修改 烟气流量、颗粒物参数、其他参数设定
export async function AddOrUpdateEquipmentParameters(params) {
  const result = await post(API.AbnormalModelAnalysisApi.AddOrUpdateEquipmentParameters, params, null);
  return result;
}
