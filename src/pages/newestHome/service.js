import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';

//首页 运维信息统计
export async function GetOperatePointList(params) {
  const result = await post(API.VisualKanbanApi.GetVisualDashBoardOperatePointInfo, params, null);
  return result;
}

//首页 近30日运维工单
export async function GetOperationTaskList(params) {
  const result = await post(API.VisualKanbanApi.GetOperationTaskStatisticsInfo, params, null);
  return result;
}

//首页 近期运维情况
export async function GetOperationPlanTaskRate(params) {
  const result = await post(API.VisualKanbanApi.GetPlanOperationTaskCompleteRate, params, null);
  return result;           
}

//首页 运维排名
export async function GetOperationRegionPlanTaskRate(params) {
  const result = await post(API.VisualKanbanApi.GetOperationCompleteRateRank, params, null);
  return result;
}

//首页 异常打卡统计
export async function GetExceptionSignTaskRate(params) {
  const result = await post(API.VisualKanbanApi.GetSceneSignExceptionRate, params, null);
  return result;
}

//首页 传输有效率
export async function GetEffectiveTransmissionRateList(params) {
  const result = await post(API.VisualKanbanApi.GetVisualDashBoardEffectiveTransmissionRate, params, null);
  return result;
}

//首页 获取异常数据总览 
export async function GetAlarmResponse(params) {
  const result = await post(API.VisualKanbanApi.GetExceptionDataOverview, params, null);
  return result;
}

//首页 耗材统计
export async function GetConsumablesList(params) {
  const result = await post(API.VisualKanbanApi.GetVisualDashBoardConsumablesStatisticsInfo, params, null);
  return result;
}

//首页 设备异常总览
export async function GetOpertionExceptionList(params) {
  const result = await post(API.VisualKanbanApi.GetEquipmentExceptionsOverview, params, null);
  return result;
}





//首页 地图
export async function GetMapPointList(params) {
  const result = await post(API.VisualKanbanApi.GetMapPointList, params, null);
  return result;
}

// 获取所有污染物  地图
export async function GetPollutantList(params) {
  const result = await post(API.CommonApi.GetPollutantTypeCode, params, null);
  return result;
}
// 获取监测点infoWindow数据
export async function GetInfoWindowData(params) {
  const result = await post(API.WholeProcessMonitorApi.AllTypeSummaryList, params, null);
  return result;
}
