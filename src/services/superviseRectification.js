import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

//核查整改 列表
export async function GetInspectorRectificationManageList(params) {
  const result = await post(API.SupervisionVerificaApi.GetInspectorRectificationManageList,params, null);
  return result;
}


//核查整改 详情
export async function GetInspectorRectificationView(params) {
  const result = await post(`${API.SupervisionVerificaApi.GetInspectorRectificationView}?ID=${params.ID}` ,params, null);
  return result;
}

//核查整改 导出
export async function ExportInspectorRectificationManage(params) {
  const result = await post(API.SupervisionVerificaApi.ExportInspectorRectificationManage,params, null);
  return result;
}
//更新 核查整改状态
export async function UpdateRectificationStatus(params) {
  const result = await post(API.SupervisionVerificaApi.UpdateRectificationStatus,params, null);
  return result;
}

//整改驳回或申述驳回
export async function RejectInspectorRectificationInfo (params) {
  const result = await post(API.SupervisionVerificaApi.RejectInspectorRectificationInfo,params, null);
  return result;
}


//设置可以看到督察整改全部信息的人员信息
export async function AddSetUser (params) {
  const result = await post(API.SupervisionVerificaApi.AddSetUser,params, null);
  return result;
}
//获取可以看到督察整改全部信息的人员信息
export async function GetSetUser (params) {
  const result = await post(API.SupervisionVerificaApi.GetSetUser,params, null);
  return result;
}