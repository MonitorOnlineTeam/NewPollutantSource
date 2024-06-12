import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API';

// 根据企业获取排口 无权限过滤
export async function getPointByEntCode(params) {
  const result = await post(API.CommonApi.GetNoFilterPointByEntCode, params, null);
  return result;
}
// 获取数据一致性核查列表
export async function GetRemoteInspectorList(params) {
  const result = await post(API.SupervisionVerificaApi.GetKeyParameterCheckList, params, null);
  return result;
}

// 数据一致性核查列表 导出
export async function ExportRemoteInspectorList(params) {
  const result = await post(API.SupervisionVerificaApi.ExportKeyParameterCheckList, params, null);
  return result;
}



//获取量程数据一致性详情
export async function GetConsistencyCheckInfo(params) {
  const result = await post(API.SupervisionVerificaApi.GetRangeConsistencyDetail, params, null);
  return result;
}
// //添加或修改参数一致性核查
// export async function AddOrUpdParamCheck(params) {
//   const result = await post(`/api/rest/PollutantSourceApi/TaskProcessingApi/AddOrUpdParamCheck`, params, null);
//   return result;
// }
// 获取数据一致性核查列表 添加参数列表
export async function GetPointConsistencyParam(params) {
  const result = await post(API.SupervisionVerificaApi.GetParameterConsistencyCodeInfo, params, null);
  return result;
}
// //添加或修改数据一致性核查
// export async function AddOrUpdConsistencyCheck(params) {
//   const result = await post(`/api/rest/PollutantSourceApi/TaskProcessingApi/AddOrUpdConsistencyCheck`, params, null);
//   return result;
// }




//删除数据一致性核查
export async function DeleteRemoteInspector(params) {
  const result = await post(API.SupervisionVerificaApi.DeleteKeyParameterCheckInfo, params, null);
  return result;
}

//量程一致性检查
export async function JudgeConsistencyRangeCheck(params) {
  const result = await post(API.SupervisionVerificaApi.JudgeRangeConsistencyCheck, params, null);
  return result;
}

//数据一致性检查
export async function JudgeConsistencyCouCheck(params) {
  const result = await post(API.SupervisionVerificaApi.JudgeDataConsistencyCheck, params, null);
  return result;
}

//获取NOx数采仪实时数据
export async function GetNoxValue(params) {
  const result = await post(API.SupervisionVerificaApi.GetNOxValue, params, null);
  return result;
}


//参数一致性检查
export async function JudgeParamCheck(params) {
  const result = await post(API.SupervisionVerificaApi.JudgeParameterConsistencyInfo, params, null);
  return result;
}

//下发
export async function IssueRemoteInspector(params) {
  const result = await post(API.SupervisionVerificaApi.IssueKeyParameterCheckInfo, params, null);
  return result;
}

//关键参数核查 新的保存
export async function AddRemoteInspector(params) {
  const result = await post(API.SupervisionVerificaApi.AddRemoteInspector, params, null);
  return result;
}

//关键参数核查 可申请工单站点
export async function GetRemoteInspectorPointList(params) {
  const result = await post(API.SupervisionVerificaApi.GetRemoteInspectorPointList, params, null);
  return result;
}

//关键参数核查 手工申请工单
export async function AddRemoteInspectorPoint(params) {
  const result = await post(API.SupervisionVerificaApi.AddRemoteInspectorPoint, params, null);
  return result;
}
//关键参数核查 转发工单
export async function ForwardRemoteInspector(params) {
  const result = await post(API.SupervisionVerificaApi.ForwardRemoteInspector, params, null);
  return result;
}
//关键参数核查 导入
export async function ExportRangeParam(params) {
  const result = await post(API.SupervisionVerificaApi.ExportRangeParam, params, null);
  return result;
}