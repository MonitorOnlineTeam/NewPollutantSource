import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';

//列表
export async function GetInspectorOperationManageList(params) {
  const result = await post(API.SupervisionVerificaApi.GetSystemFacilityVerificationList,params, null);
  return result;
}
//获取单个督查表实体
export async function GetInspectorOperationInfoList(params) {
  const result = await post(`${API.SupervisionVerificaApi.GetSystemFacilityVerificationInfo}?ID=${params.ID}&InspectorType=${params.InspectorType}&PollutantType=${params.PollutantType? params.PollutantType : ''}`, null);
  return result;
}

//获取单个排口默认值
export async function GetPointParames(params) {
  const result = await post(`${API.SupervisionVerificaApi.GetPointSystemInfo}?DGIMN=${params.DGIMN}`,params, null);
  return result;
}

//添加或修改督查模板
export async function AddOrEditInspectorOperation(params) {
  const result = await post(API.SupervisionVerificaApi.AddOrUpdateSystemFacilityVerificationInfo,params, null);
  return result;
}
//督查管理详情
export async function GetInspectorOperationView(params) {
  const result = await post(`${API.SupervisionVerificaApi.GetSystemFacilityVerificationDetail}/${params.ID}`,params, null);
  return result;
}

//导出运维督查信息
export async function ExportInspectorOperationManage(params) {
  const result = await post(API.SupervisionVerificaApi.ExportSystemFacilityVerificationList,params, null);
  return result;
}
//删除运维督查信息
export async function DeleteInspectorOperation(params) {
  const result = await post(`${API.SupervisionVerificaApi.DeleteSystemFacilityVerificationInfo}/${params.ID}`,null, null);
  return result;
}

//整改问题推送
export async function PushInspectorOperation(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/PushInspectorOperation/'+params.ID,null, null);
  return result;
}