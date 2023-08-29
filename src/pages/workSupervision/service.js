import { post, get } from '@/utils/request';

// 仪器借出、归还
export async function StandbyAndInsLendOrReturn(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/StandbyAndInsLendOrReturn',
    params,
  );
  return result;
}

// 办事处删除
export async function DeleteOffice(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/DeleteOffice',
    params,
  );
  return result;
}

// 获取办事处人员(已经选过的办事处用户不会出现)
export async function GetAllUserByOffice(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/GetAllUserByOffice',
    params,
  );
  return result;
}

// 绑定办事处人员
export async function InsertOfficeByUser(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/InsertOfficeByUser',
    params,
  );
  return result;
}

// 获取已绑定的办事处用户
export async function GetUserByOfficeCode(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/GetUserByOfficeCode',
    params,
  );
  return result;
}

// 获取所有经理
export async function GetAllManager(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/GetAllManager',
    params,
  );
  return result;
}

// 办事处设置经理
export async function SetOfficeManager(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/SetOfficeManager',
    params,
  );
  return result;
}

// 获取工作台待办
export async function GetToDoDailyWorks(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/GetToDoDailyWorks?type=' +
      (params.type || ''),
    params,
  );
  return result;
}

// 获取工作台消息
export async function GetWorkBenchMsg(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/GetWorkBenchMsg',
    params,
  );
  return result;
}

// 结束任务
export async function endTask(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/FinishTasks',
    params,
  );
  return result;
}

// 手动申请任务
export async function manualTask(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/ManualApplicationTasks',
    params,
  );
  return result;
}

// 添加或编辑回访客户
export async function InsOrUpdReturnVisitCustomers(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/InsOrUpdReturnVisitCustomers',
    params,
  );
  return result;
}
// 获取所有客户
export async function getCustomerList(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/GetAllOtherCustomList',
    null,
  );
  return result;
}

// 获取维护的客户
export async function getOtherCustomerList(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/GetOtherCustomList',
    null,
  );
  return result;
}

// 添加编辑客户
export async function InsOrUpdOtherCustomer(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/InsOrUpdOtherCustom',
    params,
  );
  return result;
}

// 获取已配置的省区和大区
export async function GetRegionalAndProvince(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/GetRegionalAndProvince',
    params,
  );
  return result;
}

// 删除客户
export async function DeleteOtherCustom(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/DeleteOtherCustom?ID=' + params.ID,
    {},
  );
  return result;
}

// 查询回访客户记录
export async function GetReturnVisitCustomersList(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/GetReturnVisitCustomersList',
    params,
  );
  return result;
}

// 删除回访客户记录
export async function DeleteReturnVisitCustomers(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/DeleteReturnVisitCustomers?ID=' +
      params.ID,
    {},
  );
  return result;
}

// 添加、编辑人员培训表
export async function InsOrUpdPersonTrain(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/InsOrUpdPersonTrain',
    params,
  );
  return result;
}

// 查询人员培训提交记录
export async function GetPersonTrainList(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/GetPersonTrainList',
    params,
  );
  return result;
}

// 删除人员培训记录
export async function DeletePersonTrain(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/DeletePersonTrain?AttachId=' + params.ID,
    {},
  );
  return result;
}

// 获取办事处列表
export async function GetOfficeList(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/GetOfficeList',
    params,
  );
  return result;
}

// 添加、编辑办事处检查
export async function InsOrUpdOfficeCheck(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/InsOrUpdOfficeCheck',
    params,
  );
  return result;
}

// 办事处检查提交记录
export async function GetOfficeCheckList(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/GetOfficeCheckList',
    params,
  );
  return result;
}

// 删除办事处检查
export async function DeleteOfficeCheck(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/DeleteOfficeCheck?ID=' + params.ID,
    {},
  );
  return result;
}

// 添加或编辑现场工作/其它工作/其他部门工作记录
export async function InsOrUpdOtherWork(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/InsOrUpdOtherWork',
    params,
  );
  return result;
}

// 查询现场工作/其它工作/其他部门工作记录
export async function GetOtherWorkList(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/GetOtherWorkList',
    params,
  );
  return result;
}

// 删除现场工作/其它工作/其他部门工作记录
export async function DeleteOtherWork(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/DeleteOtherWork?ID=' + params.ID,
    {},
  );
  return result;
}

// 导出任务单记录
export async function exportTaskRecord(params) {
  const result = await post(
    `/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/${params.apiName}`,
    {
      ...params,
      apiName: undefined,
    },
  );
  return result;
}

// 获取所有用户
export async function GetAllUser(params) {
  const result = await post('/api/rest/PollutantSourceApi/AuthorApi/GetAllUser', params);
  return result;
}

// 添加、编辑检查考勤和日志记录
export async function InsOrUpdCheckAttendance(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/InsOrUpdCheckAttendance',
    params,
  );
  return result;
}

// 查询检查考勤和日志记录
export async function GetCheckAttendanceRecordList(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/GetCheckAttendanceRecordList',
    params,
  );
  return result;
}

// 删除 检查考勤和日志记录
export async function DeleteCheckAttendanceRecord(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/DeleteCheckAttendanceRecord?ID=' +
    params.ID,
    {},
  );
  return result;
}

// 根据考勤和日志记录ID获取数据
export async function GetCheckAttendanceLogList(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/GetCheckAttendanceLogList?ID=' + params.ID,
    {},
  );
  return result;
}

// 获取统计数据
export async function getStatisticsData(params) {
  const result = await post(
    `/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/${params.apiName}`,
    {
      ...params,
      apiName: undefined,
    },
  );
  return result;
}

// 导出统计数据
export async function exportStatisticsData(params) {
  const result = await post(
    `/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/${params.apiName}`,
    {
      ...params,
      apiName: undefined,
    },
  );
  return result;
}

// 获取 现场工作/其它工作/其他部门工作统计
export async function StatisticsOtherWork(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/StatisticsOtherWork',
    params,
  );
  return result;
}

// 导出 现场工作/其它工作/其他部门工作统计
export async function ExportStatisticsOtherWork(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/ExportStatisticsOtherWork',
    params,
  );
  return result;
}

// 获取行业
export async function GetPollutantTypeList(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/GetPollutantTypeList',
    params,
  );
  return result;
}

// 获取项目
export async function GetProjectInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetProjectInfoList', params);
  return result;
}

// 提交应收账款催收
export async function InsOrUpdAccountsReceivable(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/InsOrUpdAccountsReceivable',
    params,
  );
  return result;
}

// 删除应收账款催收记录
export async function DeleteAccountsReceivable(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/DeleteAccountsReceivable?ID=' + params.ID,
    {},
  );
  return result;
}

// 查询应收账款催收记录
export async function GetAccountsReceivableList(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/GetAccountsReceivableList',
    params,
  );
  return result;
}

// 应收账款催收统计
export async function StatisticsAccountsReceivable(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/StatisticsAccountsReceivable',
    params,
  );
  return result;
}

// 撤销任务
export async function DeleteTasks(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/DeleteTasks',
    params,
  );
  return result;
}

// 获取运维或省区经理
export async function GetManagerByType(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/GetManagerByType?type=' + params.type,
    {},
  );
  return result;
}

// 转发任务单
export async function RetransmissionTasks(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/DailyWorkManagerApi/RetransmissionTasks',
    params,
  );
  return result;
}
// 运维服务
export async function GetStagingInspectorRectificationList(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/TaskFormApi/GetStagingInspectorRectificationList',
    params,
  );
  return result;
}

/**我的提醒 */


// 数据报警列表
export async function GetWorkAlarmPushList(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/OperationHomeApi/GetWorkAlarmPushList',
    params,
  );
  return result;
}
// 删除数据报警
export async function UpdateWorkPushStatus(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/OperationHomeApi/UpdateWorkPushStatus',
    params,
  );
  return result;
}

// 删除所有数据报警
export async function UpdateAllWorkPushStatus(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/OperationHomeApi/UpdateAllWorkPushStatus',
    params,
  );
  return result;
}

//合同到期列表
export async function GetProjectRemindList(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/OperationHomeApi/GetProjectRemindList',
    params,
  );
  return result;
}
// 删除合同到期
export async function UpdateProjectPushStatus(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/OperationHomeApi/UpdateProjectPushStatus',
    params,
  );
  return result;
}

// 删除所有合同到期
export async function UpdateAllProjectPushStatus(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/OperationHomeApi/UpdateAllProjectPushStatus',
    params,
  );
  return result;
}


// 获取工作台快捷导航列表 以及 可添加菜单列表
export async function GetUserMenuList(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/OperationHomeApi/GetUserMenuList',
    params,
  );
  return result;
}
// 添加快捷菜单
export async function AddUserMenu (params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/OperationHomeApi/AddUserMenu',
    params,
  );
  return result;
}
