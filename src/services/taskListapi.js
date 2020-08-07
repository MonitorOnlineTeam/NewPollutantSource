import { post, get, authorpost } from '@/utils/request';
import { EnumRejectFlag } from '../utils/enum';
// 污染源运维的相关接口
export async function GetTaskRecord(params) {
  const body = {
    TaskID: params.TaskID,
    DGIMN: params.DGIMN,
  };

  const result = await post('/api/rest/PollutantSourceApi/PTask/GetTaskDetails', body, null);
  return result === null ? { data: null } : result;
}

// 获取设备运维任务的历史记录
export async function GetMaintenanceTaskHistoryList(params) {
  const body = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    PointCode: params.PointCode,
    OperationsUserId: params.OperationsUserId,
    TaskCode: params.TaskCode,
    BeginTime: params.beginTime,
    EndTime: params.endTime,
    TaskContentType: params.TaskContentType,
    AuditStatus: params.AuditStatus,
    TaskStatus: params.TaskStatus,
    TaskFinishBeginTime: params.taskFinishBeginTime,
    TaskFinishEndTime: params.taskFinishEndTime,
    ItemNumber: params.ItemNum,
    RegionCode: params.RegionCode,
    EnterCode: params.EnterCode,
  };

  const result = await post('/api/rest/PollutantSourceApi/PTask/GetTaskList', body, null);
  return result === null ? { data: null } : result;
}

// 根据任务id和类型id获取易耗品列表
export async function GetConsumablesReplaceRecord(params) {
  const body = {
    TaskID: params.TaskID,
    TypeID: params.TypeID,
  };
  const result = await authorpost(
    '/api/rest/PollutantSourceApi/PTaskForm/GetConsumablesReplaceRecord?authorCode=48f3889c-af8d-401f-ada2-c383031af92d',
    body,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取易耗品历史记录列表
export async function GetConsumablesReplaceHistoryList(params) {
  const body = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    PointCode: params.PointCode,
    BeginTime: params.beginTime,
    EndTime: params.endTime,
    RegionCode: params.RegionCode,
    EnterCode: params.EnterCode,
  };

  const result = post(
    '/api/rest/PollutantSourceApi/PTaskForm/GetConsumablesReplaceHistoryList',
    body,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 根据任务id和类型id获取标气列表
export async function GetStandardGasReplaceRecord(params) {
  const body = {
    TaskID: params.TaskID,
  };
  const result = await authorpost(
    '/api/rest/PollutantSourceApi/PTaskForm/GetStandardGasReplaceRecord?authorCode=48f3889c-af8d-401f-ada2-c383031af92d',
    body,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取标气历史记录列表
export async function GetStandardGasReplaceHistoryList(params) {
  const body = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    PointCode: params.PointCode,
    BeginTime: params.beginTime,
    EndTime: params.endTime,
    RegionCode: params.RegionCode,
    EnterCode: params.EnterCode,
  };

  const result = post(
    '/api/rest/PollutantSourceApi/PTaskForm/GetStandardGasReplaceHistoryList',
    body,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 根据任务id和类型id获取试剂列表
export async function GetReagentReplaceRecord(params) {
  const body = {
    TaskID: params.TaskID,
  };
  const result = await authorpost(
    '/api/rest/PollutantSourceApi/PTaskForm/GetReagentReplaceRecord?authorCode=48f3889c-af8d-401f-ada2-c383031af92d',
    body,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取试剂历史记录列表
export async function GetReagentReplaceHistoryList(params) {
  const body = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    TypeID: params.TypeID,
    PointCode: params.PointCode,
    BeginTime: params.beginTime,
    EndTime: params.endTime,
    RegionCode: params.RegionCode,
    EnterCode: params.EnterCode,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/PTaskForm/GetReagentReplaceHistoryList',
    body,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 根据任务id和类型id获取备件列表
export async function GetSparePartReplaceRecord(params) {
  const body = {
    TaskID: params.TaskID,
    TypeID: params.TypeID,
  };
  const result = await authorpost(
    '/api/rest/PollutantSourceApi/PTaskForm/GetSparePartReplaceRecord?authorCode=48f3889c-af8d-401f-ada2-c383031af92d',
    body,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取备件历史记录列表
export async function GetSparePartReplaceHistoryList(params) {
  const body = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    TypeID: params.TypeID,
    PointCode: params.PointCode,
    BeginTime: params.beginTime,
    EndTime: params.endTime,
    RegionCode: params.RegionCode,
    EnterCode: params.EnterCode,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/PTaskForm/GetSparePartReplaceHistoryList',
    body,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 任务单列表
export async function queryAuditTaskList(params) {
  const result = post('/api/rest/PollutantSourceApi/PTask/GetApplicationForm', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 任务单审核
export async function taskAudit(params) {
  const result = post('/api/rest/PollutantSourceApi/PTask/ExamApplication', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 任务单撤销
export async function taskUndo(params) {
  const result = post('/api/rest/PollutantSourceApi/PTask/RevokeStaus', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 获取任务类型
export async function getTaskType(params) {
  const result = post('/api/rest/PollutantSourceApi/PTask/GetTaskContentType', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 获取监测点
export async function getInsertApplication(params) {
  const result = post('/api/rest/PollutantSourceApi/PPointAndData/InsertApplication', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 获取任务详情
export async function getTaskDetails(params) {
  const result = post('/api/rest/PollutantSourceApi/PTask/GetOneApplicationForm', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 审批单记录列表
export async function queryAllTaskAuditRecordList(params) {
  const result = post('/api/rest/PollutantSourceApi/PTask/GetApplicationFormByAdmin', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

/**
 * 基本管理-企业实体
 * @params {
   "EntCode": 1
 }
 */
export async function GetEnterListByName(params) {
  const body = {
    PollutantType: params.PollutantType,
  };
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/GetEnterListByName', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
/**
 * 获取监测点code-name
 * @params {}
 */
export async function GetPointInfoByEntNoPage(params) {
  const body = {
    EnterCode: params.EnterCode,
    PollutantType: params.PollutantType,
  };
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/GetPointInfoByEntNoPage', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
