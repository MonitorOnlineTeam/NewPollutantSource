import { post, get, getNew } from '@/utils/request';

//列表 督查总结
export async function GetInspectorSummaryList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetInspectorSummaryList',params, null);
  return result;
}
//获取单个督查表实体
export async function GetInspectorOperationInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetInspectorOperationInfoList?ID='+params.ID,params, null);
  return result;
}

//获取单个排口默认值
export async function GetPointParames(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetPointParames?DGIMN='+params.DGIMN,params, null);
  return result;
}

//添加或修改督查模板
export async function AddOrEditInspectorOperation(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/AddOrEditInspectorOperation',params, null);
  return result;
}
//督查管理详情
export async function GetInspectorOperationView(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetInspectorOperationView/'+params.ID ,params, null);
  return result;
}

//导出运维督查信息
export async function ExportInspectorOperationManage(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ExportInspectorOperationManage',params, null);
  return result;
}