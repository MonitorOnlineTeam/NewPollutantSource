import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

/**
 * 
 * 绩效排名
 */


 //获取所有排口监测点系数列表 列表
export async function GetPointCoefficientList(params) {
  const result = await post(API.PerformanceApi.GetPointCoefficientList,params, null);
  return result;
}
//添加或修改监测点系数
export async function AddOrEditPointCoefficient(params) {
  const result = await post(API.PerformanceApi.AddOrUpdatePointCoefficientInfo,params, null);
  return result;
}


 //获取工单系数列表
 export async function GetRecordCoefficientList(params) {
  const result = await post(API.PerformanceApi.GetWorkOrderTypeCoefficientList,params, null);
  return result;
}

// 根据污染物类型获取工单
export async function GetRecordTypesByPollutantType(params) {
  const result = await post(API.PerformanceApi.GeteTaskOrderTypeByPollutantType,params, null);
  return result;
}
 
// 添加或修改工单系数
export async function AddOrEditRecordCoefficient(params) {
  const result = await post(API.PerformanceApi.AddOrUpdateWorkOrderTypeCoefficientList,params, null);
  return result;
}

// 删除工单系数
export async function DeleteRecordCoefficient(params) {
  const result = await post(`${API.PerformanceApi.DeleteWorkOrderTypeCoefficientList}?ID=${params.ID}`,params, null);
  return result;
}

// 导出所有排口监测点系数列表
export async function ExportPointCoefficient(params) {
  const result = await post(API.PerformanceApi.ExportPointCoefficientList,params, null);
  return result;
}



//绩效信息查询列表
export async function GetPersonalPerformanceRateList(params) {
  const result = await post(API.PerformanceApi.GetPersonalPerformanceList,params, null);
  return result;
}
//绩效信息查询 导出
export async function ExportPersonalPerformanceRate(params) {
  const result = await post(API.PerformanceApi.ExportPersonalPerformanceList,params, null);
  return result;
}

//个人分摊套数列表
export async function GetIndividualApportionmentList(params) {
  const result = await post(API.PerformanceApi.GetPersonalPerformanceDetail,params, null);
  return result;
}
//获取个人工单详细 
export async function GetIndividualTaskInfo(params) {
  const result = await post(API.PerformanceApi.GetPersonalPerformanceWorkOrderList,params, null);
  return result;
}
//个人分摊套数  导出
export async function ExportIndividualApportionment(params) {
  const result = await post(API.PerformanceApi.ExportPersonalPerformanceDetail,params, null);
  return result;
}

//个人任务详细 导出
export async function ExportIndividualTaskInfo(params) {
  const result = await post(API.PerformanceApi.ExportPersonalPerformanceWorkOrderList,params, null);
  return result;
}

//绩效明细 查询列表
export async function GetPersonalPerformanceRateInfoList(params) {
  const result = await post(API.PerformanceApi.GetPersonalPerformanceRateInfoList,params, null);
  return result;
}
//绩效明细 导出
export async function ExportPersonalPerformanceRateInfo(params) {
  const result = await post(API.PerformanceApi.ExportPersonalPerformanceRateInfo,params, null);
  return result;
}

/**工作质量积分 */

//积分汇总 一级页面
export async function GetOperationIntegralGroupList(params) {
  const result = await post(API.PerformanceApi.GetOperationIntegralGroupList,params, null);
  return result;
}
//积分汇总 二级页面
export async function GetOperationIntegralGroupInfoList(params) {
  const result = await post(API.PerformanceApi.GetOperationIntegralGroupInfoList,params, null);
  return result;
}
//积分明细 一级页面
export async function GetOperationIntegralList(params) {
  const result = await post(API.PerformanceApi.GetOperationIntegralList,params, null);
  return result;
}
//积分明细 二级页面
export async function GetOperationIntegralInfoList(params) {
  const result = await post(API.PerformanceApi.GetOperationIntegralInfoList,params, null);
  return result;
}
//积分明细 三级页面
export async function GetOperationIntegralInfoViewList(params) {
  const result = await post(API.PerformanceApi.GetOperationIntegralInfoViewList,params, null);
  return result;
}
//积分明细 导入
export async function ImportOperationIntegral(params) {
  const result = await post(API.PerformanceApi.ImportOperationIntegral,params, null);
  return result;
}


//工作总量绩效 修改
export async function UpdatePersonalPerformanceRateInfo(params) {
  const result = await post(API.PerformanceApi.UpdatePersonalPerformanceRateInfo,params, null);
  return result;
}