import { post, get, getNew } from '@/utils/request';

/**
 * 
 * 运维绩效
 */


 //获取所有排口监测点系数列表 列表
export async function GetPointCoefficientList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPointCoefficientList',params, null);
  return result;
}
//添加或修改监测点系数
export async function AddOrEditPointCoefficient(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddOrEditPointCoefficient',params, null);
  return result;
}


 //获取工单系数列表
 export async function GetRecordCoefficientList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetRecordCoefficientList',params, null);
  return result;
}

// 根据污染物类型获取工单
export async function GetRecordTypesByPollutantType(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetRecordTypesByPollutantType?PollutantType='+params.pollutantType,null, null);
  return result;
}
 
// 添加或修改工单系数
export async function AddOrEditRecordCoefficient(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddOrEditRecordCoefficient',params, null);
  return result;
}

// 删除工单系数
export async function DeleteRecordCoefficient(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DeleteRecordCoefficient/'+params.ID,params, null);
  return result;
}

// 导出所有排口监测点系数列表
export async function ExportPointCoefficient(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportPointCoefficient',params, null);
  return result;
}



//绩效信息查询列表
export async function GetPersonalPerformanceRateList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetPersonalPerformanceRateList',params, null);
  return result;
}
//绩效信息查询 导出
export async function ExportPersonalPerformanceRate(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportPersonalPerformanceRate',params, null);
  return result;
}

//个人分摊套数列表
export async function GetIndividualApportionmentList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetIndividualApportionmentList',params, null);
  return result;
}
//获取个人工单详细 
export async function GetIndividualTaskInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetIndividualTaskInfo',params, null);
  return result;
}
//个人分摊套数  导出
export async function ExportIndividualApportionment(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportIndividualApportionment',params, null);
  return result;
}

//个人任务详细 导出
export async function ExportIndividualTaskInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/ExportIndividualTaskInfo',params, null);
  return result;
}
