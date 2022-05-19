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
