import { post } from '@/utils/request';
import { API } from '@config/API';

//监测设备运维信息列表
export async function GetEntProjectRelationList(params) {
  const result = await post(API.EntAndPointApi.GetPointProjectRelationList, params, null);
  return result;
}

//监测设备运维信息列表 添加和更新
export async function UpdateOrAddProjectRelation(params) {
  const result = await post(API.EntAndPointApi.AddOrUpdatePointProjectRelationInfo, params, null);
  return result;
}

//监测设备运维信息列表 删除
export async function DeleteOperationPoint(params) {
  const result = await post(API.EntAndPointApi.DeletePointProjectRelationInfo, params, null);
  return result;
}

//项目编号列表
export async function ProjectNumList(params) {
  const result = await post(API.EntAndPointApi.GetProjectList, params, null);
  return result;
}

//监测点信息
export async function GetEntPointList(params) {
  const result = await post(API.CommonApi.GetPointByEntCode, { EntCode: params.EntID }, null);
  return result;
}

//导出
export async function ExportEntProjectRelationList(params) {
  const result = await post(API.EntAndPointApi.ExportPointProjectRelationList, params, null);
  return result;
}
