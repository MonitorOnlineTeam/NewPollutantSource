import { post, get, getNew } from '@/utils/request';

//监测设备运维信息列表
export async function GetEntProjectRelationList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEntProjectRelationList', params, null);
  return result;
}

//监测设备运维信息列表 添加和更新
export async function UpdateOrAddProjectRelation(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/UpdateOrAddProjectRelation', params, null);
  return result;
}

//监测设备运维信息列表 删除
export async function DeleteOperationPoint(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DeleteOperationPoint', params, null);
  return result;
}


//项目编号列表
export async function ProjectNumList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetProjectInfoList', params, null);
  return result;
}

//项目编号列表
export async function GetEntPointList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEntPointList', params, null);
  return result;
}
 
//导出
export async function ExportEntProjectRelationList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportEntProjectRelationList', params, null);
  return result;
}
