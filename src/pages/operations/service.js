import { post, get, getNew } from '@/utils/request';

// 获取日历信息
export async function getCalendarInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetCalendarInfo', params, null);
  return result.Datas === null ? {
    Datas: [],
  } : result;
}

// 获取异常详细信息
export async function getAbnormalDetailList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetOperationHistoryRecordPageList', params, null);
  return result === null ? {
    data: null,
  } : result;
}

// 获取运维日志信息
export async function getOperationLogList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetOperationPageList', params, null);
  return result === null ? {
    data: null,
  } : result;
}

// 获取运维日志详情图片
export async function getOperationImageList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetRecordPhotoName', params, null);
  return result;
}

// 车辆申请、审批列表
export async function getVehicleApplicationList(params) {
  const result = await post('/api/rest/PollutantSourceApi/VehicleApplicationApi/GetVehicleApplicationList', params, null);
  return result;
}

// 获取车辆列表
export async function getVehicleList(params) {
  const result = await post(`/api/rest/PollutantSourceApi/VehicleApplicationApi/GetVehicleList?type=${  params.type}`, null);
  return result;
}

// 车辆申请
export async function addVehicleApplication(params) {
  const result = await post('/api/rest/PollutantSourceApi/VehicleApplicationApi/AddVehicleApplication', params, null);
  return result;
}

// 撤销申请
export async function cancelApplication(params) {
  const result = await post(`/api/rest/PollutantSourceApi/VehicleApplicationApi/CancelApplication/${  params.ID}`, null);
  return result;
}

// 车辆审批
export async function approve(params) {
  console.log('////2', params)
  const result = await post(`/api/rest/PollutantSourceApi/VehicleApplicationApi/ApprovalApplication/${params.ID}?RefuseReason=${params.RefuseReason}&type=${params.type}`, {}, null);
  return result;
}

// 车辆归还
export async function returnVehicle(params) {
  const result = await post(`/api/rest/PollutantSourceApi/VehicleApplicationApi/ReturnVehicle/${params.ID}`, {}, null);
  return result;
}

// 车辆归还
export async function getApplicant(params) {
  const result = await post('/api/rest/PollutantSourceApi/VehicleApplicationApi/GetApplicant', params, null);
  return result;
}

// 派单
export async function addTask(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/AddTask', params, null);
  return result;
}

// 驳回
export async function rejectTask(params) {
  const result = await post(`/api/rest/PollutantSourceApi/TaskProcessingApi/RejectTask?taskId=${params.taskId}`, {}, null);
  return result;
}

// 获取运维人员
export async function getOperationsUserList(params) {
  const result = await post('/api/rest/PollutantSourceApi/UserApi/GetUserRolesGroupList', params, null);
  return result;
}

// 获取运维更换记录
export async function getOperationReplacePageList(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetOperationReplacePageList', params, null);
  return result;
}

// 获取排污许可情况数据
export async function getVehicleTrajectory(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetVehicleTrajectoryByAppID', params, null);
  return result;
}
/** 获取指挥调度数据 */
export async function getcommanddispatchreport(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetCommandDispatchReport', params, null);
  return result;
}
